@echo off
setlocal
cd /d "%~dp0"
echo Starting Next.js Dev Server...
call npm run dev
