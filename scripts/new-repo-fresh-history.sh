#!/usr/bin/env bash
set -euo pipefail

# Bootstrap this project as a brand-new repository with fresh history.
# Default behavior:
# 1) Remove .git
# 2) Re-init repository on main
# 3) Create first commit with current working tree
# 4) Optionally add/push origin

BRANCH="main"
COMMIT_MSG="chore: bootstrap new SaaS project from starter"
REMOTE_URL=""
NO_PUSH=0
YES=0

usage() {
  cat <<'EOF'
Usage:
  bash scripts/new-repo-fresh-history.sh [options]

Options:
  --remote <url>     Git remote URL to set as origin (optional)
  --branch <name>    Branch name to initialize (default: main)
  --message <msg>    Initial commit message
  --no-push          Do not push after setting origin
  --yes              Skip interactive confirmation
  -h, --help         Show this help message

Examples:
  bash scripts/new-repo-fresh-history.sh --yes
  bash scripts/new-repo-fresh-history.sh --remote git@github.com:you/new-repo.git --yes
  bash scripts/new-repo-fresh-history.sh --remote https://github.com/you/new-repo.git --no-push --yes
EOF
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: required command '$1' not found."
    exit 1
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --remote)
      REMOTE_URL="${2:-}"
      shift 2
      ;;
    --branch)
      BRANCH="${2:-}"
      shift 2
      ;;
    --message)
      COMMIT_MSG="${2:-}"
      shift 2
      ;;
    --no-push)
      NO_PUSH=1
      shift
      ;;
    --yes)
      YES=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      usage
      exit 1
      ;;
  esac
done

require_cmd git

if [[ ! -f "package.json" || ! -d "app" || ! -d "components" ]]; then
  echo "Error: run this script from the project root."
  exit 1
fi

if [[ ! -d ".git" ]]; then
  echo "Error: .git directory not found. This script expects an existing git repo."
  exit 1
fi

if [[ "${YES}" -ne 1 ]]; then
  echo "This will permanently DELETE .git and all commit history for this clone."
  echo "Type RESET to continue:"
  read -r CONFIRM
  if [[ "${CONFIRM}" != "RESET" ]]; then
    echo "Aborted."
    exit 1
  fi
fi

echo "Step 1/4: removing old git history..."
rm -rf .git

echo "Step 2/4: initializing new repository..."
git init -b "${BRANCH}"

echo "Step 3/4: creating first commit..."
git add .
if ! git commit -m "${COMMIT_MSG}" >/dev/null 2>&1; then
  echo "Error: failed to commit."
  echo "Make sure git user.name and user.email are configured:"
  echo "  git config --global user.name \"Your Name\""
  echo "  git config --global user.email \"you@example.com\""
  exit 1
fi

if [[ -n "${REMOTE_URL}" ]]; then
  echo "Step 4/4: configuring remote origin..."
  git remote add origin "${REMOTE_URL}"
  if [[ "${NO_PUSH}" -eq 0 ]]; then
    echo "Pushing to origin/${BRANCH}..."
    git push -u origin "${BRANCH}"
  else
    echo "Push skipped (--no-push)."
  fi
else
  echo "Step 4/4: no remote provided, skipping remote setup."
fi

echo
echo "Done. Repository now has fresh history."
git log --oneline -n 1

