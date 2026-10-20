<#
GS-R13-H4B step 1, owner-run: restore-proven Production backup with one hidden prompt.
You type only the Production database password; the address (user postgres.<ref>, session pooler
aws-1-eu-west-1, port 5432, database postgres) is fixed here, so nothing can be mistyped.

  powershell -NoProfile -ExecutionPolicy Bypass -File scripts\gs-r13-backup-production.ps1

It runs scripts/backup-production-db.mjs, which dumps public + gridsmith_private, saves the file
outside the repository with an owner-only ACL, restores it into a disposable local database and
compares counts, ledger and a lead fingerprint. The password exists only in this process's memory
and the child's environment, and is cleared afterwards. -DryRun shows the address shape only.
#>
param([switch]$DryRun)
$ErrorActionPreference = 'Continue'
$Ref = 'dqiutgmxillhsbzgnlsx'; $PoolerHost = 'aws-1-eu-west-1.pooler.supabase.com'
$RepoRoot = Split-Path -Parent $PSScriptRoot

$secure = if ($DryRun) { ConvertTo-SecureString 'DryRunOnly0123456789' -AsPlainText -Force } else { Read-Host 'Production database password (hidden)' -AsSecureString }
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
  $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  if (-not $plain) { Write-Host 'GS-R13: STOPPED - no password entered; nothing was read'; exit 1 }
  $url = "postgresql://postgres.${Ref}:$([Uri]::EscapeDataString($plain))@${PoolerHost}:5432/postgres"
  if ($DryRun) { Write-Host ('GS-R13: DRY RUN - address shape: ' + ($url -replace ':[^:@/]+@', ':<hidden>@')); exit 0 }
  $env:GS_PRODUCTION_DB_URL = $url; $env:GS_PRODUCTION_BACKUP_CONFIRM = 'read-production'
  Push-Location $RepoRoot
  try { & node scripts/backup-production-db.mjs; $code = $LASTEXITCODE } finally { Pop-Location }
  if ($code -eq 0) { Write-Host 'GS-R13: backup restore-proven. Tell Claude: backup done.' } else { Write-Host "GS-R13: backup NOT proven (exit $code); nothing in Production was changed" }
  exit $code
} finally {
  Remove-Item env:GS_PRODUCTION_DB_URL, env:GS_PRODUCTION_BACKUP_CONFIRM -ErrorAction SilentlyContinue
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr); $plain = $null; $url = $null
}
