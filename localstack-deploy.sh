#!/bin/bash
set -e

SHOULD_BOOTSTRAP=false

for arg in "$@"; do
  if [[ "$arg" == "--bootstrap" ]]; then
    SHOULD_BOOTSTRAP=true
  fi
done

echo "🛠️  Building lambda code..."
cd backend
npm run build || { echo "❌ Build failed"; exit 1; }

cd ../cdk

if $SHOULD_BOOTSTRAP; then
  echo "🚀 Bootstrapping CDK on localstack..."
  cdklocal bootstrap || { echo "❌ CDK bootstrap failed"; exit 1; }
fi

echo "📦 Deploying CDK stack to localstack..."
cdklocal deploy || { echo "❌ CDK deploy failed"; exit 1; }

echo "✅ Deployment complete!"
