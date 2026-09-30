# Jenkins CD & Argo CD GitOps Guide

## Declarative GitOps Workflow

Unlike traditional CD pipelines that execute direct `kubectl apply` commands from CI servers, this project implements strict **GitOps principles**:

1. **Source of Truth**: The Git repository (`kubernetes/` folder) defines the desired state of the cluster.
2. **Pull-Based Synchronization**: Argo CD runs inside the EKS cluster and continuously reconciles the cluster state to match Git.
3. **Automated Manifest Update**: Jenkins CD updates container image tags inside `backend-deployment.yaml` and `frontend-deployment.yaml` and commits back to GitHub.

---

## Argo CD Application Configuration

- **Repo URL**: `https://github.com/AdvitaBhonde/devsecops-gitops-mega-project.git`
- **Path**: `kubernetes`
- **Destination Namespace**: `devsecops`
- **Automated Prune**: `true` (removes deleted objects)
- **Self-Healing**: `true` (reverts manual cluster mutations)
