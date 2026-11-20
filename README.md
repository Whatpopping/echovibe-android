# EchoVibe Android

Robust, installable Android version of the EchoVibe music streaming app.

Built with React, Vite, Tailwind CSS, and Capacitor for native Android packaging.

## Features
- Discover trending tracks and playlists
- Search functionality (mock YouTube-style results)
- Play/pause, skip, volume control, progress bar
- Like songs, recently played
- Mobile-optimized bottom navigation and player
- Error handling and loading states

## Building the APK

Push to `main` triggers the GitHub Actions workflow which builds a debug APK.

Download the artifact from the Actions tab after the workflow completes (typically under the latest run).

### Local Development
```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

Requires Android Studio / SDK for local builds.

## Installation
Sideload the generated `app-debug.apk` on your Android device (enable unknown sources / install unknown apps).

App ID: `com.whatpopping.echovibe`

Note: This is a demo app with mock data. For production, integrate real music APIs.
