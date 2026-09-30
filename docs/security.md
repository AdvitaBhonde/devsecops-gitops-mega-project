# DevSecOps & Security Practices

## Security Controls Implemented

### 1. Shift-Left Vulnerability Management
- **OWASP Dependency-Check**: Scans third-party Node.js libraries for published CVE vulnerabilities.
- **SonarQube Static Application Security Testing (SAST)**: Identifies code smells, security hotspots, and bugs.
- **Trivy Container & FS Security**: Scans container OS packages, application binaries, and filesystem configuration files.

### 2. Kubernetes Pod & Container Hardening
- **Non-Root Execution**: Backend (`runAsUser: 1000`) and Frontend (`runAsUser: 101`) containers enforce non-root privileges.
- **Privilege Escalation Prevention**: `allowPrivilegeEscalation: false`.
- **Capability Drop**: `capabilities: drop: ["ALL"]`.
- **Resource Constraints**: CPU and Memory requests and limits set on every container to prevent Denial of Service (DoS).

### 3. Infrastructure & IAM Security
- **Least Privilege Access**: Dedicated IAM roles for Jenkins Master and EKS Worker Nodes.
- **Network Isolation**: Security groups restrict SSH (22) and Jenkins UI (8080) to admin IP CIDRs.
- **Secrets Management**: No plaintext secrets in Git repository; `secrets.example.yaml` provided for reference.
