#!/bin/sh

echo "🔍 Running pre-commit checks..."
echo ""

echo "📋 Running ESLint (strict mode)..."
npm run lint:strict
if [ $? -ne 0 ]; then
  echo "❌ ESLint failed"
  exit 1
fi
echo "✅ ESLint passed"
echo ""

echo "🔍 Running TypeScript check..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ TypeScript check failed"
  exit 1
fi
echo "✅ TypeScript check passed"
echo ""

echo "🏗️ Building application..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi
echo "✅ Build successful"
echo ""

echo "🎉 All pre-commit checks passed! Ready to push."