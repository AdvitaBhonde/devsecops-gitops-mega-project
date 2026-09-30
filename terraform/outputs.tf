output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "vpc_id" {
  description = "ID of the created VPC"
  value       = aws_vpc.main.id
}

output "jenkins_public_ip" {
  description = "Public IP address of Jenkins Master EC2 instance"
  value       = aws_instance.jenkins_master.public_ip
}

output "jenkins_url" {
  description = "URL for Jenkins Web Interface"
  value       = "http://${aws_instance.jenkins_master.public_ip}:8080"
}

output "sonarqube_url" {
  description = "URL for SonarQube Dashboard"
  value       = "http://${aws_instance.jenkins_master.public_ip}:9000"
}

output "eks_cluster_name" {
  description = "EKS Cluster Name"
  value       = aws_eks_cluster.main.name
}

output "eks_cluster_endpoint" {
  description = "EKS Cluster API Server Endpoint"
  value       = aws_eks_cluster.main.endpoint
}

output "ssh_private_key_pem" {
  description = "PEM encoded private key for SSH access to Jenkins Master"
  value       = tls_private_key.jenkins_key.private_key_pem
  sensitive   = true
}
