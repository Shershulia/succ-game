#!/bin/bash

# Переход в директорию с исходниками WASM
cd src/wasm

# Собираем WebAssembly с таргетом "web"
wasm-pack build --target web

# Проверяем, что сборка прошла успешно
if [ $? -eq 0 ]; then
    echo "✅ WASM успешно собран, копируем файлы в public/"
    
    # Копируем файлы в public/ (создаём папку, если её нет)
    mkdir -p ../../public
    cp pkg/blackjack_wasm_bg.wasm ../../public/
    cp pkg/blackjack_wasm.js ../../public/

    echo "✅ Файлы успешно скопированы в public/"
else
    echo "❌ Ошибка при сборке WASM"
    exit 1
fi
