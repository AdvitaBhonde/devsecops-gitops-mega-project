# Observability & Monitoring Stack Setup

This directory contains configuration for Prometheus, Grafana, and Alertmanager monitoring on AWS EKS.

## Installation via Helm

```bash
# Add prometheus-community helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Create monitoring namespace
kubectl create namespace monitoring

# Install kube-prometheus-stack chart with custom values
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --values monitoring/prometheus/values.yaml

# Access Grafana Dashboard locally via Port-Forwarding
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
```

## Security Note on Port Exposing
Do not expose Grafana publicly to `0.0.0.0/0` without TLS certificates and strong OAuth/SSO authentication. Use kubectl port-forwarding, AWS VPN, or an Ingress Controller with OAuth proxy.
