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

# Namespace for cert-manager
resource "kubernetes_namespace" "cert_manager_ns" {
  metadata {
    name = "cert-manager"
  }
}

# 1. Install Cert-Manager using Helm with CRDs
resource "helm_release" "cert_manager" {
  name       = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"
  namespace  = kubernetes_namespace.cert_manager_ns.metadata[0].name

  set {
    name  = "installCRDs"
    value = "true"
  }

  # Wait until cert-manager is deployed successfully
  timeout = 600
}

# 2. Add a null resource to wait for CRDs to be available
resource "null_resource" "wait_for_crds" {
  depends_on = [helm_release.cert_manager]

  provisioner "local-exec" {
    command = <<EOT
      kubectl wait --for=condition=established --timeout=60s crd/clusterissuers.cert-manager.io
    EOT
  }
}

# 3. Create Let's Encrypt ClusterIssuer
resource "kubernetes_manifest" "letsencrypt_prod" {
  depends_on = [null_resource.wait_for_crds]

  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "ClusterIssuer"
    metadata = {
      name = "letsencrypt-prod"
    }
    spec = {
      acme = {
        server                  = "https://acme-v02.api.letsencrypt.org/directory"
        email                   = "nickbdt86@gmail.com"
        privateKeySecretRef = {
          name = "letsencrypt-prod"
        }
        solvers = [{
          http01 = {
            ingress = {
              class = "nginx"
            }
          }
        }]
      }
    }
  }
}

# 4. Create the Certificate using Cert-Manager for the domain cloud.talecompendium.com
resource "kubernetes_manifest" "tls_certificate" {
  depends_on = [kubernetes_manifest.letsencrypt_prod]

  manifest = {
    apiVersion = "cert-manager.io/v1"
    kind       = "Certificate"
    metadata = {
      name      = "webapp-tls"
      namespace = "default"
    }
    spec = {
      secretName = "webapp-tls-secret"  # Cert-Manager will create this secret
      issuerRef = {
        name = "letsencrypt-prod"
        kind = "ClusterIssuer"
      }
      commonName = "cloud.talecompendium.com"
      dnsNames   = ["cloud.talecompendium.com"]
    }
  }
}

# 5. Create the Ingress Resource
resource "kubernetes_ingress" "webapp_ingress" {
  depends_on = [kubernetes_manifest.tls_certificate]

  metadata {
    name = "webapp-ingress"
    annotations = {
      "cert-manager.io/cluster-issuer" = "letsencrypt-prod"
      "kubernetes.io/ingress.class"    = "nginx"
    }
  }

  spec {
    tls {
      hosts       = ["cloud.talecompendium.com"]
      secret_name = "webapp-tls-secret"  # Reference the generated TLS secret
    }

    rule {
      host = "cloud.talecompendium.com"
      http {
        path {
          backend {
            service_name = "webapp-service"
            service_port = 80
          }
        }
      }
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
            value = "https://cloud.talecompendium.com/api"
          }
          env {
            name  = "NEXT_PUBLIC_WEBAPP_URL"
            value = "https://cloud.talecompendium.com"
          }
          env {
            name  = "NEXT_PUBLIC_CLERK_SIGN_IN_URL"
            value = var.clerk_sign_in_url
          }
          env {
            name  = "NEXT_PUBLIC_CLERK_SIGN_UP_URL"
            value = var.clerk_sign_up_url
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
          env {
            name  = "STRIPE_SECRET_KEY"
            value = var.stripe_secret_key
          }
          env {
            name  = "CLERK_WEBHOOK_SECRET"
            value = var.clerk_webhook_secret
          }
          env {
            name  = "NEXT_PUBLIC_API_URL"
            value = "https://cloud.talecompendium.com/api"
          }
          env {
            name  = "NEXT_PUBLIC_WEBAPP_URL"
            value = "https://cloud.talecompendium.com"
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
      port        = 80
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
