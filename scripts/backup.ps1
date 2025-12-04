$BackupDir = ".\backups"
$DbFile = ".\dev.db"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupDir\backup_$Timestamp.db"

# Create backup directory
New-Item -ItemType Directory -Force -Path $BackupDir

# Create backup
Copy-Item $DbFile $BackupFile

# Compress backup
Compress-Archive -Path $BackupFile -DestinationPath "$BackupFile.zip"
Remove-Item $BackupFile

# Keep only last 7 days
Get-ChildItem $BackupDir -Filter "backup_*.zip" | 
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } | 
  Remove-Item

Write-Host "Backup created: $BackupFile.zip"
