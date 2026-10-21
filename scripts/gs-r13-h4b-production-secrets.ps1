<#
GS-R13-H4B step 4, owner-run, one command. Sets the six Production Edge secrets for the
synthetic-only intake. You paste only the Resend API key (hidden). Nothing is printed except names.

  powershell -NoProfile -ExecutionPolicy Bypass -File scripts\gs-r13-h4b-production-secrets.ps1 [-Sender verified]

Fixed values: GRIDSMITH_INTAKE_MODE=synthetic-only; GRIDSMITH_ALLOWED_ORIGINS=["https://gridsmith.uk"];
LEAD_NOTIFICATION_EMAIL=contact@gridsmith.uk; LEAD_NOTIFICATION_FROM is "Gridsmith <onboarding@resend.dev>"
(Resend's shared sender, delivered only to the Resend account owner, as Preview uses) unless
-Sender verified is given after gridsmith.uk is verified in Resend, then "Gridsmith <contact@gridsmith.uk>".
GRIDSMITH_WORKER_TOKEN is Production's legacy service_role JWT, read in this process from Supabase
and checked (role service_role, ref dqiutgmxillhsbzgnlsx). Values go to the CLI through a
temporary .env file with an owner-only ACL, deleted afterwards. -SelfTest writes and parses that
file with synthetic values only and contacts nothing.
#>
param([ValidateSet('shared', 'verified')][string]$Sender = 'shared', [switch]$SelfTest)
$ErrorActionPreference = 'Continue'
$Ref = 'dqiutgmxillhsbzgnlsx'; $Cli = @('--yes', 'supabase@2.119.0'); $RepoRoot = Split-Path -Parent $PSScriptRoot
$Expected = 'GRIDSMITH_ALLOWED_ORIGINS', 'GRIDSMITH_INTAKE_MODE', 'GRIDSMITH_WORKER_TOKEN', 'LEAD_NOTIFICATION_EMAIL', 'LEAD_NOTIFICATION_FROM', 'RESEND_API_KEY'
function Stop-With([string]$Text) { Write-Host "GS-R13: STOPPED - $Text" -ForegroundColor Yellow; exit 1 }

function Get-Claims([string]$Jwt) {
  $part = $Jwt.Split('.')[1].Replace('-', '+').Replace('_', '/'); $part += '=' * ((4 - $part.Length % 4) % 4)
  [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($part)) | ConvertFrom-Json
}

# dotenv single quotes are literal; every value here is free of single quotes (checked).
function Write-EnvFile([hashtable]$Values, [string]$Path) {
  foreach ($v in $Values.Values) { if ($v -match "['\r\n]") { Stop-With 'a value contains a quote or newline; nothing was written' } }
  $text = ($Values.Keys | Sort-Object | ForEach-Object { "$_='$($Values[$_])'" }) -join "`n"
  [IO.File]::WriteAllText($Path, $text + "`n", (New-Object Text.UTF8Encoding $false))
  & icacls $Path /inheritance:r /grant:r "$($env:USERNAME):F" | Out-Null
}

$from = if ($Sender -eq 'verified') { 'Gridsmith <contact@gridsmith.uk>' } else { 'Gridsmith <onboarding@resend.dev>' }
$values = @{ GRIDSMITH_INTAKE_MODE = 'synthetic-only'; GRIDSMITH_ALLOWED_ORIGINS = '["https://gridsmith.uk"]'
  LEAD_NOTIFICATION_EMAIL = 'contact@gridsmith.uk'; LEAD_NOTIFICATION_FROM = $from }
$tmp = [IO.Path]::Combine([IO.Path]::GetTempPath(), "gs-r13-secrets-$([Guid]::NewGuid()).env")

if ($SelfTest) {
  $values.RESEND_API_KEY = 're_SyntheticOnly0123456789abcdef'; $values.GRIDSMITH_WORKER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.synthetic.signature'
  try {
    Write-EnvFile $values $tmp
    Push-Location $RepoRoot
    $parsed = & node -e "const v=require('dotenv').parse(require('fs').readFileSync(process.argv[1]));process.stdout.write(JSON.stringify(v))" $tmp | ConvertFrom-Json
    Pop-Location
    $bad = @($Expected | Where-Object { $parsed.$_ -ne $values[$_] })
    if ($bad.Count -or @($parsed.PSObject.Properties).Count -ne 6) { Stop-With "selftest: env file did not parse back exactly ($($bad -join ','))" }
    Write-Host 'GS-R13: SELFTEST PASS - six names, every value (JSON origins, display-name sender) parses back exactly'
  } finally { Remove-Item $tmp -Force -ErrorAction SilentlyContinue }
  exit 0
}

Push-Location $RepoRoot
try {
  $project = (& npx @Cli projects list -o json 2>$null | Out-String | ConvertFrom-Json) | Where-Object { $_.ref -eq $Ref }
  if (-not $project -or $project.status -ne 'ACTIVE_HEALTHY') { Stop-With 'Production is not ACTIVE_HEALTHY' }
  $keys = (& npx @Cli projects api-keys --project-ref $Ref -o json 2>$null | Out-String | ConvertFrom-Json)
  $jwt = (@($keys) | ForEach-Object { $_ } | Where-Object { $_.name -eq 'service_role' -and $_.type -eq 'legacy' }).api_key
  if (-not $jwt) { Stop-With 'Production legacy service_role key not available' }
  $claims = Get-Claims $jwt
  if ($claims.role -ne 'service_role' -or $claims.ref -ne $Ref) { Stop-With 'the service_role key does not belong to Production' }
  $resend = Read-Host 'Resend API key (hidden)' -AsSecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($resend)
  try {
    $values.RESEND_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    if ($values.RESEND_API_KEY -notmatch '^re_[A-Za-z0-9_]{16,}$') { Stop-With 'that does not look like a Resend API key; nothing was written' }
    $values.GRIDSMITH_WORKER_TOKEN = $jwt
    Write-EnvFile $values $tmp
    & npx @Cli secrets set --project-ref $Ref --env-file $tmp 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) { Stop-With 'Supabase did not accept the secrets' }
  } finally {
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue; [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    $values.RESEND_API_KEY = $null; $values.GRIDSMITH_WORKER_TOKEN = $null; $jwt = $null
  }
  $names = ((& npx @Cli secrets list --project-ref $Ref -o json 2>$null | Out-String | ConvertFrom-Json) | ForEach-Object { $_ }).name
  $missing = @($Expected | Where-Object { $names -notcontains $_ })
  if ($missing.Count) { Stop-With "secrets missing after set: $($missing -join ', ')" }
  Write-Host "GS-R13: DONE - six Production secrets set (names verified; sender: $Sender). Tell Claude: secrets set."
} finally { Pop-Location }
