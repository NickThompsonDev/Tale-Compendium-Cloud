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

resource "google_container_cluster" "primary" {
  name               = var.cluster_name
  location           = var.region
  initial_node_count = var.node_count

  node_config {
    machine_type = var.node_machine_type
  }
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "primary-node-pool"
  location   = var.region
  cluster    = google_container_cluster.primary.name

  node_config {
    preemptible  = false
    machine_type = "e2-medium"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }

  initial_node_count = var.node_count
}

resource "kubernetes_deployment" "webapp" {
  metadata {
    name = "webapp-deployment"
  }

  spec {
    replicas = 3

    selector {
      match_labels = {
        app = "webapp"
      }
    }

    template {
      metadata {
        labels = {
          app = "webapp"
        }
      }

      spec {
        container {
          name  = "webapp"
          image = "gcr.io/${var.project_id}/webapp:latest"

          env {
            name  = "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
            value = var.stripe_publishable_key
          }

          env {
            name  = "STRIPE_SECRET_KEY"
            value = var.stripe_secret_key
          }

          env {
            name  = "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
            value = var.clerk_publishable_key
          }

          env {
            name  = "CLERK_SECRET_KEY"
            value = var.clerk_secret_key
          }

          env {
            name  = "OPENAI_API_KEY"
            value = var.openai_api_key
          }

          env {
            name  = "DATABASE_USER"
            value = var.database_user
          }

          env {
            name  = "DATABASE_PASSWORD"
            value = var.database_password
          }

          env {
            name  = "DATABASE_NAME"
            value = var.database_name
          }

          port {
            container_port = 3000
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "webapp" {
  metadata {
    name = "webapp-service"
  }

  spec {
    selector = {
      app = "webapp"
    }

    port {
      port        = 80
      target_port = 3000
    }

    type = "LoadBalancer"
  }
}

resource "kubernetes_deployment" "api" {
  metadata {
    name = "api-deployment"
  }

  spec {
    replicas = 2

    selector {
      match_labels = {
        app = "api"
      }
    }

    template {
      metadata {
        labels = {
          app = "api"
        }
      }

      spec {
        container {
          name  = "api"
          image = "gcr.io/${var.project_id}/api:latest"

          port {
            container_port = 5000
          }

          env {
            name  = "DATABASE_HOST"
            value = "database"
          }

          env {
            name  = "DATABASE_USER"
            value = var.db_username
          }

          env {
            name  = "DATABASE_PASSWORD"
            value = var.db_password
          }

          env {
            name  = "DATABASE_NAME"
            value = var.db_instance_name
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "api" {
  metadata {
    name = "api-service"
  }

  spec {
    selector = {
      app = "api"
    }

    port {
      port        = 5000
      target_port = 5000
    }

    type = "ClusterIP"
  }
}

resource "kubernetes_deployment" "database" {
  metadata {
    name = "database-deployment"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "database"
      }
    }

    template {
      metadata {
        labels = {
          app = "database"
        }
      }

      spec {
        container {
          name  = "database"
          image = "postgres:14"

          env {
            name  = "POSTGRES_DB"
            value = var.db_instance_name
          }

          env {
            name  = "POSTGRES_USER"
            value = var.db_username
          }

          env {
            name  = "POSTGRES_PASSWORD"
            value = var.db_password
          }

          port {
            container_port = 5432
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "database" {
  metadata {
    name = "database-service"
  }

  spec {
    selector = {
      app = "database"
    }

    port {
      port        = 5432
      target_port = 5432
    }

    type = "ClusterIP"
  }
}

output "webapp_service_ip" {
  value = kubernetes_service.webapp.status[0].load_balancer[0].ingress[0].ip
}

output "api_service_ip" {
  value = kubernetes_service.api.status[0].load_balancer[0].ingress[0].ip
}
