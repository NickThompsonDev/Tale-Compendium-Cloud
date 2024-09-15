# outputs.tf

# output "webapp_service_ip" {
#   description = "The external IP of the webapp service"
#   value       = try(kubernetes_service.webapp.status[0].load_balancer[0].ingress[0].ip, "Pending IP allocation")
# }

# output "api_service_ip" {
#   description = "The IP of the API service"
#   value       = try(kubernetes_service.api.status[0].load_balancer[0].ingress[0].ip, "Pending IP allocation")
# }

output "database_service_ip" {
  description = "The IP of the database service"
  value       = try(kubernetes_service.database.status[0].load_balancer[0].ingress[0].ip, "Pending IP allocation")
}

output "google_service_account_key_private_key" {
  value = google_service_account_key.api_sa_key.private_key
  sensitive = true
}
