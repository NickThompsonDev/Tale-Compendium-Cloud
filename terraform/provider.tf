provider "google" {
  credentials = var.google_credentials
  project     = var.project_id
  region      = var.region
}

provider "kubernetes" {
  host                   = google_container_cluster.primary.endpoint
  cluster_ca_certificate = base64decode(google_container_cluster.primary.master_auth.0.cluster_ca_certificate)
  token                  = google_client_config.default.access_token
}
