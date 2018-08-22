# Deploy mobile application

Steps below will help you to deploy the `snap-and-translate/mobile` mobile application.

## 1. Update config values for the Mobile App

Edit `mobile/www/config.json` and update the setting with the Public IP address and NODE PORT( nodePort from `snap-and-translate/server/watson-lang-trans.yml`) retrieved previously.

```
"SERVER_URL": "http://<replace_public_ip_address>:<replace_node_port>/uploadpic"
```
## 2. Install Requirements to build the mobile application

For this Code Pattern, you'll need to at first install the prerequisites for Android and iOS, by following their respective documentation:

### 2a. [Android requirements](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#requirements-and-support)

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

> Note: For additonal help setting these environment variables, refer to the Troubleshooting section in README.

### 2b. [iOS requirements](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html#requirements-and-support)

* [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)
* [Deployment Tools](https://www.npmjs.com/package/ios-deploy)- To install it, run the following from command-line terminal: `npm install -g ios-deploy`

Installing Xcode will mostly set everything needed to get started with the native side of things. You should now be able to create and build a cordova project.

You need to do the following before deploying:

* Create a Provisioning Profile within the [iOS Provisioning Portal](https://developer.apple.com/ios/manage/overview/index.action). You can use its Development Provisioning Assistant to create and install the profile and certificate Xcode requires.

* Verify that the Code Signing Identity setting within the Code Signing section within the build settings is set to your provisioning profile name.


## 3. Add Android/iOS platform and plug-ins

Start by adding the Android/iOS platform as the target for your mobile app.

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

## 4. Build the App

Run the following command to build the project for all platforms:

```
$ cordova build
```

## 5. Run the App

Plug the mobile into your computer/laptop using USB cable and test the app directly by executing the command:

```
$ cordova run android (if you have android device)
$ cordova run ios (if you have iOS device)
```

> Android Studio will handle the transfer for you if you tether your Android device to your computer, and enable both `Developer Options` and `USB Debugging`.Please refer to documentation on your specific phone to set these options.

At this point, the app named `TranslateIt` should be on your mobile device. Use the camera button to take a photo of an image that has text or photo album button to select image from your album, and allow Tesseract OCR to extract text and Watson Language Translator to translate the recognized text.