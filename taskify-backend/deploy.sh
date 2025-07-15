#!/bin/bash

# Taskify Backend 部署腳本
# 功能：構建 Docker 映像檔並重新部署 docker-compose 服務

set -e  # 如果任何命令失敗就停止腳本

echo "🚀 開始 Taskify Backend 部署流程..."

# 檢查 docker 和 docker-compose 是否安裝
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安裝，請先安裝 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! command -v docker &> /dev/null; then
    echo "❌ Docker Compose 未安裝，請先安裝 Docker Compose"
    exit 1
fi

# 設定變數
COMPOSE_FILE="compose.yaml"
APP_SERVICE="app"

echo "📦 步驟 1: 停止現有的服務..."
docker-compose -f $COMPOSE_FILE down

echo "🔨 步驟 2: 建構新的 Docker 映像檔..."
# 移除舊的映像檔（可選，節省空間）
docker-compose -f $COMPOSE_FILE build --no-cache $APP_SERVICE

echo "🧹 步驟 3: 清理未使用的映像檔..."
docker image prune -f

echo "🚀 步驟 4: 啟動所有服務..."
docker-compose -f $COMPOSE_FILE up -d

echo "⏳ 等待服務啟動..."
sleep 10

echo "📊 檢查服務狀態..."
docker-compose -f $COMPOSE_FILE ps

echo "📝 檢查應用程式日誌..."
docker-compose -f $COMPOSE_FILE logs --tail=20 $APP_SERVICE

echo "✅ 部署完成！"
echo "🌐 應用程式應該在 http://localhost:8088 運行"
echo "🗄️  資料庫可在 localhost:5434 存取"
echo "🛠️  PgAdmin 可在 http://localhost:5050 存取"

echo ""
echo "💡 有用的命令："
echo "   查看日誌: docker-compose -f $COMPOSE_FILE logs -f $APP_SERVICE"
echo "   停止服務: docker-compose -f $COMPOSE_FILE down"
echo "   重新啟動: docker-compose -f $COMPOSE_FILE restart $APP_SERVICE"
