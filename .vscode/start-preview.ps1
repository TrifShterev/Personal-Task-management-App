$listener = Get-NetTCPConnection -LocalPort 3101 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1

if ($listener) {
  Stop-Process -Id $listener.OwningProcess -Force
}

$nodeHome = Join-Path $env:LOCALAPPDATA "Programs\node-v26.10.0\node-v26.10.0-win-x64"
$npm = Join-Path $nodeHome "npm.cmd"
$env:Path = "$nodeHome;$env:Path"
$env:NEXT_DIST_DIR = ".next-build"
$env:BETTER_AUTH_SECRET = "cypress-local-test-secret-at-least-32-characters-long"
$env:BETTER_AUTH_URL = "http://127.0.0.1:3101"
$env:DATABASE_URL = "file:./data/cypress.db"

& $npm run build

if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

& $npm run start -- --hostname 127.0.0.1 --port 3101