variable "aws_region" {
  description = "AWS region for infrastructure deployment"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name prefix for tags and resource names"
  type        = string
  default     = "devsecops-gitops-mega-project"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}

variable "jenkins_instance_type" {
  description = "EC2 instance type for Jenkins Master server"
  type        = string
  default     = "t3.large"
}

variable "jenkins_admin_ip" {
  description = "CIDR block allowed to access Jenkins/SSH (Restricted IP recommended, e.g. 203.0.113.5/32)"
  type        = string
  default     = "0.0.0.0/0"
}

variable "eks_cluster_name" {
  description = "Name of the AWS EKS Cluster"
  type        = string
  default     = "devsecops-eks-cluster"
}

variable "eks_node_instance_types" {
  description = "EC2 instance types for EKS node group"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "eks_desired_capacity" {
  description = "Desired number of worker nodes in EKS cluster"
  type        = number
  default     = 2
}

variable "eks_min_capacity" {
  description = "Minimum number of worker nodes in EKS cluster"
  type        = number
  default     = 1
}

variable "eks_max_capacity" {
  description = "Maximum number of worker nodes in EKS cluster"
  type        = number
  default     = 4
}
