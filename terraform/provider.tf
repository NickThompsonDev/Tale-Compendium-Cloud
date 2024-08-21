provider "google" {
  credentials = file("<path_to_your_service_account_json>")
  project     = "<your_project_id>"
  region      = "<your_region>"
  zone        = "<your_zone>"
}

provider "kubernetes" {
  config_path    = "~/.kube/config"
  config_context = "gke_<your_project_id>_<your_region>_<your_cluster_name>"
}
