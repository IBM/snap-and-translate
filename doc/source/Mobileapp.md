## 2. Update config values for the Mobile App

Edit `mobile/www/config.json` and update the setting with the Public IP address and NODE PORT retrieved previously.

```javascript
"SERVER_URL": "http://<replace_public_ip_address>:<replace_node_port>/uploadpic"
```
## 3. Install dependencies to build the mobile application

For this Code Pattern, you'll need to install the prerequisites, by following their respective documentation:

* [Java Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* [Node.js and npm](https://nodejs.org/en/download/) (`npm` version 4.5.0 or higher)
* [Android Studio](https://developer.android.com/studio/), which includes Android tools and gives you access to Android SDKs
* [Cordova](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html)
* [Gradle](https://gradle.org/install/)

You'll need to install the specific SDK appropriate for your mobile device. From `Android Studio`, download and install the desired API Level for the SDK. We are using Android API Level 23 as this is widely supported on most phones as of January, 2018. To do this:

* Launch `Android Studio` and accept all defaults.
* Click on the `SDK Manager` icon in the toolbar.
* Navigate to `Appearance & Behavior` -> `System Settings` -> `Android SDK`
* Select Android API level of your choice (Recommended Android 6.0 (Marshmallow) (API Level 23) and above).
* Click apply to download and install.

> Note: the `mobile/config.xml` is configured to build for Android API Level 23. Adjust this if you wish to build for a different API:
```
<preference name="android-targetSdkVersion" value="23" />
```

Once you have completed all of the required installs and setup, you should have the following environment variables set appropriately for your platform:

* `JAVA_HOME`
* `ANDROID_HOME`
* `PATH`

> Note: For additonal help setting these environment variables, refer to the  [Troubleshooting](#troubleshooting) section below.

## 5. Add Android/iOS platform and plug-ins

Start by adding the Android platform as the target for your mobile app.

```
$ cd snap-and-translate/mobile
$ cordova platform add android
$ cordova platform add ios
```

Ensure that everything has been installed correctly:

```
$ cordova requirements
```

Finally, install the plugins required by the application:

```
$ cordova plugin add cordova-plugin-camera
$ cordova plugin add cordova-plugin-file-transfer
```