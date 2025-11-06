#!/bin/bash

# E2E 测试快速运行脚本

echo "🚀 启动 E2E 测试..."
echo ""

# 检查开发服务器是否运行
if ! curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "⚠️  开发服务器未启动，正在启动..."
    npm run dev &
    DEV_PID=$!
    echo "⏳ 等待服务器启动..."
    sleep 5

    # 等待服务器可用
    for i in {1..30}; do
        if curl -s http://localhost:3001 > /dev/null 2>&1; then
            echo "✅ 服务器已启动"
            break
        fi
        if [ $i -eq 30 ]; then
            echo "❌ 服务器启动失败"
            kill $DEV_PID 2>/dev/null
            exit 1
        fi
        sleep 1
    done
else
    echo "✅ 开发服务器已在运行"
    DEV_PID=""
fi

echo ""
echo "🧪 运行 E2E 测试..."
echo ""

# 运行测试
if npm run test:e2e; then
    echo ""
    echo "✅ 所有测试通过！"
    EXIT_CODE=0
else
    echo ""
    echo "❌ 测试失败"
    EXIT_CODE=1
fi

# 清理
if [ ! -z "$DEV_PID" ]; then
    echo ""
    echo "🧹 停止开发服务器..."
    kill $DEV_PID 2>/dev/null
fi

exit $EXIT_CODE
