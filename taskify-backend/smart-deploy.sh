#!/bin/bash

# 智能部署腳本 - 可選擇是否重新下載 dependencies

set -e

echo "🤖 Taskify Backend 智能部署"

# 設定變數
COMPOSE_FILE="compose.yaml"
APP_SERVICE="app"
FORCE_DEPS=false

# 解析命令列參數
while [[ $# -gt 0 ]]; do
    case $1 in
        --force-deps|-f)
            FORCE_DEPS=true
            shift
            ;;
        --help|-h)
            echo "使用方法: $0 [選項]"
            echo "選項:"
            echo "  -f, --force-deps    強制重新下載 dependencies"
            echo "  -h, --help         顯示此說明"
            exit 0
            ;;
        *)
            echo "未知參數: $1"
            echo "使用 $0 --help 查看說明"
            exit 1
            ;;
    esac
done

# 檢查 pom.xml 是否有變更（相對於上次 build）
POM_CHANGED=false
if [ -f ".last-build-pom-hash" ]; then
    CURRENT_POM_HASH=$(md5sum pom.xml | cut -d' ' -f1)
    LAST_POM_HASH=$(cat .last-build-pom-hash)
    if [ "$CURRENT_POM_HASH" != "$LAST_POM_HASH" ]; then
        POM_CHANGED=true
        echo "📦 偵測到 pom.xml 有變更"
    fi
else
    POM_CHANGED=true
    echo "📦 第一次建置"
fi

# 決定使用哪個 Dockerfile
if [ "$FORCE_DEPS" = true ] || [ "$POM_CHANGED" = true ]; then
    echo "🔄 將重新下載 dependencies..."
    DOCKERFILE="Dockerfile"
    BUILD_ARGS="--no-cache"
else
    echo "⚡ 使用快取，跳過 dependency 下載..."
    DOCKERFILE="Dockerfile.optimized"
    BUILD_ARGS=""
fi

echo "📦 停止現有服務..."
docker-compose -f $COMPOSE_FILE down

echo "🔨 建構 Docker 映像檔..."
docker-compose -f $COMPOSE_FILE build $BUILD_ARGS \
    --build-arg DOCKERFILE=$DOCKERFILE $APP_SERVICE

echo "🧹 清理未使用的映像檔..."
docker image prune -f

echo "🚀 啟動服務..."
docker-compose -f $COMPOSE_FILE up -d

# 記錄此次建置的 pom.xml hash
md5sum pom.xml | cut -d' ' -f1 > .last-build-pom-hash

echo "⏳ 等待服務啟動..."
sleep 10

echo "📊 檢查服務狀態..."
docker-compose -f $COMPOSE_FILE ps

echo "📝 檢查應用程式日誌..."
docker-compose -f $COMPOSE_FILE logs --tail=20 $APP_SERVICE

echo "✅ 智能部署完成！"
echo "🌐 應用程式在 http://localhost:8088 運行"

if [ "$POM_CHANGED" = false ] && [ "$FORCE_DEPS" = false ]; then
    echo "💡 使用了快取，節省了 dependency 下載時間！"
fi

echo ""
echo "💡 使用提示："
echo "   強制重新下載 dependencies: $0 --force-deps"
echo "   查看說明: $0 --help"
