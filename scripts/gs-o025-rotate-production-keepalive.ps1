<#
GS-O025: owner-run, one command. Rotates the Production keep-alive credential end to end and
writes the GitHub secret only after a real login has been proven. Nothing to type except ROTATE.

  powershell -NoProfile -ExecutionPolicy Bypass -File scripts\gs-o025-rotate-production-keepalive.ps1

What it does, in order:
  1. Preflight (read-only): gh signed in, Docker running, Production ACTIVE_HEALTHY, role present.
  2. Asks you to type ROTATE. Anything else stops it with nothing changed.
  3. Generates a 40-character random password in memory. It is never printed, logged or saved.
  4. Sends only its SCRAM-SHA-256 verifier (a salted hash, not the password) to Postgres:
     ALTER ROLE gridsmith_keepalive PASSWORD '<verifier>'.
  5. Proves one read-only login as gridsmith_keepalive.<ref> through the session pooler
     aws-1-eu-west-1 (confirmed from Supabase's own pooler configuration).
  6. Only if that login works: writes GS_O025_PRODUCTION_DB_URL through gh's standard input
     (exact bytes, no trailing newline), then confirms the secret's update time moved.
Everything except the final status lines stays inside this process.

-SelfTest runs the same flow against a disposable local Supabase Postgres and never touches
Supabase or GitHub.
#>
param([switch]$SelfTest)
# Native tools write warnings to stderr; failures are checked explicitly through exit codes.
$ErrorActionPreference = 'Continue'
$Ref = 'dqiutgmxillhsbzgnlsx'
$PoolerHost = 'aws-1-eu-west-1.pooler.supabase.com'
$Repo = 'atikmurtaza/Gridsmith-Ltd'
$SecretName = 'GS_O025_PRODUCTION_DB_URL'
$Image = 'public.ecr.aws/supabase/postgres:17.6.1.167'
$Cli = @('--yes', 'supabase@2.119.0')
$RepoRoot = Split-Path -Parent $PSScriptRoot

function Say([string]$Text) { Write-Host "GS-O025: $Text" }
function Stop-With([string]$Text) { Write-Host "GS-O025: STOPPED - $Text" -ForegroundColor Yellow; exit 1 }

function New-RandomPassword([int]$Length = 40) {
  $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  $rng = [Security.Cryptography.RandomNumberGenerator]::Create(); $byte = New-Object byte[] 1
  $chars = New-Object System.Text.StringBuilder
  while ($chars.Length -lt $Length) {
    $rng.GetBytes($byte)
    if ($byte[0] -lt 248) { [void]$chars.Append($alphabet[$byte[0] % 62]) }  # 248 = 4 x 62: no modulo bias
  }
  $chars.ToString()
}

# RFC 5802 / PostgreSQL SCRAM-SHA-256 verifier. Letters and digits need no SASLprep.
function New-ScramVerifier([string]$Password) {
  $salt = New-Object byte[] 16; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($salt)
  $kdf = New-Object Security.Cryptography.Rfc2898DeriveBytes($Password, $salt, 4096, [Security.Cryptography.HashAlgorithmName]::SHA256)
  $salted = $kdf.GetBytes(32)
  $hmac = New-Object Security.Cryptography.HMACSHA256 (, $salted)
  $clientKey = $hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes('Client Key'))
  $serverKey = $hmac.ComputeHash([Text.Encoding]::UTF8.GetBytes('Server Key'))
  $storedKey = [Security.Cryptography.SHA256]::Create().ComputeHash($clientKey)
  'SCRAM-SHA-256$4096:' + [Convert]::ToBase64String($salt) + '$' + [Convert]::ToBase64String($storedKey) + ':' + [Convert]::ToBase64String($serverKey)
}

# One read-only login through a local client container. Values travel only as environment variables.
function Test-Login([string]$Server, [string]$User, [string]$Password, [string]$SslMode, [string]$Network) {
  $names = 'PGHOST', 'PGPORT', 'PGUSER', 'PGPASSWORD', 'PGDATABASE', 'PGSSLMODE', 'PGCONNECT_TIMEOUT'
  $values = $Server, '5432', $User, $Password, 'postgres', $SslMode, '15'
  for ($i = 0; $i -lt $names.Count; $i++) { Set-Item "env:$($names[$i])" $values[$i] }
  try {
    $dockerArgs = @('run', '--rm', '--pull', 'never') + $(if ($Network) { @('--network', $Network) } else { @() }) +
      ($names | ForEach-Object { @('-e', $_) }) + @($Image, 'psql', '-X', '-q', '-A', '-t', '-c', "select current_user || '|' || current_setting('transaction_read_only')")
    $out = (& docker @dockerArgs 2>&1 | Out-String)
  } finally { foreach ($n in $names) { Remove-Item "env:$n" -ErrorAction SilentlyContinue } }
  $lower = $out.ToLowerInvariant()
  if ($out -match 'gridsmith_keepalive\S*\|on') { return 'OK' }
  if ($lower -match 'tenant.*not found') { return 'POOLER ROUTING' }
  if ($lower -match 'password authentication failed') { return 'PASSWORD' }
  if ($lower -match 'could not translate host name|name or service not known') { return 'DNS' }
  if ($lower -match 'connection refused|timeout expired|network is unreachable|no route to host') { return 'NETWORK' }
  return 'UNCLASSIFIED'
}

# Writes a secret through gh's standard input with exact bytes: no argv, no file, no trailing newline.
function Set-GitHubSecret([string]$Value) {
  $psi = New-Object Diagnostics.ProcessStartInfo 'gh', "secret set $SecretName -R $Repo"
  $psi.UseShellExecute = $false; $psi.RedirectStandardInput = $true; $psi.RedirectStandardOutput = $true; $psi.RedirectStandardError = $true
  # Windows PowerShell's console encoding adds a UTF-8 byte-order mark to redirected stdin, which
  # would corrupt the secret's first bytes. Use BOM-free UTF-8 for this one write (measured: 143/143).
  $saved = [Console]::InputEncoding; [Console]::InputEncoding = New-Object Text.UTF8Encoding $false
  try { $p = [Diagnostics.Process]::Start($psi); $p.StandardInput.Write($Value); $p.StandardInput.Close(); $p.WaitForExit() }
  finally { [Console]::InputEncoding = $saved }
  if ($p.ExitCode -ne 0) { Stop-With 'gh could not write the secret; nothing else was changed after the password' }
}

# Windows PowerShell's ConvertFrom-Json emits a JSON array as one object; enumerate it before filtering.
function Get-SecretUpdated { ((& gh secret list -R $Repo --json name,updatedAt | Out-String | ConvertFrom-Json) | ForEach-Object { $_ } | Where-Object { $_.name -eq $SecretName }).updatedAt }

function Invoke-Rotation($ApplyVerifier, $TestLogin, $WriteSecret) {
  $password = New-RandomPassword
  try {
    & $ApplyVerifier (New-ScramVerifier $password)
    Say 'new password applied to the role (as a SCRAM verifier only)'
    $result = 'UNTESTED'
    foreach ($attempt in 1..3) {
      $result = & $TestLogin $password
      if ($result -eq 'OK') { break }
      if ($attempt -lt 3) { Start-Sleep -Seconds 15 }  # the pooler may briefly hold the old verifier
    }
    if ($result -ne 'OK') { Stop-With "login test result $result; the GitHub secret was NOT changed" }
    Say 'login proven: read-only session as gridsmith_keepalive'
    & $WriteSecret "postgresql://gridsmith_keepalive.$($script:TestRef):$password@$($script:TestHost):5432/postgres"
  } finally { $password = $null; [GC]::Collect() }
}

if ($SelfTest) {
  # Disposable target on a private Docker network; Supabase and GitHub are never contacted.
  $net = 'gs-o025-rotate-selftest'; $target = 'gs-o025-rotate-target'
  & docker network create $net | Out-Null
  & docker run -d --rm --pull never --name $target --network $net -e POSTGRES_PASSWORD=selftest-disposable $Image | Out-Null
  try {
    foreach ($i in 1..60) { & docker exec $target pg_isready -h 127.0.0.1 -U postgres -q 2>$null; if ($LASTEXITCODE -eq 0) { break }; Start-Sleep 2 }
    Start-Sleep 4
    Get-Content (Join-Path $PSScriptRoot 'gs-o025-keepalive-role.sql') -Raw | & docker exec -i $target psql -h 127.0.0.1 -U postgres -d postgres -q | Out-Null
    # The local server addresses the role without the pooler's .ref suffix.
    $script:TestRef = $Ref; $script:TestHost = $target; $written = $null
    Invoke-Rotation -ApplyVerifier { param($v) ("alter role gridsmith_keepalive login password '" + $v + "';") | & docker exec -i $target psql -h 127.0.0.1 -U postgres -d postgres -q -v ON_ERROR_STOP=1 | Out-Null; if ($LASTEXITCODE -ne 0) { Stop-With 'selftest could not apply the verifier' } } `
      -TestLogin { param($pw) Test-Login $target 'gridsmith_keepalive' $pw 'disable' $net } `
      -WriteSecret { param($value) $script:written = $value }
    if ($script:written -notmatch "^postgresql://gridsmith_keepalive\.${Ref}:[A-Za-z0-9]{40}@${target}:5432/postgres$") { Stop-With 'selftest secret value has the wrong shape' }
    $wrong = Test-Login $target 'gridsmith_keepalive' 'definitelyNotThePassword0123456789' 'disable' $net
    if ($wrong -ne 'PASSWORD') { Stop-With "selftest expected PASSWORD for a wrong password, got $wrong" }
    $stored = (& docker exec $target psql -h 127.0.0.1 -U supabase_admin -d postgres -A -t -c "select left(rolpassword, 14) from pg_authid where rolname = 'gridsmith_keepalive'").Trim()
    if ($stored -ne 'SCRAM-SHA-256$') { Stop-With "selftest stored password is not a SCRAM verifier ($stored)" }
    Say 'SELFTEST PASS: verifier accepted by Postgres, real login OK, wrong password = PASSWORD, secret shape correct, stored as SCRAM'
  } finally { & docker stop $target 2>$null | Out-Null; & docker network rm $net 2>$null | Out-Null }
  exit 0
}

# ---- Production (owner-run) -----------------------------------------------------------------
Say 'preflight (read-only)'
& gh auth status 2>$null | Out-Null; if ($LASTEXITCODE -ne 0) { Stop-With 'GitHub CLI is not signed in (run: gh auth login)' }
& docker info 2>$null | Out-Null; if ($LASTEXITCODE -ne 0) { Stop-With 'Docker Desktop is not running; start it and run this again' }
& docker image inspect $Image 2>$null | Out-Null; if ($LASTEXITCODE -ne 0) { Stop-With "the local image $Image is missing" }
Push-Location $RepoRoot
try {
  $project = (& npx @Cli projects list -o json 2>$null | Out-String | ConvertFrom-Json) | Where-Object { $_.ref -eq $Ref }
  if (-not $project -or $project.status -ne 'ACTIVE_HEALTHY') { Stop-With 'Production is not ACTIVE_HEALTHY; resume it in the Supabase dashboard first' }
  $role = (& npx @Cli db query --linked --project-ref $Ref --output json "select count(*)::int n from pg_roles where rolname = 'gridsmith_keepalive'" 2>$null | Out-String)
  if ($role -notmatch '"n":\s*1') { Stop-With 'the gridsmith_keepalive role is missing on Production' }
  Say "preflight OK: Production $Ref ACTIVE_HEALTHY, role present, Docker and gh ready"
  Write-Host ''
  Write-Host 'This sets a NEW password for gridsmith_keepalive on Production and then updates the GitHub'
  Write-Host "secret $SecretName. Nothing else is changed. Preview is not touched."
  if ((Read-Host 'Type ROTATE to continue') -cne 'ROTATE') { Stop-With 'not confirmed; nothing was changed' }
  $before = Get-SecretUpdated
  $script:TestRef = $Ref; $script:TestHost = $PoolerHost
  Invoke-Rotation -ApplyVerifier {
      param($v)
      $tmp = [IO.Path]::Combine([IO.Path]::GetTempPath(), "gs-o025-$([Guid]::NewGuid()).sql")
      try {
        [IO.File]::WriteAllText($tmp, "alter role gridsmith_keepalive login password '$v';")
        & icacls $tmp /inheritance:r /grant:r "$($env:USERNAME):F" | Out-Null
        & npx @Cli db query --linked --project-ref $Ref --file $tmp --output json 2>$null | Out-Null
        if ($LASTEXITCODE -ne 0) { Stop-With 'Supabase rejected the password change; nothing else was changed' }
      } finally { Remove-Item $tmp -Force -ErrorAction SilentlyContinue }
    } `
    -TestLogin { param($pw) Test-Login $PoolerHost "gridsmith_keepalive.$Ref" $pw 'require' $null } `
    -WriteSecret { param($value) Set-GitHubSecret $value }
  $after = Get-SecretUpdated
  if (-not $after -or $after -eq $before) { Stop-With 'the secret update time did not change; check with: gh secret list' }
  Say "DONE: login proven and $SecretName updated at $after. Tell Claude: rotation done."
} finally { Pop-Location }
