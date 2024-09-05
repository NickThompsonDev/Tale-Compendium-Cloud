output "cluster_name" {
  description = "The name of the GKE cluster"
  value       = data.google_container_cluster.primary.name
}

output "cluster_endpoint" {
  description = "The endpoint of the GKE cluster"
  value       = data.google_container_cluster.primary.endpoint
}

output "ingress_namespace" {
  description = "The namespace for the ingress controller"
  value       = kubernetes_namespace.ingress.metadata[0].name
}
