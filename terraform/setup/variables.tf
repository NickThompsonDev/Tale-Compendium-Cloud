# Project and region variables
variable "project_id" {
  description = "The project ID to deploy to"
  type        = string
}

variable "region" {
  description = "The region to deploy to"
  type        = string
  default     = "us-east1"
}

variable "cluster_name" {
  description = "The name of the GKE cluster"
  type        = string
  default     = "tale-compendium-cluster"
}

variable "node_count" {
  description = "Number of nodes in the GKE cluster"
  type        = number
  default     = 3
}

variable "node_machine_type" {
  description = "The machine type to use for the GKE cluster"
  type        = string
  default     = "e2-medium"
}

variable "google_credentials" {
  description = "The contents of the GCP service account JSON file"
  type        = string
  sensitive   = true
}

variable "service_account_email" {
  description = "The email of the GCP service account"
  type        = string
  default     = "github-actions-deployer@nodal-clock-433208-b4.iam.gserviceaccount.com"
}
