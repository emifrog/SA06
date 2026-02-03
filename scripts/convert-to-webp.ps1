# Script de conversion des images en WebP
# Prerequis: Installer cwebp depuis https://developers.google.com/speed/webp/download
# Ou utiliser: winget install Google.WebP

param(
    [string]$ImagePath = "..\images",
    [int]$Quality = 80
)

Write-Host "=== Conversion des images en WebP ===" -ForegroundColor Cyan
Write-Host ""

# Verifier si cwebp est installe
$cwebpPath = Get-Command cwebp -ErrorAction SilentlyContinue

if (-not $cwebpPath) {
    Write-Host "ERREUR: cwebp n'est pas installe." -ForegroundColor Red
    Write-Host ""
    Write-Host "Pour installer cwebp:" -ForegroundColor Yellow
    Write-Host "  Option 1: winget install Google.WebP"
    Write-Host "  Option 2: Telecharger depuis https://developers.google.com/speed/webp/download"
    Write-Host ""
    exit 1
}

Write-Host "cwebp trouve: $($cwebpPath.Source)" -ForegroundColor Green
Write-Host ""

# Resoudre le chemin
$resolvedPath = Resolve-Path $ImagePath -ErrorAction SilentlyContinue
if (-not $resolvedPath) {
    Write-Host "ERREUR: Le dossier '$ImagePath' n'existe pas." -ForegroundColor Red
    exit 1
}

Write-Host "Dossier source: $resolvedPath" -ForegroundColor Gray
Write-Host "Qualite WebP: $Quality%" -ForegroundColor Gray
Write-Host ""

# Trouver toutes les images JPG et PNG
$images = Get-ChildItem -Path $resolvedPath -Recurse -Include "*.jpg", "*.jpeg", "*.png" |
    Where-Object { $_.Name -notmatch "logo-192x192|logo-512x512|favicon" }

$total = $images.Count
$converted = 0
$skipped = 0
$errors = 0

Write-Host "Images trouvees: $total" -ForegroundColor Cyan
Write-Host ""

foreach ($image in $images) {
    $outputPath = [System.IO.Path]::ChangeExtension($image.FullName, ".webp")
    $relativePath = $image.FullName.Replace($resolvedPath.Path, "").TrimStart("\")

    # Verifier si le fichier WebP existe deja et est plus recent
    if (Test-Path $outputPath) {
        $webpDate = (Get-Item $outputPath).LastWriteTime
        if ($webpDate -gt $image.LastWriteTime) {
            Write-Host "  [SKIP] $relativePath (WebP deja a jour)" -ForegroundColor DarkGray
            $skipped++
            continue
        }
    }

    Write-Host "  [CONV] $relativePath" -ForegroundColor White -NoNewline

    try {
        $result = & cwebp -q $Quality "$($image.FullName)" -o "$outputPath" 2>&1

        if ($LASTEXITCODE -eq 0) {
            $originalSize = [math]::Round($image.Length / 1KB, 1)
            $webpSize = [math]::Round((Get-Item $outputPath).Length / 1KB, 1)
            $reduction = [math]::Round((1 - $webpSize / $originalSize) * 100, 0)

            Write-Host " -> OK ($originalSize KB -> $webpSize KB, -$reduction%)" -ForegroundColor Green
            $converted++
        } else {
            Write-Host " -> ERREUR" -ForegroundColor Red
            $errors++
        }
    } catch {
        Write-Host " -> ERREUR: $_" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "=== Resultat ===" -ForegroundColor Cyan
Write-Host "  Converties: $converted" -ForegroundColor Green
Write-Host "  Ignorees:   $skipped" -ForegroundColor DarkGray
Write-Host "  Erreurs:    $errors" -ForegroundColor $(if ($errors -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if ($converted -gt 0) {
    Write-Host "Les images WebP ont ete creees dans le meme dossier que les originales." -ForegroundColor Yellow
    Write-Host "Les balises <picture> dans le HTML utiliseront automatiquement les WebP si disponibles." -ForegroundColor Yellow
}
