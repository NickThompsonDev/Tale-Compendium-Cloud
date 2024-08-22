provider "google" {
  credentials = var.google_credentials
  project     = var.project_id
  region      = var.region
}

provider "kubernetes" {
  host                   = "https://${var.k8s_cluster_endpoint}"
  token                  = var.k8s_access_token
  cluster_ca_certificate = base64decode(var.k8s_cluster_ca_certificate)
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
          image = "gcr.io/${var.project_id}/api:${var.docker_image_tag}"

          port {
            container_port = 5000
          }

          env {
            name  = "DATABASE_HOST"
            value = "database"
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
            value = var.database_name
          }

          env {
            name  = "POSTGRES_USER"
            value = var.database_user
          }

          env {
            name  = "POSTGRES_PASSWORD"
            value = var.database_password
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
