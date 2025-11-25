// ================== deploy.bat ==================


@echo off
cd %cd%
git add .
git commit -m "Auto update"
git push origin main
pause