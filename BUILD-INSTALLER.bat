@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ========================================
echo   Daily Tasks - Build Windows Installer
echo ========================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install the LTS version from https://nodejs.org/ then run this file again.
  pause
  exit /b 1
)
echo Installing app build tools. This requires an internet connection on first run...
call npm install
if errorlevel 1 (
  echo.
  echo Installation failed. Check your internet connection and try again.
  pause
  exit /b 1
)
echo.
echo Creating Windows installer...
call npm run dist
if errorlevel 1 (
  echo.
  echo Build failed. Please review the error above.
  pause
  exit /b 1
)
echo.
echo Done! Open the dist folder and run Daily-Tasks-Setup-1.0.0.exe
pause
