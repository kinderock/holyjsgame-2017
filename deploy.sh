#!/usr/bin/env bash
npm run build
rsync build/ rs:/var/www/holygame --delete -r