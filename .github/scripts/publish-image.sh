#!/bin/bash
set -euo pipefail
echo "$DOCKERHUB_LOGIN_TOKEN" | docker login -u benjvi --password-stdin
make publish-image
