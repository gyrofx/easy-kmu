#!/bin/bash

# Define the variables
gitRef=$(git rev-parse --short HEAD)
gitBranch=$(git rev-parse --abbrev-ref HEAD)
buildTime=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Create the typescript file
cat << EOF > src/buildInfo.ts
export const gitRef = "${gitRef}";
export const gitBranch = "${gitBranch}";
export const buildTime = "${buildTime}";
EOF
