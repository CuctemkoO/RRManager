#!/bin/bash

# ==========================================
# Скрипт сборки SPK пакета для RRManager
# ==========================================
# Использование: ./build-package.sh [arch] [dsm_version] [version]
# Пример:        ./build-package.sh x64 7.0 1.0.0-1

set -e

# Параметры по умолчанию
ARCH=${1:-x64}
DSM_VERSION=${2:-7.0}
VERSION=${3:-1.0.0-1}

PACKAGE_NAME="rr-manager"
OUTPUT_DIR="packages"
BUILD_DIR="build_spk"

echo "🚀 Начало сборки пакета $PACKAGE_NAME"
echo "   Архитектура: $ARCH"
echo "   Версия DSM:  $DSM_VERSION"
echo "   Версия:      $VERSION"

# Очистка предыдущих сборок
rm -rf "$BUILD_DIR" "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"
mkdir -p "$BUILD_DIR/package"

# 1. Сборка frontend (Webpack)
echo "📦 Сборка frontend..."
npm run build

# 2. Копирование собранных файлов в структуру пакета
echo "📋 Копирование файлов..."
cp -r src/htdocs/* "$BUILD_DIR/package/"

# 3. Создание структуры SPK
SPK_ROOT="$BUILD_DIR/spk_root"
mkdir -p "$SPK_ROOT/conf"
mkdir -p "$SPK_ROOT/scripts"
mkdir -p "$SPK_ROOT/ui"
mkdir -p "$SPK_ROOT/WEB"

# Копирование конфига и скриптов
cp src/conf/privilege "$SPK_ROOT/conf/"
cp src/scripts/start-stop-status.sh "$SPK_ROOT/scripts/"
chmod +x "$SPK_ROOT/scripts/start-stop-status.sh"
cp src/ui/config.js "$SPK_ROOT/ui/"

# Копирование WEB файлов (наше приложение)
cp -r "$BUILD_DIR/package"/* "$SPK_ROOT/WEB/"

# 4. Создание INFO файла
echo "📝 Создание INFO файла..."
cat > "$SPK_ROOT/INFO" << EOF
package="$PACKAGE_NAME"
version="$VERSION"
arch="$ARCH"
description="RR Manager - Redpill Recovery Manager"
maintainer="CuctemkoO"
maintainer_url="https://github.com/CuctemkoO/RRmanager-v2"
create_by="spksrc"
dsm_min_ver="7.0"
dsm_max_ver="99.0"
startable="yes"
support_centralized_startstop="yes"
support_upgrade="yes"
install_depends=""
report_url="https://github.com/CuctemkoO/RRmanager-v2/issues"
EOF

# 5. Создание description files
echo "🌍 Создание описаний..."
cat > "$SPK_ROOT/descriptionenu.txt" << EOF
RR Manager is a web-based interface for managing Redpill Recovery configurations on Synology NAS.
Features:
- Easy configuration management
- Real-time status monitoring
- SSH terminal access
- Automatic updates
EOF

# 6. Архивация package.tgz
echo "🗜️ Архивация package.tgz..."
cd "$SPK_ROOT"
tar -czf "../package.tgz" --exclude='INFO' --exclude='descriptionenu.txt' *
cd - > /dev/null

# 7. Создание финального .spk архива
echo "📦 Создание финального .spk..."
cd "$BUILD_DIR"
SPK_FILE="../$OUTPUT_DIR/${PACKAGE_NAME}_${ARCH}_${DSM_VERSION}_${VERSION}.spk"
tar -czf "$SPK_FILE" package.tgz INFO descriptionenu.txt conf scripts ui
cd - > /dev/null

# 8. Очистка временных файлов
echo "🧹 Очистка..."
rm -rf "$BUILD_DIR"

echo "✅ Сборка завершена успешно!"
echo "📦 Пакет доступен: $SPK_FILE"
echo ""
echo "Для установки на Synology:"
echo "1. Загрузите файл .spk в DSM через Package Center"
echo "2. Выберите 'Manual Install' и укажите файл"
echo "3. Следуйте инструкциям мастера установки"
