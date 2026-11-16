@echo off
title Imesh Kaushalya — Public Cloud Portfolio
cd /d "%~dp0"

if not exist "node_modules\" (
    echo [!] Installing dependencies...
    call npm install
)

if not exist "dist\" (
    echo [!] Building production bundle...
    call npm run build
)

node serve.js
pause
