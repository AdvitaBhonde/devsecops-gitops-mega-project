# Architecture Documentation

## Overview

The **DevSecOps & GitOps Mega Project** is a production-style, end-to-end automated platform featuring:
- A full-stack application (**DevOps Task Manager**) with React frontend, Node.js/Express backend, and MongoDB database.
- Infrastructure as Code (IaC) powered by **Terraform** on AWS (VPC, Subnets, NAT Gateways, Security Groups, IAM Roles, EC2 Jenkins Master, and AWS EKS Managed Kubernetes Cluster).
- Continuous Integration & Security (CI/DevSecOps) via **Jenkins**, integrating **OWASP Dependency-Check**, **SonarQube**, and **Trivy** for shift-left vulnerability management.
- Continuous Deployment (CD/GitOps) via **Argo CD**, ensuring pull-based declarative synchronization between GitHub manifests and AWS EKS.
- Full-stack Observability using **Prometheus**, **Grafana**, and Alerting via email.

---

## High-Level Workflow Diagram (Mermaid)

```mermaid
flowchart LR
    subgraph Developer_Workspace
        Dev["👨‍💻 Developer"] -->|git push| GH["🐙 GitHub Repository"]
    end

    subgraph CI_Pipeline ["Jenkins CI (EC2 Master)"]
        GH -->|Webhook trigger| JNK["⚙️ Jenkins CI"]
        JNK --> OWASP["🛡️ OWASP Dep-Check"]
        JNK --> SONAR["🔍 SonarQube Analysis"]
        JNK --> TRIVY_FS["🔒 Trivy FS Scan"]
        JNK --> DOCKER_BUILD["🐳 Docker Build"]
        JNK --> TRIVY_IMG["🛡️ Trivy Image Scan"]
        JNK --> DOCKER_PUSH["⬆️ Push Images"]
    end

    subgraph Container_Registry ["Docker Hub"]
        DOCKER_PUSH --> DH["📦 Docker Hub"]
    end

    subgraph CD_GitOps ["Jenkins CD & Argo CD"]
        JNK -->|Update Tag| MANIFESTS["📄 k8s Manifests (Git)"]
        MANIFESTS -->|Poll & Sync| ARGO["🐙 Argo CD"]
    end

    subgraph Kubernetes_Cluster ["AWS EKS Cluster"]
        ARGO -->|Deploy| EKS["☸️ AWS EKS"]
        EKS --> NODE1["🖥️ Worker Node 1"]
        EKS --> NODE2["🖥️ Worker Node 2"]
    end

    subgraph Observability ["Monitoring & Alerting"]
        EKS --> PROM["🔥 Prometheus"]
        PROM --> GRAF["📊 Grafana"]
        PROM --> EMAIL["📧 Email Notification"]
    end
```

---

## ASCII Architecture Overview

```
+------------------+         +------------------+         +-------------------------+
|    Developer     | --push->|      GitHub      | ------->|   Jenkins CI (EC2)      |
+------------------+         +------------------+         +-------------------------+
                                                                       |
       +---------------------------------------------------------------+
       |             |                    |                  |                  |
       v             v                    v                  v                  v
  +---------+   +----------+       +--------------+  +---------------+   +--------------+
  |  OWASP  |   |SonarQube |       | Trivy FS/Img |  | Docker Build  |   | Push Images  |
  +---------+   +----------+       +--------------+  +---------------+   +--------------+
                                                                                |
                                                                                v
                                                                        +---------------+
                                                                        |  Docker Hub   |
                                                                        +---------------+
                                                                                |
  +-------------------+        +-------------------+                            |
  |  AWS EKS Cluster  |<-------|      Argo CD      |<--- updates tag -----------+
  +-------------------+        +-------------------+
            |
            v
  +-------------------+        +-------------------+
  | Prometheus/Grafana| ------>| Email Notification|
  +-------------------+        +-------------------+
```
