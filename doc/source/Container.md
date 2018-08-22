# Run Server application in a container on IBM Cloud with Kubernetes

Steps below will help you to deploy the `snap-and-translate/server` application into a container running on IBM Cloud, using Kubernetes.

Install the [pre-requisites](https://github.com/IBM/container-service-getting-started-wt/tree/master/Lab%200) before you begin with the steps.

# Steps

* Follow the instructions to [Create a Kubernetes Cluster,Setup CLI, Setup Private registry and to set up your cluster environment](https://console.bluemix.net/docs/containers/cs_tutorials.html#cs_cluster_tutorial).

* Set the Kubernetes environment to work with your cluster:

```
$ bx cs cluster-config <replace_with_your_cluster_name>
```

The output of this command will contain a KUBECONFIG environment variable that must be exported in order to set the context. Copy and paste the output in the terminal window. An example is:

```
$ export KUBECONFIG=/Users/riyaroy/.bluemix/plugins/container-service/clusters/<cluster_name>/kube-config-hou02-<cluster_name>.yml
```

* Add Language Translator service to your cluster

Add the Language Translator service to your IBM Cloud account by replacing with a name for your service instance.

```
$ bx service create create language_translator lite <service_name>
```

* Bind the Language Translator instance to the default Kubernetes namespace for the cluster. Later, you can create your own namespaces to manage user access to Kubernetes resources, but for now, use the default namespace. Kubernetes namespaces are different from the registry namespace you created earlier. Replace cluster name and service instance name.

```
$ bx cs cluster-service-bind --cluster <cluster_name> --namespace default --service <service_name>
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

* Update the `image` in `watson-lang-trans.yml` with your image name


* Run the configuration script.

```
$ kubectl apply -f watson-lang-trans.yml
```

* Get the public IP address by replacing the <cluster_name>. (Take a note of the Public IP address since it is required in the later steps) 

```
$ bx cs workers <cluster_name>
```

Now refer [Mobileapp.md](doc/source/Mobileapp.md) to deloy mobile application