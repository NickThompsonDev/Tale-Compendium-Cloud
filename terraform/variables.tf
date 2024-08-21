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

variable "k8s_cluster_endpoint" {
  description = "The external endpoint of the GKE cluster"
  type        = string
  default     = "34.75.38.234" # Use the external endpoint of your cluster
}

variable "k8s_cluster_ca_certificate" {
  description = "The base64 encoded cluster certificate"
  type        = string
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
}

variable "docker_image_tag" {
  description = "Tag for the Docker image"
  type        = string
  default     = "latest"
}

# Database variables
variable "database_name" {
  description = "The name of the database"
  type        = string
  default     = "mydatabase"
}

variable "database_user" {
  description = "The database username"
  type        = string
  default     = "user"
}

variable "database_password" {
  description = "The database password"
  type        = string
  default     = "password"
}

# API keys and secrets
variable "stripe_publishable_key" {
  description = "Stripe publishable key"
  type        = string
}

variable "stripe_secret_key" {
  description = "Stripe secret key"
  type        = string
}

variable "clerk_publishable_key" {
  description = "Clerk publishable key"
  type        = string
}

variable "clerk_secret_key" {
  description = "Clerk secret key"
  type        = string
}

variable "openai_api_key" {
  description = "OpenAI API key"
  type        = string
}