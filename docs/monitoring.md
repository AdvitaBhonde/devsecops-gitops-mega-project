# Observability & Monitoring Guide

## Metrics Collected

1. **Cluster Infrastructure**:
   - Node CPU Utilization (`instance:node_cpu:rate5m`)
   - Memory Consumption (`node_memory_MemAvailable_bytes`)
   - Network I/O and Disk Saturation

2. **Kubernetes Workloads**:
   - Pod Restarts (`kube_pod_container_status_restarts_total`)
   - Pod Readiness & Health Probe Failures
   - Deployment Replica Availability

3. **Application Level**:
   - Backend `/health` endpoint response status & MongoDB connection state.

## Grafana Dashboards

Custom dashboard imported from `monitoring/grafana/dashboards/devsecops-dashboard.json`.
Access via:
```bash
kubectl port-forward -n monitoring service/prometheus-grafana 3000:80
```
Credentials: `admin` / `admin-secure-password-change-me`
