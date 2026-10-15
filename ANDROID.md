# SYM CREW Android

Android 7.0+ with Android System WebView 107+ native Capacitor app (`com.symcrew.tekkenatlas`), with the website's React UI bundled inside the APK. It does not load the website in place of local app assets. The 41 character snapshots, move facts, story code and artwork ship with the app; cloud comments, authentication and player queries require a network connection. The existing data provenance and missing/conditional fields still apply.

## Download and install

After the main Pages workflow succeeds, visit:

- Download page: https://novpan356.github.io/second-one/#download
- APK: https://novpan356.github.io/second-one/downloads/SYM-CREW-Android.apk
- Checksum: https://novpan356.github.io/second-one/downloads/SHA256SUMS.txt

Download the APK on Android and open it from Downloads. If Android asks, allow installation from that browser/file manager for this installation. This is a direct-install preview, not a Google Play release. No camera, contacts, location or storage permission is requested.

The preview uses Android's debug signing process. CI caches its debug signing identity to support preview updates while that cache exists. It is not a permanent production signing arrangement: a cache eviction or eventual release-key change may require uninstalling the old preview, which removes device-only favorites and the anonymous session. A production signing key must be kept in private CI secrets/secure storage, never in the repository. No release-signing secret is embedded or published in this preview.

## Development

Node 24, Java 21, Android SDK platform 36 and build tools 36.0.0 are required for native builds. `npm ci`, then `npm run android:debug`. Use Android Studio to run the generated `android/` project on a device/emulator. `npm run android:sync` refreshes the bundled website and Capacitor plugins. `npm run android:icons` regenerates standard and adaptive launcher icons from `assets/branding/sym-crew-source.png`. The supplied reference was adapted using image generation; all adaptive icon artwork is inset inside the mask safe area.

The Pages workflow builds the web assets with the existing repository Supabase public variables, syncs those assets into Android, builds and lints the APK, verifies its signature, then includes the APK in the Pages artifact. Native Java source and Gradle wrapper are tracked. Copied web assets, Gradle outputs, SDK paths and signing files are ignored. APK files are not committed to Git history.

## Mobile behavior

- Five destinations in the bottom dock; other sections remain in the top menu.
- Compact fighter header and horizontally scrollable section tabs.
- Move rows become portrait cards: command, attack level, damage/startup, block/hit/CH frames, then outcome captions.
- Touch-sized controls, scrollable bottom-sheet dialogs, safe-area/keyboard support and an offline notice driven by native network connectivity (browser previews use browser connectivity).
- Android back closes a dialog first, then returns through navigation history. External HTTPS references open separately.
- Guest identities and local favorites are specific to each browser/app install. Signed-in favorites use the existing cloud account.
- Email confirmation/password-reset links use the existing HTTPS website, not an unregistered localhost callback. Confirmation opens in the browser; then sign in from the app. Password recovery completes on the website. This preview does not claim app-link handling.

`ATLAS_TEST_URL=http://127.0.0.1:5185 npm run test:mobile-ui` checks portrait widths, dock navigation, card contents, dialogs and offline presentation. CI also runs the bundled app on an Android 15 emulator with networking disabled, checking the roster, artwork, move details and Android back. Neither browser nor emulator checks replace testing on physical Android hardware.
