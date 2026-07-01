#!/usr/bin/env bash

if command -v python3 >/dev/null 2>&1; then
    python3 -m http.server
elif command -v python >/dev/null 2>&1; then
    python -m http.server
else
    echo "Python not found. Please install it before running this script."
    exit 1
fi