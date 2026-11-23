@echo off
chcp 65001 > nul
echo ===================================================
echo     মৌখামার (Moukhamar) - ডেস্কটপ অ্যাপ রানার
echo ===================================================
echo.

cd /d "%~dp0"
echo ডেস্কটপ অ্যাপ চালু হচ্ছে...
start "" "node_modules\electron\dist\electron.exe" .
