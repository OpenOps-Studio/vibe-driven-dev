#!/bin/bash

# Configuration Rule Setup Script
# Use this script to instantiate the {{PROJECT_NAME}} coding rules for your project.

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== {{PROJECT_NAME}} Rules Setup ===${NC}"

# 1. Get Project Information
if [ -z "$1" ]; then
    echo "Enter your Project Name (e.g., My Awesome App): "
    read PROJECT_NAME
else
    PROJECT_NAME=$1
fi

PROJECT_NAME_LOWER=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')

echo -e "Setting up rules for ${GREEN}$PROJECT_NAME${NC}..."

# 2. Replace Placeholders
find . -type f -not -path '*/.*' -not -name 'setup.sh' -not -name 'config.json.template' -exec sed -i '' "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" {} +
find . -type f -not -path '*/.*' -not -name 'setup.sh' -not -name 'config.json.template' -exec sed -i '' "s/{{PROJECT_NAME_LOWER}}/$PROJECT_NAME_LOWER/g" {} +

# 3. Initialize config.json if it doesn't exist
if [ ! -f "config.json" ]; then
    cp config.json.template config.json
    sed -i '' "s/Your Project Name/$PROJECT_NAME/g" config.json
    sed -i '' "s/your-project-name/$PROJECT_NAME_LOWER/g" config.json
    echo -e "${GREEN}Created config.json${NC}"
fi

echo -e "${GREEN}Successfully generalized and setup rules for $PROJECT_NAME!${NC}"
echo -e "You can now customize ${BLUE}config.json${NC} for further project-specific details."
