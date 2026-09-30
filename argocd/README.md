# Argo CD GitOps Setup & Setup Guide

Argo CD manages state synchronization between the `kubernetes/` folder in GitHub and the live AWS EKS cluster.

## Architecture & Workflow

1. Developer pushes code to GitHub.
2. Jenkins CI builds Docker images & pushes to Docker Hub.
3. Jenkins CD updates container image tag in `kubernetes/backend-deployment.yaml` & `kubernetes/frontend-deployment.yaml` and commits back to GitHub.
4. Argo CD detects repository commit and automatically synchronizes (pull-based) new image versions to AWS EKS.

## Installation on AWS EKS

```bash
# Create argocd namespace
kubectl create namespace argocd

# Apply official ArgoCD installation manifests
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Apply project & application custom resources
kubectl apply -f argocd/project.yaml
kubectl apply -f argocd/application.yaml

# Fetch initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

## Security Best Practices
- `prune: true` deletes orphaned resources from Kubernetes when removed from Git.
- `selfHeal: true` overrides manual `kubectl` edits in cluster, keeping Git as the single source of truth.
