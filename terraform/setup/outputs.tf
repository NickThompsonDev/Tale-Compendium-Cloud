output "cluster_name" {
  description = "The name of the GKE cluster"
  value       = google_container_cluster.primary.name
}

output "cluster_endpoint" {
  description = "The GKE cluster endpoint"
  value       = google_container_cluster.primary.endpoint
}

output "ingress_namespace" {
  description = "The namespace for the ingress controller"
  value       = kubernetes_namespace.ingress.metadata[0].name
}
