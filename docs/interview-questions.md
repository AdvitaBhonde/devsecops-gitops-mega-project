# DevSecOps & GitOps Project Interview Guide (60 Detailed Questions & Answers)

This document contains 60 interview-ready technical questions and answers specifically tailored to this project architecture.

---

## Category 1: Architecture & General DevSecOps

### Q1: Can you walk me through the high-level architecture of your DevSecOps Mega Project?
**Answer**: Our architecture is an automated DevSecOps and GitOps platform. Developers push code to GitHub, triggering a Jenkins CI pipeline. Jenkins runs OWASP Dependency-Check for libraries, SonarQube for static analysis, and Trivy for filesystem and container image vulnerability scanning. Built images are pushed to Docker Hub. Jenkins CD updates the image tag in the Kubernetes manifests in GitHub. Argo CD automatically detects the Git repository update and reconciles the desired state into AWS EKS. Observability is handled by Prometheus and Grafana, with Alertmanager sending email alerts.

### Q2: What is the core difference between DevOps and DevSecOps in this project?
**Answer**: In traditional DevOps, security testing is often conducted after deployment or right before release. In our DevSecOps project, security is "shifted left"—vulnerabilities are automatically caught directly inside the CI pipeline through automated OWASP dependency scanning, SonarQube quality gates, and Trivy image scanning before code ever reaches production.

### Q3: Why did you choose React.js, Express.js, and MongoDB for the sample application?
**Answer**: It represents a real-world, full-stack 3-tier architecture. React provides a single-page frontend SPA, Express provides a lightweight RESTful API with health check endpoints, and MongoDB provides document storage. This mimics production microservice dependencies.

### Q4: How are environment variables handled across environments without hardcoding secrets?
**Answer**: We use `.env.example` templates for local execution, Docker environment overrides in `docker-compose.yml`, and Kubernetes `ConfigMap` and `Secret` objects in production EKS. In Jenkins, secrets are retrieved via Jenkins Credentials Manager.

### Q5: What is the benefit of multi-stage Docker builds used in this project?
**Answer**: Multi-stage builds separate the build-time environment (which includes compilers, devDependencies, and SDKs) from the final production runtime image. For example, our React app builds in a Node container but runs in a minimal Nginx Alpine image, reducing image size from 1GB+ to under 25MB and minimizing the attack surface.

---

## Category 2: Linux & Shell Automation

### Q6: How does the `install-tools.sh` script ensure safe binary installation?
**Answer**: It uses `set -e` so the script immediately exits upon any error, verifies platform architecture (`uname -s`), downloads official binaries over HTTPS, and uses system package managers (`apt-get`) with signed GPG keyrings.

### Q7: Why do we add the `jenkins` user to the `docker` group?
**Answer**: By default, communicating with the Docker daemon via `/var/run/docker.sock` requires root permissions. Adding the `jenkins` user to the `docker` group grants Jenkins permission to run `docker build` and `docker push` commands without using `sudo`.

### Q8: What does `usermod -aG docker ubuntu` do?
**Answer**: The `-aG` flags append the user `ubuntu` to the `docker` supplementary group without removing existing group memberships.

### Q9: How do you inspect running processes and system load on the Jenkins EC2 instance?
**Answer**: Use tools like `htop`, `top`, `free -h` for memory, `df -h` for disk usage, and `journalctl -u jenkins -f` to tail Jenkins system logs.

### Q10: How do you verify port availability on Linux?
**Answer**: Using `netstat -tulnp` or `ss -tulnp` to list all listening TCP/UDP ports and associated process IDs.

---

## Category 3: Git & Version Control

### Q11: What is the GitOps repository strategy used in this project?
**Answer**: We utilize a unified mono-repository structure containing folders for `application`, `terraform`, `jenkins`, `kubernetes`, `argocd`, `security`, and `monitoring`. This simplifies version alignment between application code and deployment manifests.

### Q12: How does Jenkins CD commit changes back to GitHub without human interaction?
**Answer**: Jenkins uses stored `github-credentials` (PAT/SSH key) and executes standard Git commands (`git config`, `git commit`, `git push`) over HTTPS with embedded credentials.

### Q13: What files should NEVER be committed to Git?
**Answer**: AWS credentials, private keys (`.pem`), `terraform.tfstate`, `.env` files with actual secrets, kubeconfig files, and `node_modules/`.

### Q14: What is `.gitignore` and how is it validated in CI/CD?
**Answer**: `.gitignore` specifies untracked files that Git should ignore. In CI, we check `git status` to ensure transient build artifacts do not pollute the repository.

### Q15: How do you handle merge conflicts in GitOps manifest repositories?
**Answer**: By ensuring that manifest modifications in GitOps are automated by CI/CD jobs using fast-forward merges or dedicated release branches.

---

## Category 4: Docker & Containerization

### Q16: Explain non-root user implementation in your backend Dockerfile.
**Answer**: We specify `USER node` in the final runtime stage of our backend `Dockerfile`. Running as a non-root user prevents container breakout attacks from gaining root access on the host node.

### Q17: What is the purpose of `healthcheck` in `docker-compose.yml`?
**Answer**: It periodically monitors container status (e.g. pinging MongoDB or calling `/health`). Other services wait for `condition: service_healthy` before launching.

### Q18: What is the difference between Docker `ENTRYPOINT` and `CMD`?
**Answer**: `ENTRYPOINT` sets the default binary executable that will always run when the container starts, whereas `CMD` provides default arguments that can be easily overridden at runtime.

### Q19: Why use Nginx as a reverse proxy for the React frontend container?
**Answer**: Nginx serves static HTML/JS files with low resource utilization and handles URL routing (`try_files $uri /index.html`) while reverse-proxying API calls to backend services.

### Q20: How do Docker layer caches improve build speeds?
**Answer**: Docker caches each layer instruction (`COPY package.json`, `RUN npm install`). If `package.json` hasn't changed, Docker reuses the cached layer, skipping package downloads.

### Q21: What is the purpose of `.dockerignore`?
**Answer**: It prevents unnecessary files like `node_modules`, `.git`, and `.env` from being sent to the Docker daemon during build context evaluation.

### Q22: How do you tag images for traceability in production?
**Answer**: We tag images with both the unique Jenkins `${BUILD_NUMBER}` + `${GIT_COMMIT}` hash and `:latest`.

---

## Category 5: Jenkins & CI/CD Pipelines

### Q23: What is the difference between Declarative and Scripted Jenkins Pipelines?
**Answer**: Declarative pipelines use a strict, structured syntax (`pipeline { stage { steps } }`) with built-in error checking, whereas Scripted pipelines use Groovy code blocks (`node { }`) allowing arbitrary code execution.

### Q24: How does Jenkins authenticate with Docker Hub and GitHub securely?
**Answer**: Using `withCredentials([usernamePassword(...)])` and `withCredentials([string(...)])` wrappers. Credentials are encrypted in Jenkins and masked in log outputs (`****`).

### Q25: What happens if the SonarQube Quality Gate fails during CI?
**Answer**: The `waitForQualityGate abortPipeline: true` step halts the pipeline execution immediately, preventing unverified or insecure code from being built into Docker images.

### Q26: Why are build parameters like `IMAGE_TAG` used in Jenkins CD?
**Answer**: Parameterization allows triggering CD pipelines either automatically from CI or manually with specific image versions for rollback testing.

### Q27: How are email notifications configured in Jenkins?
**Answer**: Using the `emailext` plugin in pipeline `post { success {} failure {} }` blocks, connected to an SMTP server.

### Q28: How do you clean workspace files after a pipeline completes?
**Answer**: By invoking `cleanWs()` in the `post { always {} }` section of the Jenkinsfile.

### Q29: What is the role of Jenkins Master vs Jenkins Agents?
**Answer**: Jenkins Master manages job schedules, web UI, and credentials, while build tasks and workload execution can be delegated to worker agent nodes.

### Q30: How do you inspect Jenkins pipeline failures?
**Answer**: By navigating to the specific build step console output, inspecting stage execution logs, and checking artifact scan reports.

---

## Category 6: Security (SonarQube, OWASP, Trivy)

### Q31: What does OWASP Dependency-Check do?
**Answer**: It analyzes application dependency manifests (like `package.json`) against the National Vulnerability Database (NVD) to identify known CVEs.

### Q32: What parameters are passed to SonarQube scanner?
**Answer**: `sonar.host.url`, `sonar.login`, `sonar.projectKey`, `sonar.projectName`, and `sonar.sources`.

### Q33: How does Trivy perform vulnerability scanning?
**Answer**: Trivy scans OS package databases (apt, apk, yum) and application dependency locks for vulnerabilities, outputting results filtered by severity (`HIGH,CRITICAL`).

### Q34: What is the difference between Trivy FS scan and Trivy Image scan?
**Answer**: Trivy FS scans the raw code repository files before building, while Trivy Image scans the final compiled Docker image layers for vulnerabilities added during build time.

### Q35: How do you handle false positives in OWASP Dependency-Check?
**Answer**: By defining suppression rules in `security/dependency-check/suppressions.xml`.

### Q36: What is a Quality Gate in SonarQube?
**Answer**: A set of metric thresholds (e.g. 0 bugs, < 5% code coverage drop, 0 critical security hotspots) that code must pass before deployment.

---

## Category 7: Terraform & AWS Infrastructure

### Q37: What AWS resources are created by Terraform in this project?
**Answer**: VPC, Public & Private Subnets, Internet Gateway, NAT Gateway, Route Tables, Security Groups, IAM Roles/Policies, EC2 Jenkins Master instance, AWS EKS Cluster, and EKS Managed Node Groups.

### Q38: Why do we use private subnets for EKS worker nodes?
**Answer**: To restrict worker nodes from having public IP addresses, protecting them from direct internet exposure while allowing outbound internet access via NAT Gateway.

### Q39: What is the purpose of `terraform.tfvars.example`?
**Answer**: It acts as a template for user configuration values without exposing sensitive infrastructure configurations or account numbers.

### Q40: What is the purpose of `terraform validate` and `terraform fmt`?
**Answer**: `terraform fmt` formats HCL code according to standard conventions, while `terraform validate` checks code syntax and internal consistency.

### Q41: Why is `terraform.tfstate` stored securely and excluded from Git?
**Answer**: State files contain mapping of Terraform resources to real AWS IDs and may contain plaintext sensitive variables.

### Q42: What IAM roles are required for AWS EKS?
**Answer**: EKS Cluster Control Plane Role (`AmazonEKSClusterPolicy`) and EKS Worker Node Group Role (`AmazonEKSWorkerNodePolicy`, `AmazonEKS_CNI_Policy`, `AmazonEC2ContainerRegistryReadOnly`).

### Q43: What is the safety rule regarding `terraform apply`?
**Answer**: `terraform apply` should never be run automated without inspecting `terraform plan` output and getting explicit operator confirmation.

---

## Category 8: Kubernetes & AWS EKS

### Q44: What securityContext settings are applied to Kubernetes pods in this project?
**Answer**: `runAsNonRoot: true`, `allowPrivilegeEscalation: false`, `capabilities: drop: ["ALL"]`, and CPU/Memory resource requests and limits.

### Q45: Explain the difference between `livenessProbe` and `readinessProbe`.
**Answer**: `livenessProbe` determines if a container needs restarting, while `readinessProbe` determines if a container is ready to accept incoming service network traffic.

### Q46: Why is `RollingUpdate` used as the deployment strategy?
**Answer**: It updates pods incrementally (`maxSurge: 1`, `maxUnavailable: 0`), guaranteeing zero-downtime deployments.

### Q47: What is the function of `Kustomization` (`kustomization.yaml`)?
**Answer**: Kustomize allows declarative configuration management without template engines, grouping manifests and applying common labels/namespaces.

### Q48: How is persistent storage handled for MongoDB in Kubernetes?
**Answer**: Using `volumeMounts` connected to storage volumes (`PersistentVolumeClaim` or `emptyDir` for testing).

### Q49: Why should production MongoDB use Amazon DocumentDB or MongoDB Atlas instead of a Kubernetes Pod?
**Answer**: Managed databases handle automatic failover, multi-AZ replication, backups, storage scaling, and security patches without manual Kubernetes pod management overhead.

### Q50: How do you view pod logs in Kubernetes?
**Answer**: `kubectl logs -n devsecops -l app=backend --tail=100 -f`.

---

## Category 9: Argo CD & GitOps

### Q51: What is GitOps and how is it implemented with Argo CD?
**Answer**: GitOps uses Git as the single source of truth for infrastructure and deployment state. Argo CD monitors the Git repo and synchronizes cluster resources automatically.

### Q52: What is the role of `prune: true` in Argo CD syncPolicy?
**Answer**: `prune: true` automatically deletes resources from the EKS cluster if their corresponding YAML manifests are removed from the Git repository.

### Q53: What is `selfHeal: true` in Argo CD?
**Answer**: If someone manually alters a Kubernetes resource using `kubectl edit`, Argo CD detects the drift and automatically overwrites manual changes back to match Git.

### Q54: What is the advantage of pull-based CD (Argo CD) over push-based CD (Jenkins `kubectl apply`)?
**Answer**: Pull-based CD does not require exposing cluster API keys to external CI tools, prevents manual drift, and continuously guarantees declarative state synchronization.

### Q55: How do you check Argo CD synchronization status via CLI?
**Answer**: `argocd app get devsecops-gitops-app` or using `kubectl get application -n argocd`.

---

## Category 10: Monitoring & Observability

### Q56: What tools are included in `kube-prometheus-stack`?
**Answer**: Prometheus (metrics scraper & time-series DB), Alertmanager (alert routing/notifications), Grafana (visualization dashboards), and node-exporter (host metrics).

### Q57: How do you port-forward Grafana to view dashboards locally?
**Answer**: `kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80`.

### Q58: What metrics are monitored for Kubernetes Pods?
**Answer**: CPU usage (`container_cpu_usage_seconds_total`), Memory usage (`container_memory_working_set_bytes`), and Pod Restarts (`kube_pod_container_status_restarts_total`).

### Q59: How does Alertmanager route notifications?
**Answer**: Alertmanager evaluates alert rules from Prometheus and routes notifications over SMTP email or Webhooks based on severity filters.

### Q60: Why should Grafana not be exposed publicly to `0.0.0.0/0`?
**Answer**: Exposing dashboards without authentication risks leaking cluster topology, node IPs, and operational metrics to unauthenticated attackers.
