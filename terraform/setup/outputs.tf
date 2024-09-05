output "cluster_name" {
  description = "The name of the GKE cluster"
  value       = data.google_container_cluster.primary.name
}

output "cluster_endpoint" {
  description = "The endpoint of the GKE cluster"
  value       = data.google_container_cluster.primary.endpoint
}
