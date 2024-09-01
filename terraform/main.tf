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
data "google_container_cluster" "my_cluster" {
  name     = var.cluster_name
  location = var.region
}

# Configure the Kubernetes provider with the service account token
provider "kubernetes" {
  host  = "https://${data.google_container_cluster.my_cluster.endpoint}"
  token = data.google_service_account_access_token.my_kubernetes_sa.access_token
  cluster_ca_certificate = base64decode(
    data.google_container_cluster.my_cluster.master_auth[0].cluster_ca_certificate,
  )
}

# Example Kubernetes deployment for webapp
resource "kubernetes_deployment" "webapp" {
  metadata {
    name = "webapp-deployment"
    labels = {
      app = "webapp"
    }
  }

  spec {
    replicas = 1

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
          image = "gcr.io/${var.project_id}/webapp:${var.docker_image_tag}"
          port {
            container_port = 3000
          }
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
            name  = "NEXT_PUBLIC_API_URL"
            value = var.next_public_api_url
          }
          env {
            name  = "NEXT_PUBLIC_CLERK_SIGN_IN_URL"
            value = var.clerk_sign_in_url  # Adding NEXT_PUBLIC_CLERK_SIGN_IN_URL
          }
          env {
            name  = "NEXT_PUBLIC_CLERK_SIGN_UP_URL"
            value = var.clerk_sign_up_url  # Adding NEXT_PUBLIC_CLERK_SIGN_UP_URL
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
    replicas = 1

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
            name  = "DATABASE_PORT"
            value = "5432"  # Adding DATABASE_PORT
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
          env {
            name  = "OPENAI_API_KEY"
            value = var.openai_api_key
          }
          env {
            name  = "STRIPE_SECRET_KEY"
            value = var.stripe_secret_key  # Adding STRIPE_SECRET_KEY
          }
          env {
            name  = "CLERK_WEBHOOK_SECRET"
            value = var.clerk_webhook_secret  # Adding CLERK_WEBHOOK_SECRET
          }
          env {
            name  = "NEXT_PUBLIC_API_URL"
            value = var.next_public_api_url  # Adding NEXT_PUBLIC_API_URL
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
