output "webapp_service_ip" {
  value = kubernetes_service.webapp.status[0].load_balancer[0].ingress[0].ip
}

output "api_service_ip" {
  value = kubernetes_service.api.status[0].load_balancer[0].ingress[0].ip
}
