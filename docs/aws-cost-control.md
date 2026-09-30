# AWS Cost Control & Teardown Instructions

> [!WARNING]
> AWS resources in this project generate active hourly billing. Follow these guidelines to avoid unnecessary charges!

## Resource Cost Breakdown

| Resource | Hourly Rate (Approx.) | Monthly Cost (24/7 Run) | Optimization Tip |
| :--- | :--- | :--- | :--- |
| **AWS EKS Control Plane** | ~$0.10 / hr | ~$73 / month | Delete cluster when not testing |
| **EC2 Jenkins (t3.large)** | ~$0.083 / hr | ~$60 / month | Stop EC2 instance when idle |
| **NAT Gateway** | ~$0.045 / hr + data | ~$32 / month | Destroy when done testing |
| **Managed EC2 Nodes (2x t3.medium)** | ~$0.083 / hr | ~$60 / month | Scale node group to 0 when idle |
| **EBS Storage (30GB + Node Disks)** | ~$0.10 / GB-month | ~$10 / month | Delete unattached volumes |

---

## What Continues Charging Even When EC2 Is Stopped?

1. **EBS Volumes**: EBS storage is billed continuously as long as the volume exists.
2. **Elastic IP (EIP)**: Unattached Elastic IPs incur AWS idle fees.
3. **EKS Control Plane**: Billed per hour regardless of pod activity.
4. **NAT Gateway**: Charged hourly even with 0 network traffic.

---

## Infrastructure Destruction (Cost Elimination)

To completely stop all AWS billing, run:

```bash
cd terraform
terraform destroy
```

Confirm destroying resources by typing `yes` when prompted.
Verify in AWS Management Console that VPCs, EKS Clusters, and EC2 instances are deleted.
