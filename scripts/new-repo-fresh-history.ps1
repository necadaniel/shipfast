[CmdletBinding()]
param(
  [string]$Remote = "",
  [string]$Branch = "main",
  [string]$Message = "chore: bootstrap new SaaS project from starter",
  [switch]$NoPush,
  [switch]$Yes,
  [switch]$Help
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Show-Usage {
  @"
Usage:
  pwsh ./scripts/new-repo-fresh-history.ps1 [options]

Options:
  -Remote <url>      Git remote URL to set as origin (optional)
  -Branch <name>     Branch name to initialize (default: main)
  -Message <msg>     Initial commit message
  -NoPush            Do not push after setting origin
  -Yes               Skip interactive confirmation
  -Help              Show this help message

Examples:
  pwsh ./scripts/new-repo-fresh-history.ps1 -Yes
  pwsh ./scripts/new-repo-fresh-history.ps1 -Remote git@github.com:you/new-repo.git -Yes
  pwsh ./scripts/new-repo-fresh-history.ps1 -Remote https://github.com/you/new-repo.git -NoPush -Yes
"@ | Write-Output
}

function Require-Command {
  param([Parameter(Mandatory = $true)][string]$Name)

  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Error: required command '$Name' not found."
  }
}

if ($Help) {
  Show-Usage
  exit 0
}

Require-Command -Name "git"

if (-not (Test-Path "package.json") -or -not (Test-Path "app" -PathType Container) -or -not (Test-Path "components" -PathType Container)) {
  throw "Error: run this script from the project root."
}

if (-not (Test-Path ".git" -PathType Container)) {
  throw "Error: .git directory not found. This script expects an existing git repo."
}

if (-not $Yes) {
  Write-Output "This will permanently DELETE .git and all commit history for this clone."
  $confirm = Read-Host "Type RESET to continue"
  if ($confirm -ne "RESET") {
    Write-Output "Aborted."
    exit 1
  }
}

Write-Output "Step 1/4: removing old git history..."
Remove-Item ".git" -Recurse -Force

Write-Output "Step 2/4: initializing new repository..."
git init -b $Branch | Out-Null

Write-Output "Step 3/4: creating first commit..."
git add .

$commitOutput = git commit -m $Message 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Output "Error: failed to commit."
  Write-Output "Make sure git user.name and user.email are configured:"
  Write-Output '  git config --global user.name "Your Name"'
  Write-Output '  git config --global user.email "you@example.com"'
  Write-Output $commitOutput
  exit 1
}

if ($Remote) {
  Write-Output "Step 4/4: configuring remote origin..."
  git remote add origin $Remote

  if (-not $NoPush) {
    Write-Output "Pushing to origin/$Branch..."
    git push -u origin $Branch
  } else {
    Write-Output "Push skipped (-NoPush)."
  }
} else {
  Write-Output "Step 4/4: no remote provided, skipping remote setup."
}

Write-Output ""
Write-Output "Done. Repository now has fresh history."
git log --oneline -n 1
