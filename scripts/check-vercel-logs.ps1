<#
.SYNOPSIS
    Vercel deployment & runtime log diagnostic script for pioftina.gr (Antigravity helper).
.DESCRIPTION
    Queries Vercel deployments, build logs, and runtime request logs for project 'pioftina'.
.PARAMETER Mode
    Diagnostic mode: 'all' (default), 'errors', 'runtime', or 'build'.
.PARAMETER Since
    Optional time window for runtime logs (e.g., '1h', '30m').
.PARAMETER Limit
    Maximum runtime log lines to retrieve (default: 50).
.PARAMETER Follow
    Stream live runtime logs continuously (--follow).
.EXAMPLE
    .\scripts\check-vercel-logs.ps1
.EXAMPLE
    .\scripts\check-vercel-logs.ps1 -Mode errors
#>
[CmdletBinding()]
param (
    [ValidateSet("all", "errors", "runtime", "build")]
    [string]$Mode = "all",
    [string]$Since = "",
    [int]$Limit = 50,
    [switch]$Follow
)

$ErrorActionPreference = "Stop"
$repoRoot = (Get-Item $PSScriptRoot).Parent.FullName
Set-Location $repoRoot

if ($Follow) {
    Write-Host "Streaming live Vercel runtime logs for pioftina..." -ForegroundColor Cyan
    & vercel logs --project pioftina --follow
    exit $LASTEXITCODE
}

$cliArgs = @("src/tests/runner/vercel-diagnostics.ts", "--mode=$Mode", "--limit=$Limit")
if ($Since) {
    $cliArgs += "--since=$Since"
}

& npx tsx @cliArgs
exit $LASTEXITCODE
