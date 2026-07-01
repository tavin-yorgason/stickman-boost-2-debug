if (Get-Command py -ErrorAction SilentlyContinue) {
    py -m http.server
}
elseif (Get-Command python3 -ErrorAction SilentlyContinue) {
    python3 -m http.server
}
elseif (Get-Command python -ErrorAction SilentlyContinue) {
    python -m http.server
}
else {
    Write-Host "Python not found. Please install it before running this script."
}