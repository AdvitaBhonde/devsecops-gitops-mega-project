# Jenkins CI Pipeline Guide

## Pipeline Architecture

The Continuous Integration pipeline is declared in `jenkins/Jenkinsfile-ci` and root `Jenkinsfile`.

### Pipeline Stages Explained

1. **Checkout**: Retrieves source code and evaluates git commit hash.
2. **Install Dependencies**: Runs `npm ci` for Node backend and React frontend.
3. **Unit Tests**: Executes test suites.
4. **OWASP Dependency-Check**: Scans application dependencies for known CVEs.
5. **SonarQube Analysis**: Runs static code quality and SAST analysis.
6. **Quality Gate**: Blocks pipeline execution if code quality rules fail.
7. **Trivy FS Scan**: Scans workspace filesystem for HIGH/CRITICAL vulnerabilities.
8. **Docker Build**: Builds production images tagged with build number & git commit.
9. **Trivy Image Scan**: Scans built Docker images before registry upload.
10. **Docker Push**: Authenticates and pushes images to Docker Hub registry.

---

## Required Jenkins Credentials

- `dockerhub-credentials`: Username / Password credential for Docker Hub.
- `github-credentials`: Username / Personal Access Token for GitHub GitOps update.
- `sonarqube-token`: Secret text token generated from SonarQube dashboard.
