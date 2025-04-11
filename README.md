# Project Deployment Guide

This guide explains the steps required to build and deploy the Docker images for the backend and frontend, as well as deploying AWS infrastructure using Terraform.

## Prerequisites

Before starting, ensure that you have the following installed:

- Docker (for building and pushing Docker images)
- Terraform (for deploying AWS infrastructure)
- AWS CLI (for interacting with AWS)
- AWS credentials configured on your local machine

## Steps

1. **Configure AWS CLI:**
   ```bash
    aws configure
   ```

2. **Navigate to the backend folder:**
   ```bash
    cd backend/
   ```

3. **Update parameters in ```deploy.sh``` with the correct values:**
   ```bash
    nano deploy.sh
   ```

4. **Run deploy.sh**:
   ```bash
    ./deploy.sh
   ```

5. **Navigate to the frontend folder:**
   ```bash
    cd frontend/
   ```

6. **Update parameters in ```deploy.sh``` with the correct values:**
   ```bash
    nano deploy.sh
   ```

7. **Run deploy.sh**:
   ```bash
    ./deploy.sh
   ```

8. **Navigate to the terraform folder:**
   ```bash
    cd backend/
   ```

9. **Plan and apply changes:**
   ```bash
    terraform plan
    terraform apply
   ```