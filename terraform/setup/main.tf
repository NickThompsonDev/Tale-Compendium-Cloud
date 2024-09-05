provider "google" {
  credentials = var.google_credentials
  project     = var.project_id
  region      = var.region
}

# Use the same service account that is authenticated in the GitHub Actions workflow
data "google_client_config" "provider" {}

# Retrieve an access token for the specified service account
data "google_service_account_access_token" "my_kubernetes_sa" {
  target_service_account = var.service_account_email
  scopes                 = ["userinfo-email", "cloud-platform"]
  lifetime               = "3600s"
}

# Retrieve the GKE cluster details
data "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.region
}

# Kubernetes provider using GKE cluster
provider "kubernetes" {
  host                   = "https://${data.google_container_cluster.primary.endpoint}"
  token                  = data.google_service_account_access_token.my_kubernetes_sa.access_token
  cluster_ca_certificate = base64decode(data.google_container_cluster.primary.master_auth[0].cluster_ca_certificate)
}

# Create a namespace for the ingress controller
resource "kubernetes_namespace" "ingress" {
  metadata {
    name = "ingress-nginx"
  }
}

# Create a service account for the ingress controller
resource "kubernetes_service_account" "nginx" {
  metadata {
    name      = "nginx-ingress-serviceaccount"
    namespace = kubernetes_namespace.ingress.metadata[0].name
  }
}

# Install NGINX Ingress Controller using Helm
resource "helm_release" "nginx" {
  name       = "nginx-ingress"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = kubernetes_namespace.ingress.metadata[0].name

  values = [
    <<-EOF
      controller:
        service:
          type: LoadBalancer
    EOF
  ]
}
