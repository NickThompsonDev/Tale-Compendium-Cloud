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

# Kubernetes provider configuration
provider "kubernetes" {
  host                   = "https://${data.google_container_cluster.primary.endpoint}"
  token                  = data.google_service_account_access_token.my_kubernetes_sa.access_token
  cluster_ca_certificate = base64decode(data.google_container_cluster.primary.master_auth[0].cluster_ca_certificate)
}

provider "helm" {
  kubernetes {
    host                   = "https://${data.google_container_cluster.primary.endpoint}"
    token                  = data.google_service_account_access_token.my_kubernetes_sa.access_token
    cluster_ca_certificate = base64decode(data.google_container_cluster.primary.master_auth[0].cluster_ca_certificate)
  }
}

# Namespace creation
resource "kubernetes_namespace" "ingress" {
  metadata {
    name = "ingress-nginx"
  }

  lifecycle {
    prevent_destroy = true  # Prevent deletion if it already exists
    ignore_changes  = all
  }
}


# Install NGINX Ingress Controller using Helm
resource "helm_release" "nginx" {
  name       = "nginx-ingress"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = "ingress-nginx"

  values = [
    <<-EOF
      controller:
        service:
          type: LoadBalancer
    EOF
  ]

  # Reuse existing values and resources if they exist
  recreate_pods  = false
  cleanup_on_fail = true

  lifecycle {
    ignore_changes = all
  }
}

