@echo off
REM Set repo local hooks path to .githooks
git config core.hooksPath ".githooks"
if %ERRORLEVEL% neq 0 (
  echo Failed to set hooks path. Make sure git is installed and this is a git repo.
  exit /b %ERRORLEVEL%
)
echo Hooks path set to .githooks. You can now commit to verify the pre-commit hook blocks reserved filenames.
exit /b 0
