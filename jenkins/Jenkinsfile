pipeline {
    agent any

    environment {
        GITHUB_USER = 'AdvitaBhonde'
        REPO_NAME = 'devsecops-gitops-mega-project'
        DOCKERHUB_USER = 'advitabhonde'
        BACKEND_IMAGE = "${DOCKERHUB_USER}/devsecops-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/devsecops-frontend"
        SONAR_HOST_URL = 'http://localhost:9000'
        NOTIFICATION_EMAIL = 'devops-alerts@example.com'
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    env.BUILD_HASH = sh(script: 'git rev-parse --short HEAD || echo "local"', returnStdout: true).trim()
                    env.IMAGE_TAG = "${BUILD_NUMBER}-${env.BUILD_HASH}"
                }
                checkout scm
            }
        }

        stage('Install & Test') {
            steps {
                dir('application/backend') { sh 'npm ci || npm install'; sh 'npm test -- --passWithNoTests' }
                dir('application/frontend') { sh 'npm ci || npm install'; sh 'CI=true npm test -- --passWithNoTests' }
            }
        }

        stage('Security Scans (OWASP & SonarQube)') {
            steps {
                sh 'dependency-check --project "DevSecOps" --scan "application/" --out "dependency-check-report" --format "ALL" || true'
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    sh "sonar-scanner -Dsonar.host.url=${SONAR_HOST_URL} -Dsonar.login=${SONAR_TOKEN} -Dsonar.projectKey=devsecops-gitops-mega-project -Dsonar.sources=application/backend/src,application/frontend/src || true"
                }
            }
        }

        stage('Trivy & Docker Build') {
            steps {
                sh 'trivy fs --severity HIGH,CRITICAL --exit-code 0 .'
                dir('application/backend') { sh "docker build -t ${BACKEND_IMAGE}:${env.IMAGE_TAG} -t ${BACKEND_IMAGE}:latest ." }
                dir('application/frontend') { sh "docker build -t ${FRONTEND_IMAGE}:${env.IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest ." }
                sh "trivy image --severity HIGH,CRITICAL --exit-code 0 ${BACKEND_IMAGE}:${env.IMAGE_TAG}"
            }
        }

        stage('Push to Registry & Update GitOps') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DOCKERHUB_PASS', usernameVariable: 'DOCKERHUB_USER')]) {
                    sh 'echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin'
                    sh "docker push ${BACKEND_IMAGE}:${env.IMAGE_TAG}"
                    sh "docker push ${FRONTEND_IMAGE}:${env.IMAGE_TAG}"
                }
                withCredentials([usernamePassword(credentialsId: 'github-credentials', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                    sh """
                        git config user.name "Jenkins Automation"
                        git config user.email "jenkins@devsecops.local"
                        sed -i 's|image: .*devsecops-backend:.*|image: ${BACKEND_IMAGE}:${env.IMAGE_TAG}|g' kubernetes/backend-deployment.yaml
                        sed -i 's|image: .*devsecops-frontend:.*|image: ${FRONTEND_IMAGE}:${env.IMAGE_TAG}|g' kubernetes/frontend-deployment.yaml
                        git add kubernetes/
                        git diff-index --quiet HEAD || git commit -m "[GitOps] Update image tags for build #${BUILD_NUMBER}"
                        git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/${GITHUB_USER}/${REPO_NAME}.git HEAD:main
                    """
                }
            }
        }
    }
}
