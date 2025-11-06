@echo off
:: E2E 测试快速运行脚本 (Windows)

echo 🚀 启动 E2E 测试...
echo.

REM 检查开发服务器是否运行
curl -s http://localhost:3001 >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ⚠️  开发服务器未启动，正在启动...
    start /B npm run dev
    echo ⏳ 等待服务器启动...
    timeout /t 5 /nobreak >nul

    REM 等待服务器可用
    set /a count=0
    :wait_loop
    curl -s http://localhost:3001 >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo ✅ 服务器已启动
        goto :server_ready
    )
    set /a count+=1
    if %count% equ 30 (
        echo ❌ 服务器启动失败
        exit /b 1
    )
    timeout /t 1 /nobreak >nul
    goto :wait_loop

    :server_ready
) else (
    echo ✅ 开发服务器已在运行
)

echo.
echo 🧪 运行 E2E 测试...
echo.

REM 运行测试
npm run test:e2e

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ 所有测试通过！
    exit /b 0
) else (
    echo.
    echo ❌ 测试失败
    exit /b 1
)
