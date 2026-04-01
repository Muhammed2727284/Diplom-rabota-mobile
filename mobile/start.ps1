Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
Write-Host "Installing dependencies..."
npm install
Write-Host "Starting Expo..."
npx expo start
