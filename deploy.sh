#!/bin/bash
npm run build
scp -r dist root@45.76.124.20:/var/www/countdownspecials.xyz/dist

