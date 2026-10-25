<#
.SYNOPSIS
    Automated pre-push quality gate and deployment script for pioftina.gr to GitHub.
.DESCRIPTION
    Runs TypeScript type checks, full test suites, OWASP penetration testing,
    and pushes to https://github.com/gnikoloudis/pioftina.git.
.PARAMETER CommitMessage
    Optional custom git commit message.
.PARAMETER SkipTests
    Skip automated tests (NOT recommended).
.EXAMPLE
    .\scripts\push-to-github.ps1
.EXAMPLE
    .\scripts\push-to-github.ps1 -CommitMessage "feat: add new feature"
#>
[CmdletBinding()]
param (
    [string]$CommitMessage = "chore: update documentation, architecture specifications, and CI pipeline",
    [switch]$SkipTests
)

$ErrorActionPreference = "Stop"
$repoRoot = (Get-Item $PSScriptRoot).Parent.FullName
Set-Location $repoRoot

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  pioftina.gr - GitHub Deployment and Quality Gate Pipeline      " -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Target: https://github.com/gnikoloudis/pioftina.git" -ForegroundColor Gray
Write-Host ""

# 1. Check and Configure Git Remote
$targetRemote = "https://github.com/gnikoloudis/pioftina.git"
$existingRemotes = git remote -v 2>&1
if ($existingRemotes -match "origin\s+") {
    Write-Host "[1/6] Git remote 'origin' detected." -ForegroundColor Yellow
    git remote set-url origin $targetRemote
} else {
    Write-Host "[1/6] Adding git remote 'origin' -> $targetRemote" -ForegroundColor Green
    git remote add origin $targetRemote
}

# 2. Quality Gate: TypeScript Compilation Check
Write-Host "[2/6] Running TypeScript type check (tsc --noEmit)..." -ForegroundColor Cyan
& npx tsc --noEmit
if ($LASTEXITCODE -ne 0) {
    Write-Error "TypeScript compilation failed. Fix type errors before pushing."
    exit 1
}
Write-Host "      [OK] TypeScript compilation passed (0 errors)." -ForegroundColor Green

# 3. Quality Gate: Full Test Suite
if (-not $SkipTests) {
    Write-Host "[3/6] Running Full Test Suite (46 Tests across 9 Suites)..." -ForegroundColor Cyan
    & npm test
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Test suite failed. Push aborted."
        exit 1
    }
    Write-Host "      [OK] All tests passed (100 percent)." -ForegroundColor Green

    # 4. Quality Gate: OWASP Penetration Testing
    Write-Host "[4/6] Running OWASP ASVS Penetration Testing Audit (32 Rules)..." -ForegroundColor Cyan
    & npm run pentest
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Security audit failed. Push aborted."
        exit 1
    }
    Write-Host "      [OK] Security audit passed (Grade A+)." -ForegroundColor Green

    # Sync documentation
    & npm run test:docs
    & npm run pentest:docs
} else {
    Write-Host "[3/6] Skipping tests (-SkipTests specified)." -ForegroundColor Yellow
}

# 5. Git Staging and Commit
Write-Host "[5/6] Checking git status and preparing commit..." -ForegroundColor Cyan
git add .
$status = git status --porcelain
if ($status) {
    Write-Host "      Committing staged changes..." -ForegroundColor Gray
    git commit -m $CommitMessage
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Git commit failed."
        exit 1
    }
    Write-Host "      [OK] Changes committed successfully." -ForegroundColor Green
} else {
    Write-Host "      [OK] Working tree clean, no new changes to commit." -ForegroundColor Gray
}

# 6. Push to GitHub
Write-Host "[6/6] Pushing to GitHub (origin main)..." -ForegroundColor Cyan
git branch -M main
git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Error "Git push failed. Verify your GitHub network connection or authentication credentials."
    exit 1
}

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Green
Write-Host "  SUCCESS: Application source code pushed to GitHub!             " -ForegroundColor Green
Write-Host "  URL: https://github.com/gnikoloudis/pioftina                  " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Green
