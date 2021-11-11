#!/bin/sh
npm run generate
# deploy migrations
npm run deploy
# host build app
npm run start
