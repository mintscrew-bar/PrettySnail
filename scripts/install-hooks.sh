#!/usr/bin/env bash
set -euo pipefail

git config core.hooksPath .githooks
echo "Hooks path set to .githooks."
