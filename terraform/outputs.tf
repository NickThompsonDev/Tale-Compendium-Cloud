output "webapp_service_ip" {
  description = "The external IP of the webapp service"
  value       = kubernetes_service.webapp.status[0].load_balancer[0].ingress[0].ip
}

output "api_service_ip" {
  description = "The IP of the API service"
  value       = kubernetes_service.api.status[0].load_balancer[0].ingress[0].ip
}

output "database_service_ip" {
  description = "The IP of the database service"
  value       = kubernetes_service.database.status[0].load_balancer[0].ingress[0].ip
}
