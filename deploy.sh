#!/bin/bash

set -e

ENV=$1

if [ -z "$ENV" ]; then
  echo "Usage: ./deploy.sh [staging|prod]"
  exit 1
fi

if [ "$ENV" == "staging" ]; then
  # This shares the same bucket as the existing website.
  URL="http://lancedb-website-staging.s3-website-us-east-1.amazonaws.com/blog"
  BUCKET_NAME="lancedb-website-staging"

  echo "☁️ Checking if credentials is present"
  echo "Ensure AWS environment variables (lancedb-devland) are exported from https://etoai.awsapps.com/start/#/?tab=accounts"
  aws s3 ls $BUCKET_NAME

  echo "📦 Building for staging..."
  hugo build

  echo "☁️ Uploading to S3: $BUCKET_NAME"
  aws s3 sync ./public s3://$BUCKET_NAME/blog

  echo "🌐 View site: $URL"

elif [ "$ENV" == "prod" ]; then
  URL="https://lancedb.com/blog"
  BUCKET_NAME="lancedb-blogs-v2"
  CLOUDFRONT_DIST_ID="E1Y5N3Q67ZCHWH"

  echo "☁️ Checking if credentials is present"
  echo "Ensure AWS environment variables (eto) are exported from https://etoai.awsapps.com/start/#/?tab=accounts"
  aws s3 ls $BUCKET_NAME

  echo "📦 Building for production..."
  sed -i.bak 's|http://lancedb-website-staging.s3-website-us-east-1.amazonaws.com|https://lancedb.com|' hugo.toml
  hugo build
  mv hugo.toml.bak hugo.toml

  echo "☁️ Uploading to S3: $BUCKET_NAME"
  aws s3 sync ./public s3://$BUCKET_NAME/blog

  echo "🚀 Invalidating CloudFront cache..."
  aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DIST_ID" --paths "/blog/*" "/blog"

  echo "✅ Production deployment complete."

  echo "🌐 View site: $URL"

else
  echo "❌ Unknown environment: $ENV"
  exit 1
fi

