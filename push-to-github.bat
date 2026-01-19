@echo off
echo ========================================
echo StatMaxer RPG OS - Git Push Helper
echo ========================================
echo.

REM Add the new files
echo Adding new files...
git add package.json FINAL_DEPLOYMENT.md APK_BUILD_GUIDE.md
git commit -m "Add package.json and deployment guides"

echo.
echo ========================================
echo Ready to push to GitHub!
echo ========================================
echo.
echo This will open a browser window for authentication.
echo Please sign in with your HyperPenetrator02 account.
echo.
pause

REM Push to GitHub
git push origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================
    echo SUCCESS! Code pushed to GitHub!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Check GitHub Actions: https://github.com/HyperPenetrator02/daily-tracker/actions
    echo 2. Wait for APK build to complete
    echo 3. Download APK from Releases tab
    echo.
    echo Your web app is live at:
    echo https://hyperpenetrator02.github.io/daily-tracker/
    echo.
) else (
    echo ========================================
    echo PUSH FAILED - Authentication Issue
    echo ========================================
    echo.
    echo Please try one of these methods:
    echo.
    echo METHOD 1: GitHub Desktop (Easiest)
    echo   1. Download: https://desktop.github.com/
    echo   2. Sign in with HyperPenetrator02
    echo   3. Add this repository
    echo   4. Click Push
    echo.
    echo METHOD 2: Personal Access Token
    echo   1. Create token: https://github.com/settings/tokens
    echo   2. Run: git push https://YOUR_TOKEN@github.com/HyperPenetrator02/daily-tracker.git main
    echo.
    echo METHOD 3: Use PWABuilder for APK
    echo   1. Visit: https://www.pwabuilder.com/
    echo   2. Enter: https://hyperpenetrator02.github.io/daily-tracker/
    echo   3. Download APK
    echo.
)

pause
