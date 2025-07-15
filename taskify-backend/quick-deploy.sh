#!/bin/bash

# Taskify Backend 快速部署腳本
# 功能：只重新建構和部署 app 服務，保持資料庫運行

set -e

echo "⚡ 快速重新部署 Taskify Backend..."

# 設定變數
COMPOSE_FILE="compose.yaml"
APP_SERVICE="app"

echo "🛑 停止應用程式服務..."
docker-compose -f $COMPOSE_FILE stop $APP_SERVICE

echo "🔨 重新建構應用程式映像檔..."
docker-compose -f $COMPOSE_FILE build --no-cache $APP_SERVICE

echo "🚀 啟動應用程式服務..."
docker-compose -f $COMPOSE_FILE up -d $APP_SERVICE

echo "⏳ 等待應用程式啟動..."
sleep 5

echo "📝 檢查應用程式狀態..."
docker-compose -f $COMPOSE_FILE ps $APP_SERVICE

echo "📋 最新日誌："
docker-compose -f $COMPOSE_FILE logs --tail=10 $APP_SERVICE

echo "✅ 快速部署完成！應用程式在 http://localhost:8088"
