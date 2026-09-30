# Troubleshooting & Common Issues Guide

## Common Errors and Solutions

### 1. MongoDB Connection Timeout in Backend
**Symptom**: `[MongoDB] Connection error: connect ECONNREFUSED`
**Cause**: MongoDB container or service is not running or DNS resolution failed.
**Fix**: Ensure `mongodb-service` is reachable. Run `kubectl get pods -n devsecops` and inspect logs via `kubectl logs -n devsecops -l app=mongodb`.

### 2. Argo CD OutOfSync State
**Symptom**: Argo CD application status shows `OutOfSync` or `Degraded`.
**Cause**: Git repository contains invalid syntax or image pull fails in EKS.
**Fix**: Verify manifest syntax with `kubectl kustomize kubernetes/`. Check image status on Docker Hub.

### 3. Terraform AWS Authentication Error
**Symptom**: `No valid credential sources found`
**Cause**: AWS credentials are not set in environment or `~/.aws/credentials`.
**Fix**: Run `aws configure` or export `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

### 4. SonarQube Quality Gate Timeout
**Symptom**: `waitForQualityGate` step times out in Jenkins.
**Cause**: SonarQube webhook is not configured or SonarQube container is restarting.
**Fix**: Check SonarQube logs on Jenkins EC2 (`docker logs sonarqube`) and configure Webhook URL `http://<JENKINS-IP>:8080/sonarqube-webhook/`.
