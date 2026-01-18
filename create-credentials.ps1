# Script to create google-credentials.json from original service account JSON
# Usage: Paste your original JSON below, then run this script

Write-Host "📝 Instructions:" -ForegroundColor Cyan
Write-Host "1. Copy your ORIGINAL service account JSON from Google Cloud Console"
Write-Host "2. Paste it below (between the quotes in `$originalJson = ...`)"
Write-Host "3. Save this file and run: .\create-credentials.ps1"
Write-Host ""
Write-Host "Alternatively, if you have the JSON file already, just copy it to google-credentials.json"
Write-Host ""

# If you have the original JSON, paste it here:
$originalJson = @'
PASTE_YOUR_ORIGINAL_JSON_HERE
'@

if ($originalJson -eq "PASTE_YOUR_ORIGINAL_JSON_HERE") {
    Write-Host "⚠️  Please edit this script and paste your original JSON first!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or manually create google-credentials.json with your original JSON content." -ForegroundColor Yellow
    exit 1
}

try {
    # Validate JSON
    $jsonObj = $originalJson | ConvertFrom-Json
    $jsonObj | ConvertTo-Json -Depth 10 | Out-File -FilePath "google-credentials.json" -Encoding utf8 -NoNewline
    Write-Host "✅ Successfully created google-credentials.json" -ForegroundColor Green
    Write-Host "   File location: $PWD\google-credentials.json"
} catch {
    Write-Host "❌ Invalid JSON: $_" -ForegroundColor Red
    exit 1
}

