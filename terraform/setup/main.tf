provider "google" {
  credentials = var.google_credentials
  project     = var.project_id
  region      = var.region
}

data "google_client_config" "provider" {}

data "google_service_account_access_token" "my_kubernetes_sa" {
  target_service_account = var.service_account_email
  scopes                 = ["userinfo-email", "cloud-platform"]
  lifetime               = "3600s"
}

data "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.region
}

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

# Helm Release for Ingress Controller
resource "helm_release" "nginx" {
  name             = "nginx-ingress"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  namespace        = "ingress-nginx"

  values = [
    <<-EOF
      controller:
        service:
          type: LoadBalancer
    EOF
  ]

  create_namespace = true
  reuse_values     = true  # Reuse existing values if the release already exists
  cleanup_on_fail  = true  # Ensure cleanup on failure to avoid stuck states

  # Force an upgrade if the resource already exists
  force_update = true
}
