#!/bin/bash
# Peak Translation build script

echo "Building Peak Translation..."

# Compile TypeScript
npx tsc
if [ $? -ne 0 ]; then
  echo "TypeScript compilation failed!"
  exit 1
fi

# Copy static files
copyfiles -u 1 src/**/*.html src/**/*.css src/manifest.json dist/
if [ $? -ne 0 ]; then
  echo "File copying failed!"
  exit 1
fi

echo "Build completed successfully!"
echo "Extension is ready in the dist/ directory."