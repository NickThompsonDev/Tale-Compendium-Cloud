provider "google" {
  credentials = var.google_credentials
  project     = var.project_id
  region      = var.region
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

# Install NGINX Ingress Controller with Helm
resource "helm_release" "nginx_ingress" {
  name       = "nginx-ingress"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = "ingress-nginx"
  create_namespace = true

  set {
    name  = "controller.service.type"
    value = "LoadBalancer"
  }

  set {
    name  = "controller.service.ports.http"
    value = "80"
  }

  set {
    name  = "controller.service.loadBalancerIP"
    value = "34.73.181.123"
  }

  set {
    name  = "controller.admissionWebhooks.enabled"
    value = "true"
  }

  set {
    name  = "controller.service.externalTrafficPolicy"
    value = "Local"
  }
}

resource "helm_release" "cert_manager" {
  name       = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"
  namespace  = "cert-manager"
  create_namespace = true

  set {
    name  = "installCRDs"
    value = "true"
  }
}

resource "kubernetes_manifest" "letsencrypt_prod" {
  manifest = {
    "apiVersion" = "cert-manager.io/v1"
    "kind"       = "ClusterIssuer"
    "metadata" = {
      "name" = "letsencrypt-prod"
    }
    "spec" = {
      "acme" = {
        "server" = "https://acme-v02.api.letsencrypt.org/directory"
        "email"  = "nickbdt86@gmail.com"
        "privateKeySecretRef" = {
          "name" = "letsencrypt-prod-key"
        }
        "solvers" = [{
          "http01" = {
            "ingress" = {
              "class" = "nginx"
            }
          }
        }]
      }
    }
  }
}


# Create the Ingress Resource Using Manifest
resource "kubernetes_manifest" "webapp_ingress" {
  manifest = {
    "apiVersion" = "networking.k8s.io/v1"
    "kind"       = "Ingress"
    "metadata" = {
      "name"      = "webapp-ingress"
      "namespace" = "default"
      "annotations" = {
        "kubernetes.io/ingress.class" = "nginx"
        "nginx.ingress.kubernetes.io/rewrite-target" = "/"
        "cert-manager.io/cluster-issuer" = "letsencrypt-prod"  # Optional, if using cert-manager
      }
    }
    "spec" = {
      "rules" = [{
        "host" = "talecompendiumcloud.com"
        "http" = {
          "paths" = [
            {
              "path"     = "/api"
              "pathType" = "Prefix"
              "backend"  = {
                "service" = {
                  "name" = "api-service"
                  "port" = {
                    "number" = 5000
                  }
                }
              }
            },
            {
              "path"     = "/"
              "pathType" = "Prefix"
              "backend"  = {
                "service" = {
                  "name" = "webapp-service"
                  "port" = {
                    "number" = 3000
                  }
                }
              }
            }
          ]
        }
      }]
      "tls" = [{
        "hosts"      = ["talecompendiumcloud.com"]
        "secretName" = "tls-secret"  # Secret containing SSL certificates
      }]
    }
  }
}

# Kubernetes deployment for webapp
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
            value = "https://talecompendiumcloud.com/api"
          }
          env {
            name  = "NEXT_PUBLIC_WEBAPP_URL"
            value = "https://talecompendiumcloud.com"
          }
        }
      }
    }
  }
}

# Kubernetes deployment for API
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
            value = var.database_host
          }
          env {
            name  = "DATABASE_PORT"
            value = "5432"
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
        }
      }
    }
  }
}

# Kubernetes deployment for database
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

# Kubernetes service for webapp
resource "kubernetes_service" "webapp" {
  metadata {
    name = "webapp-service"
  }

  spec {
    selector = {
      app = "webapp"
    }

    port {
      port        = 3000
      target_port = 3000
    }

    type = "ClusterIP"
  }
}

# Kubernetes service for API
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

# Kubernetes service for database
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
