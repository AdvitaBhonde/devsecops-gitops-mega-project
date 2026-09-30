#!/bin/bash
set -e

CLUSTER_NAME="devsecops-eks-cluster"
REGION="ap-south-1"

echo "=== Updating Kubeconfig for AWS EKS Cluster: ${CLUSTER_NAME} (${REGION}) ==="
aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${REGION}

echo "Testing Cluster Connectivity..."
kubectl get nodes

echo "Applying Kubernetes Manifests..."
kubectl apply -k kubernetes/

echo "EKS Cluster configuration completed successfully!"
