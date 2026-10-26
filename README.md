# Neon Switch — Android project v1.0

This ZIP contains source code, not an APK. Android compilation and device testing have not been performed in this environment because Java/Android SDK are absent and downloads are blocked.

## Easiest route: build on GitHub
1. Extract the ZIP. Create an empty repository on GitHub.
2. Upload the CONTENTS of the NeonSwitch folder to its repository root, including the hidden .github folder. The workflow must be at .github/workflows/build-apk.yml.
   Using Git to push the whole folder preserves hidden files. If using the website, check that the workflow appears at the exact path above.
3. Open Actions, enable workflows if prompted, choose Build Android APK, and select Run workflow. Pushing to main/master also triggers it.
4. Wait for a green build. Open that run and download NeonSwitch-debug-APK under Artifacts (sign-in required).
5. Extract the downloaded artifact ZIP. Transfer app-debug.apk to your Android phone and open it. Allow installation from the app opening the file if Android asks.

The workflow is prepared, not executed. It builds a debug-signed personal-test APK. Each fresh cloud runner generates a new debug signing key; if a later build cannot update an old installation, uninstall the old version first (this removes progress). Retain a private signing key for long-term distribution. Play Store publication needs a release signing setup and separate store preparation.

## Android Studio route
Requirements: Android Studio supporting AGP 8.7.3, JDK 17, Gradle 8.9, Android SDK platform 35 and build-tools 35.0.0. Runtime minimum: Android 8.0 (API 26).

This archive has no Gradle wrapper binaries because the environment cannot download them.
1. Install Gradle 8.9 and put it on PATH.
2. Open a terminal in this NeonSwitch folder and run:
   gradle wrapper --gradle-version 8.9
3. Open the folder in Android Studio and let it sync.
4. Install SDK 35 with SDK Manager. If needed, use your own local.properties with sdk.dir pointing to your SDK.
5. Build from Android Studio, or run on Windows:
   gradlew.bat :app:assembleDebug :app:lintDebug
   On macOS/Linux:
   ./gradlew :app:assembleDebug :app:lintDebug
6. Output: app/build/outputs/apk/debug/app-debug.apk

Alternatively configure Android Studio to use a local Gradle 8.9 distribution.

## Game
Tap the playfield or SWITCH to swap lanes. Dodge pink blocks; gold gems award points and currency. Every three consecutive gems increases the points multiplier, capped at x4. Missing a gem resets the combo. A blue shield absorbs one collision. Difficulty rises gradually. Spend gems on three additional cosmetic colors (50,100,150). Collect 30 gems in a local calendar day and claim 25 bonus gems.

The app bundles the game in an Android WebView and plays offline. No ads, purchases, analytics, accounts or internet permission. Records, wallet, colors and daily challenge are stored locally. Clearing app data or uninstalling removes them. Daily rewards use the device clock.

Pause is automatic when backgrounded and manual with the pause/Android back button. Resume with the in-game button. Use system Home/gestures to leave the app. Keep Android System WebView updated.

## Verification
Run: node tests/game-rules.cjs
These checks evaluate the actual bundled game script with a mocked UI. They cover collecting gems, combos, missed gems, shield collisions, fatal collisions, daily reward duplication, color purchases, insufficient funds, and pausing from menus.
Android build/lint and device behavior remain unverified. Check touch responsiveness, sound, persistence after process restart, screen insets and background/resume on an Android phone before distribution.
