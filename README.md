[![Build Status](https://api.travis-ci.org/IBM/snap-and-translate.svg?branch=master)](https://travis-ci.org/IBM/snap-and-translate)

# Build a hybrid mobile app that can capture an image, recognize and translate text using Tesseract OCR & Watson Language Translator

In this Code Pattern, we will create a hybrid mobile app using Apache Cordova and Node.js server application running on IBM Cloud Kubernetes service that uses Tesseract OCR to recognize text in images, Watson Language Translator to translate the recognized text and Watson Natural Language Understanding to extract emotion,sentiment from the text. This mobile app translates the recognized text from the images captured or uploaded from the photo album.

When the reader has completed this Code Pattern, they will understand how to:

* Use the Cordova mobile framework to build and deploy mobile app.
* Create Node.js apps that capture, recognize and translate text using Watson services.
* Deploy Tesseract OCR on IBM Cloud Kubernetes service to recognize text and bind Watson service to cluster.
* Translate recognized text using Watson Language Translator.
* Extract sentiment, emotion from the text using Watson Natural Language Understanding.

![Architecture diagram](doc/source/images/architecture.png)

## Flow
1. The user interacts with the mobile app and captures an image or selects an image from the photo album.
2. The image is passed to the Node.js server application that is running on IBM Cloud Kubernetes service which uses Tesseract OCR to recognize text in an image.
3. Node.js app uses Watson language translator service to translate the recognized text and Watson Natural Language Understanding to return the sentiment & emotion of the translated text.
4. Recognized text,translated language,sentiment and emotion result is returned to the mobile app for display.

## Included components
* [IBM Cloud Kubernetes Service](https://cloud.ibm.com/docs/containers/container_index.html): IBM Cloud Kubernetes Service manages highly available apps inside Docker containers and Kubernetes clusters on the IBM Cloud.
* [Watson Language Translator](https://www.ibm.com/watson/services/language-translator/): IBM Watson Language Translator is a service that enables you to dynamically translate news, patents or conversational documents.
* [Watson Natural Language Understanding](https://www.ibm.com/watson/developercloud/natural-language-understanding.html): An IBM Cloud service that can analyze text to extract meta-data from content such as concepts, entities, keywords, categories, sentiment, emotion, relations, semantic roles, using natural language understanding. 

## Featured technologies
* [Apache Cordova](https://cordova.apache.org/): An open-source mobile development framework to build hybrid mobile apps.
* [Node.js](https://nodejs.org/): An open-source JavaScript run-time environment for executing server-side JavaScript code.
* [Tesseract OCR](https://github.com/tesseract-ocr/): An open-source Optical Character Recognition(OCR) engine.

# Watch the Video

TODO

# Steps

This Code Pattern contains several pieces. The Node.js server application running on IBM Cloud Kubernetes service communicates with the Tesseract OCR, Watson Language Translator and Watson Natural Language Understanding. Mobile application is built locally and run on the Android/iOS phone.


1. [Clone the repo](#1-clone-the-repo)
2. [Run the server application in a container on IBM Cloud with Kubernetes](#3-run-the-server-application-in-a-container-on-ibm-cloud-with-kubernetes)
3. [Run the server application locally using docker](#4-run-the-server-application-locally-using-docker)
4. [Run the mobile application](#5-run-the-mobile-application)

## 1. Clone the repo

Clone the `snap-and-translate` repo locally. In a terminal, run:

```
$ git clone https://github.com/IBM/snap-and-translate.git
$ cd snap-and-translate
```

Go to `Service Credentials` and save the `API Key` and `URL` for later use.

## 2. Run the server application in a container on IBM Cloud with Kubernetes

Steps below will help you to deploy the `snap-and-translate/server` application into a container running on IBM Cloud, using Kubernetes.

Install the [pre-requisites](https://github.com/IBM/container-service-getting-started-wt/tree/master/Lab%200) before you begin with the steps.

### Steps

* Follow the instructions to [Create a Kubernetes Cluster,Setup CLI, Setup Private registry and to set up your cluster environment](https://cloud.ibm.com/docs/containers/cs_tutorials.html#cs_cluster_tutorial).

* Set the Kubernetes environment to work with your cluster:

```
$ ibmcloud cs cluster-config <replace_with_your_cluster_name>
```

The output of this command will contain a KUBECONFIG environment variable that must be exported in order to set the context. Copy and paste the output in the terminal window. An example is:

```
$ export KUBECONFIG=/Users/riyaroy/.bluemix/plugins/container-service/clusters/<cluster_name>/kube-config-hou02-<cluster_name>.yml
```

* Add Language Translator & Natural Language Understanding service to your cluster

Add the Language Translator & Natural Language Understanding service to your IBM Cloud account by replacing with a name for your service instance.

```
$ ibmcloud service create language_translator lite <service_name>
$ ibmcloud service create natural-language-understanding free <service_name>
```

* Bind the Language Translator & Natural Language Understanding instance to the default Kubernetes namespace for the cluster. Later, you can create your own namespaces to manage user access to Kubernetes resources, but for now, use the default namespace. Kubernetes namespaces are different from the registry namespace you created earlier. Replace cluster name and service instance name.

```
$ ibmcloud cs cluster-service-bind --cluster <cluster_name> --namespace default --service <language_translate_service_name>
$ ibmcloud cs cluster-service-bind --cluster <cluster_name> --namespace default --service <nlu_service_name>
```

Your cluster is configured and your local environment is ready for you to start deploying apps into the cluster.

* Build a Docker image that includes the app files from `snap-and-translate/server` directory, and push the image to the IBM Cloud Container Registry namespace that you created. Replace <ibmcloud_container_registry_namespace> with IBM Cloud Container Registry namespace.

```
$ docker build -t registry.ng.bluemix.net/<ibmcloud_container_registry_namespace>/watsontesseract:1 .
```

* Push the image to IBM Cloud Container registry

```
$ docker push registry.ng.bluemix.net/<ibmcloud_container_registry_namespace>/watsontesseract:1
```

* Update the `image` in `watson-lang-trans.yml` with your image name which in this case is `watsontesseract`.

* Update the `namespace` in `watson-lang-trans.yml` with `<ibmcloud_container_registry_namespace>`

* Update the `tag` in `watson-lang-trans.yml` with the tag number you created during docker push which in this case is `1`.
 
* Run the configuration script.

```
$ kubectl apply -f watson-lang-trans.yml
```

* Get the public IP address by replacing the <cluster_name>. (Take a note of the Public IP address since it is required in the later steps) 

```
$ ibmcloud cs workers <cluster_name>
```

## 3. Run the server application locally using docker

### 1. Create language translation and natural language understanding service with IBM Cloud

If you do not already have a IBM Cloud account, [sign up for IBM Cloud](https://cloud.ibm.com/registration).
Create the following services:

* [**Watson Language Translator**](https://cloud.ibm.com/catalog/services/language-translator)
* [**Watson Natural Language Understanding**](https://cloud.ibm.com/catalog/services/natural-language-understanding)

### 2. Copy the `env.sample` to `.env` and replace the `IAM API` key and the `URL` that you got when you created the Watson language translation service. From terminal run:

```
$ cp env.sample .env

# Copy this file to .env and replace the credentials with
# your own before starting the app.

LANGUAGE_TRANSLATOR_IAM_APIKEY=<use iam apikey here>
LANGUAGE_TRANSLATOR_URL=<use url here>

## Un-comment and use either username+password or IAM apikey.
# NATURAL_LANGUAGE_UNDERSTANDING_USERNAME=<use natural language understanding username>
# NATURAL_LANGUAGE_UNDERSTANDING_PASSWORD=<use natural language understanding password>
NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY=<use natural language understanding iam API key>
NATURAL_LANGUAGE_UNDERSTANDING_URL=<use natural language understanding URL>
```	

### 3. Go to `server` folder and run the docker build. 

* Build the `snap-translate-server`. From terminal run: 

```
$ cd server
$ docker build -t snap-translate-server .
```
* Run the docker image. This will run the server app on port 3000. From terminal run:
```
docker run --rm -it -p 3000:3000 snap-translate-server
```
* You can now access the `server` API using URL: `http://localhost:3000`

## 4. Run the mobile application

Steps below will help you to deploy the `snap-and-translate/mobile` mobile application.

### 1. Update config values for the Mobile App

Edit `mobile/www/config.json` and update the setting with the Public IP address and NODE PORT( nodePort from `snap-and-translate/server/watson-lang-trans.yml`) retrieved previously.

```
"SERVER_URL": "http://<replace_public_ip_address>:<replace_node_port>/uploadpic"
```

* **Accessing local API from mobile app**

To access the local API from the mobile app, we can use a tool called `ngrok`. you can install `ngrok` using the link: `https://ngrok.com/`

After the docker build is running you can now run the `ngrok` command from the place where you have installed it. If `ngrok` is installed at location: `/usr/local/ngrok`, from terminal run:

```
$ ./usr/local/ngrok http 3000
```
The sample output of the above command is: 

![](doc/source/images/ngrok.png)


This will bind your local address to a public address at port 3000. Now you can replace the `SERVER_URL` to the `forwarding address` that can be retrieved from the screenshot above. As an example the `SERVER-URL` will now be:

```
"SERVER_URL": "http://b336a2d7.ngrok.io/uploadpic"
```

### 2. Install Requirements to build the mobile application

For this Code Pattern, you'll need to at first install the prerequisites for Android and iOS, by following their respective documentation:

#### 2a. [Android requirements](https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#requirements-and-support)

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

#### 2b. [iOS requirements](https://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html#requirements-and-support)

* [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)
* [Deployment Tools](https://www.npmjs.com/package/ios-deploy)- To install it, run the following from command-line terminal: `npm install -g ios-deploy`

Installing Xcode will mostly set everything needed to get started with the native side of things. You should now be able to create and build a cordova project.

You need to do the following before deploying:

* Create a Provisioning Profile within the [iOS Provisioning Portal](https://developer.apple.com/ios/manage/overview/index.action). You can use its Development Provisioning Assistant to create and install the profile and certificate Xcode requires.

* Verify that the Code Signing Identity setting within the Code Signing section within the build settings is set to your provisioning profile name.


### 3. Add Android/iOS platform and plug-ins

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

### 4. Build the App

Run the following command to build the project for all platforms:

```
$ cordova build
```

### 5. Run the App

Plug the mobile into your computer/laptop using USB cable and test the app directly by executing the command:

> Open the `TranslateIt.xcworkspace` from `mobile/platforms/ios` folder and code sign using Xcode.

```
$ cordova run android (if you have android device)
$ cordova run ios (if you have iOS device)
```


> Android Studio will handle the transfer for you if you tether your Android device to your computer, and enable both `Developer Options` and `USB Debugging`.Please refer to documentation on your specific phone to set these options.

At this point, the app named `TranslateIt` should be on your mobile device. Use the camera button to take a photo of an image that has text or photo album button to select image from your album, and allow Tesseract OCR to extract text and Watson Language Translator to translate the recognized text.

# Sample output

* Here is what the app looks like in an iPhone.

<img src="doc/source/images/output1.PNG" width="250"><img src="doc/source/images/output2.PNG" width="250"><img src="doc/source/images/output3.PNG" width="250">

* Here's the app translating a Spanish text from a road sign to English.

<img src="doc/source/images/output_2.png" width="250">

# Troubleshooting

* `cordova run android` error: Failure [INSTALL_FAILED_UPDATE_INCOMPATIBLE]

> The `TranslateIt` app is already installed on your phone and incompatible with the version you are now trying to run. Uninstall the current version and try again.

* `cordova run android` error: No target specified and no devices found, deploying to emulator

> Ensure that your phone is plugged into your computer and you can access it from the Android File Transfer utility (see Step #6 above).

* How to determine proper values for environment variables:

Open `Android Studio` and navigate to `File` -> `Project Structure` -> `SDK
Location`. This location value will serve as the base for your environment variables. For example, if the location is `/users/joe/Android/sdk`, then:

```
$ export ANDROID_HOME=/users/joe/Android/sdk
$ export ANDROID_SDK_HOME=/users/joe/Android/sdk/platforms/android-<api-level>
$ export PATH=${PATH}:/users/joe/Android/sdk/platform-tools:/users/joe/Android/sdk/tools
```

* `ibmcloud cs cluster-service-bind --cluster <cluster_name> --namespace default --service <watson_service_name>`

Error: "This IBM cloud service does not support the Cloud Foundry service keys API and cannot be added to your Cluster"

This error message is likely occurring because the service instance has not fully instantiated. Please wait a few minutes and then try binding the service instance again.

# Links

* [Watson Node.js SDK](https://github.com/watson-developer-cloud/node-sdk): Visit the Node.js library to access IBM Watson services.
* [Create Kubernetes cluster](https://cloud.ibm.com/docs/containers/cs_tutorials.html#objectives): Tutorial- Creating Kubernetes Cluster and adding Watson service to cluster.
* [Sample Node.js application for Language Translator](https://github.com/watson-developer-cloud/language-translator-nodejs): Sample Node.JS application for Watson Language Translator service

# Learn more

* **Artificial Intelligence Code Patterns**: Enjoyed this Code Pattern? Check out our other [AI Code Patterns](https://developer.ibm.com/code/technologies/artificial-intelligence/).
* **AI and Data Code Pattern Playlist**: Bookmark our [playlist](https://www.youtube.com/playlist?list=PLzUbsvIyrNfknNewObx5N7uGZ5FKH0Fde) with all of our Code Pattern videos
* **With Watson**: Want to take your Watson app to the next level? Looking to utilize Watson Brand assets? [Join the With Watson program](https://www.ibm.com/watson/with-watson/) to leverage exclusive brand, marketing, and tech resources to amplify and accelerate your Watson embedded commercial solution.

# License
[Apache 2.0](LICENSE)
