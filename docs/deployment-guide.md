# Step-by-Step Deployment Guide

## Prerequisites

1. AWS Account with IAM administrator permissions.
2. AWS CLI configured (`aws configure`).
3. Git CLI (`git`).
4. Terraform `>= 1.5.0`.
5. Docker Desktop / Docker Engine.
6. kubectl and Helm CLI.

---

## Phase 1: Local Application Verification

```bash
# Clone the repository
git clone https://github.com/AdvitaBhonde/devsecops-gitops-mega-project.git
cd devsecops-gitops-mega-project

# Start local Docker Compose environment
cd docker
docker compose up -d

# Verify services
curl http://localhost:5000/health
# Access frontend at http://localhost
```

---

## Phase 2: Terraform AWS Infrastructure Provisioning

```bash
cd ../terraform
terraform init
terraform validate
terraform plan

# Deploy infrastructure (Requires user confirmation)
terraform apply
```

---

## Phase 3: EKS Cluster & Argo CD Deployment

```bash
# Connect to EKS Cluster
aws eks update-kubeconfig --name devsecops-eks-cluster --region ap-south-1

# Deploy Argo CD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Apply GitOps Application
kubectl apply -f argocd/project.yaml
kubectl apply -f argocd/application.yaml
```

---

## Phase 4: Observability Setup

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
kubectl create namespace monitoring

helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --values monitoring/prometheus/values.yaml
```
