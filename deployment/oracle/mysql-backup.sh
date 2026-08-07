#!/usr/bin/env bash
set -euo pipefail

# Create /etc/aacharyshree/backup.env with DB_NAME, DB_USERNAME, and
# DB_PASSWORD, chmod it 600, then install this script via cron.
source /etc/aacharyshree/backup.env

backup_dir=/var/backups/aacharyshree
timestamp=$(date -u +%Y-%m-%dT%H-%M-%SZ)
mkdir -p "$backup_dir"

mysqldump --single-transaction --quick --routines --events \
  -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_NAME" \
  | gzip > "$backup_dir/$DB_NAME-$timestamp.sql.gz"

# Retain 14 days locally. A copy must also be downloaded/stored off-server.
find "$backup_dir" -type f -name '*.sql.gz' -mtime +14 -delete
