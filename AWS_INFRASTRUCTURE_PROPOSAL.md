# AWS Infrastructure Proposal
## Budget-Friendly AWS Setup with Cost Analysis

## Executive Summary

This document provides an AWS-only infrastructure proposal with detailed cost analysis for different data volumes (1GB, 5GB, 10GB, 50GB per day/month) and budget optimization strategies.

---

## Recommended AWS Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CloudFront CDN                       │
│              (Global Content Delivery)                   │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌──────────────┐            ┌──────────────┐
│  S3 Bucket   │            │  S3 Bucket   │
│  (Static)    │            │  (Media)     │
│  Frontend App  │            │  Videos/Images│
└──────────────┘            └──────────────┘
        │                             │
        └──────────────┬──────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Application Load Balancer                  │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌──────────────┐            ┌──────────────┐
│  Lambda      │            │  ECS Fargate │
│  Functions   │            │  (Optional)  │
│  (API)       │            │  (Backend)   │
└──────────────┘            └──────────────┘
        │                             │
        └──────────────┬──────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌──────────────┐            ┌──────────────┐
│   RDS        │            │   ElastiCache│
│  PostgreSQL  │            │   Redis      │
│  (Database)  │            │   (Cache)    │
└──────────────┘            └──────────────┘
```

---

## AWS Services Selection

### Core Services

#### 1. Frontend Hosting
**Service**: **S3 + CloudFront**
- **S3**: Static website hosting
- **CloudFront**: Global CDN
- **Why**: Cost-effective, scalable, fast
- **Alternative**: Amplify (more expensive but easier)

#### 2. Backend/API
**Service**: **AWS Lambda** (Serverless)
- **Why**: Pay-per-use, auto-scaling, cost-effective
- **Alternative**: ECS Fargate (if need persistent connections)

#### 3. Database
**Service**: **RDS PostgreSQL** (db.t4g.micro or db.t3.micro)
- **Why**: Managed, reliable, scalable
- **Instance**: t4g.micro (ARM-based, cheaper) or t3.micro

#### 4. Media Storage
**Service**: **S3** (Standard or Intelligent-Tiering)
- **Why**: Cost-effective, scalable
- **Storage Class**: Standard for active, Intelligent-Tiering for cost savings

#### 5. Caching
**Service**: **ElastiCache Redis** (cache.t4g.micro)
- **Why**: Fast, managed
- **Alternative**: ElastiCache Serverless (pay-per-use)

#### 6. CDN
**Service**: **CloudFront**
- **Why**: Global distribution, included with S3

---

## Cost Breakdown by Data Volume

### Assumptions
- **Data Transfer**: Outbound from AWS to internet
- **Storage**: Media files (images, videos)
- **Database**: PostgreSQL with backups
- **Traffic**: Distributed globally via CloudFront

---

## Scenario 1: 1GB Data Per Day (30GB/Month)

### Daily Operations
- **Data Transfer**: 1GB/day = 30GB/month
- **Storage Growth**: ~1GB/day = 30GB/month
- **Database Size**: Small (<10GB)
- **Requests**: Low (1,000-5,000/day)

### AWS Services & Costs

#### S3 Storage (Media)
- **Storage**: 30GB × $0.023/GB = **$0.69/month**
- **PUT Requests**: 1,000 × $0.005/1,000 = **$0.01/month**
- **GET Requests**: 10,000 × $0.0004/1,000 = **$0.004/month**
- **Subtotal**: **$0.70/month**

#### S3 (Static Frontend)
- **Storage**: 1GB × $0.023/GB = **$0.02/month**
- **Requests**: Negligible
- **Subtotal**: **$0.02/month**

#### CloudFront (CDN)
- **Data Transfer Out**: 30GB × $0.085/GB (first 10TB) = **$2.55/month**
- **Requests**: 100,000 × $0.01/10,000 = **$0.10/month**
- **Subtotal**: **$2.65/month**

#### Lambda (API)
- **Requests**: 50,000/month × $0.20/1M = **$0.01/month**
- **Compute**: 50,000 × 1s × 512MB × $0.0000166667/GB-s = **$0.43/month**
- **Subtotal**: **$0.44/month**

#### RDS PostgreSQL (db.t4g.micro)
- **Instance**: $0.017/hour × 730 hours = **$12.41/month**
- **Storage**: 20GB × $0.115/GB = **$2.30/month**
- **Backups**: 20GB × $0.095/GB = **$1.90/month**
- **Data Transfer**: Included (within same region)
- **Subtotal**: **$16.61/month**

#### ElastiCache Redis (cache.t4g.micro)
- **Instance**: $0.017/hour × 730 hours = **$12.41/month**
- **Subtotal**: **$12.41/month**

#### Route 53 (DNS)
- **Hosted Zone**: $0.50/month
- **Queries**: 1M × $0.40/1M = **$0.40/month**
- **Subtotal**: **$0.90/month**

### Total Monthly Cost: **$33.73/month**
### Daily Cost: **$1.12/day**

---

## Scenario 2: 5GB Data Per Day (150GB/Month)

### Daily Operations
- **Data Transfer**: 5GB/day = 150GB/month
- **Storage Growth**: ~5GB/day = 150GB/month
- **Database Size**: Medium (10-50GB)
- **Requests**: Moderate (5,000-25,000/day)

### AWS Services & Costs

#### S3 Storage (Media)
- **Storage**: 150GB × $0.023/GB = **$3.45/month**
- **PUT Requests**: 5,000 × $0.005/1,000 = **$0.03/month**
- **GET Requests**: 50,000 × $0.0004/1,000 = **$0.02/month**
- **Subtotal**: **$3.50/month**

#### S3 (Static Frontend)
- **Storage**: 1GB × $0.023/GB = **$0.02/month**
- **Subtotal**: **$0.02/month**

#### CloudFront (CDN)
- **Data Transfer Out**: 150GB × $0.085/GB = **$12.75/month**
- **Requests**: 500,000 × $0.01/10,000 = **$0.50/month**
- **Subtotal**: **$13.25/month**

#### Lambda (API)
- **Requests**: 250,000/month × $0.20/1M = **$0.05/month**
- **Compute**: 250,000 × 1s × 512MB × $0.0000166667/GB-s = **$2.13/month**
- **Subtotal**: **$2.18/month**

#### RDS PostgreSQL (db.t4g.micro)
- **Instance**: $0.017/hour × 730 hours = **$12.41/month**
- **Storage**: 50GB × $0.115/GB = **$5.75/month**
- **Backups**: 50GB × $0.095/GB = **$4.75/month**
- **Subtotal**: **$22.91/month**

#### ElastiCache Redis (cache.t4g.micro)
- **Instance**: $0.017/hour × 730 hours = **$12.41/month**
- **Subtotal**: **$12.41/month**

#### Route 53 (DNS)
- **Hosted Zone**: $0.50/month
- **Queries**: 5M × $0.40/1M = **$2.00/month**
- **Subtotal**: **$2.50/month**

### Total Monthly Cost: **$56.77/month**
### Daily Cost: **$1.89/day**

---

## Scenario 3: 10GB Data Per Day (300GB/Month)

### Daily Operations
- **Data Transfer**: 10GB/day = 300GB/month
- **Storage Growth**: ~10GB/day = 300GB/month
- **Database Size**: Large (50-100GB)
- **Requests**: High (25,000-100,000/day)

### AWS Services & Costs

#### S3 Storage (Media)
- **Storage**: 300GB × $0.023/GB = **$6.90/month**
- **PUT Requests**: 10,000 × $0.005/1,000 = **$0.05/month**
- **GET Requests**: 100,000 × $0.0004/1,000 = **$0.04/month**
- **Subtotal**: **$6.99/month**

#### S3 (Static Frontend)
- **Storage**: 1GB × $0.023/GB = **$0.02/month**
- **Subtotal**: **$0.02/month**

#### CloudFront (CDN)
- **Data Transfer Out**: 300GB × $0.085/GB = **$25.50/month**
- **Requests**: 1M × $0.01/10,000 = **$1.00/month**
- **Subtotal**: **$26.50/month**

#### Lambda (API)
- **Requests**: 500,000/month × $0.20/1M = **$0.10/month**
- **Compute**: 500,000 × 1s × 512MB × $0.0000166667/GB-s = **$4.27/month**
- **Subtotal**: **$4.37/month**

#### RDS PostgreSQL (db.t4g.small - upgrade needed)
- **Instance**: $0.034/hour × 730 hours = **$24.82/month**
- **Storage**: 100GB × $0.115/GB = **$11.50/month**
- **Backups**: 100GB × $0.095/GB = **$9.50/month**
- **Subtotal**: **$45.82/month**

#### ElastiCache Redis (cache.t4g.micro)
- **Instance**: $0.017/hour × 730 hours = **$12.41/month**
- **Subtotal**: **$12.41/month**

#### Route 53 (DNS)
- **Hosted Zone**: $0.50/month
- **Queries**: 10M × $0.40/1M = **$4.00/month**
- **Subtotal**: **$4.50/month**

### Total Monthly Cost: **$100.61/month**
### Daily Cost: **$3.35/day**

---

## Scenario 4: 50GB Data Per Day (1.5TB/Month)

### Daily Operations
- **Data Transfer**: 50GB/day = 1.5TB/month
- **Storage Growth**: ~50GB/day = 1.5TB/month
- **Database Size**: Very Large (100-500GB)
- **Requests**: Very High (100,000-500,000/day)

### AWS Services & Costs

#### S3 Storage (Media) - Intelligent-Tiering
- **Storage**: 1.5TB × $0.023/GB = **$34.50/month** (Standard)
- **Intelligent-Tiering**: ~$25/month (estimated savings)
- **PUT Requests**: 50,000 × $0.005/1,000 = **$0.25/month**
- **GET Requests**: 500,000 × $0.0004/1,000 = **$0.20/month**
- **Subtotal**: **$25.45/month** (with Intelligent-Tiering)

#### S3 (Static Frontend)
- **Storage**: 1GB × $0.023/GB = **$0.02/month**
- **Subtotal**: **$0.02/month**

#### CloudFront (CDN)
- **Data Transfer Out**: 1.5TB × $0.085/GB = **$127.50/month**
- **Requests**: 5M × $0.01/10,000 = **$5.00/month**
- **Subtotal**: **$132.50/month**

#### Lambda (API) - May need provisioned concurrency
- **Requests**: 2.5M/month × $0.20/1M = **$0.50/month**
- **Compute**: 2.5M × 1s × 512MB × $0.0000166667/GB-s = **$21.33/month**
- **Provisioned Concurrency** (if needed): $0.015/hour × 730 = **$10.95/month**
- **Subtotal**: **$32.78/month**

#### RDS PostgreSQL (db.t4g.medium - upgrade needed)
- **Instance**: $0.068/hour × 730 hours = **$49.64/month**
- **Storage**: 500GB × $0.115/GB = **$57.50/month**
- **Backups**: 500GB × $0.095/GB = **$47.50/month**
- **Subtotal**: **$154.64/month**

#### ElastiCache Redis (cache.t4g.small - upgrade needed)
- **Instance**: $0.034/hour × 730 hours = **$24.82/month**
- **Subtotal**: **$24.82/month**

#### Route 53 (DNS)
- **Hosted Zone**: $0.50/month
- **Queries**: 50M × $0.40/1M = **$20.00/month**
- **Subtotal**: **$20.50/month**

### Total Monthly Cost: **$390.71/month**
### Daily Cost: **$13.02/day**

---

## Cost Summary Table

| Data Volume | Monthly Cost | Daily Cost | Key Services |
|-------------|--------------|------------|--------------|
| **1GB/day** (30GB/month) | $33.73 | $1.12 | Micro instances, minimal storage |
| **5GB/day** (150GB/month) | $56.77 | $1.89 | Micro instances, moderate storage |
| **10GB/day** (300GB/month) | $100.61 | $3.35 | Small DB instance, higher CDN |
| **50GB/day** (1.5TB/month) | $390.71 | $13.02 | Medium DB, large CDN, Intelligent-Tiering |

---

## Cost Optimization Strategies

### 1. S3 Storage Optimization

#### Use Intelligent-Tiering
- **Savings**: 20-40% on infrequently accessed data
- **When**: Storage > 100GB
- **Cost**: $0.0025/1,000 objects/month monitoring fee

#### Use S3 Lifecycle Policies
- **Move to Glacier**: After 90 days (90% savings)
- **Delete old versions**: After 30 days
- **Estimated Savings**: 30-50% on archival data

#### Compress Media Files
- **Images**: Use WebP format (30-50% smaller)
- **Videos**: Optimize encoding
- **Estimated Savings**: 30-40% on storage and transfer

### 2. CloudFront Optimization

#### Use CloudFront Caching
- **Cache static assets**: 1 year
- **Cache API responses**: 5-15 minutes
- **Estimated Savings**: 50-70% on data transfer

#### Use CloudFront Price Classes
- **Price Class 100**: Only US, Canada, Europe (cheaper)
- **Savings**: 20-30% on data transfer
- **Trade-off**: Slower in other regions

### 3. Database Optimization

#### Use Reserved Instances (1-year)
- **Savings**: 30-40% vs On-Demand
- **Example**: db.t4g.micro: $12.41 → $7.50/month
- **Commitment**: 1-year term

#### Use Aurora Serverless v2 (if applicable)
- **Pay-per-use**: Only when active
- **Savings**: 50-70% for low-traffic periods
- **Best for**: Variable traffic

### 4. Lambda Optimization

#### Optimize Function Memory
- **Right-size**: Use minimum needed memory
- **Savings**: 20-30% on compute costs
- **Tool**: AWS Lambda Power Tuning

#### Use Provisioned Concurrency Wisely
- **Only when needed**: High-traffic endpoints
- **Use on-demand**: For most functions
- **Savings**: 50-70% for low-traffic functions

### 5. ElastiCache Optimization

#### Use ElastiCache Serverless (if available)
- **Pay-per-use**: Only when active
- **Savings**: 50-70% for variable traffic
- **Best for**: Spiky workloads

#### Use Reserved Nodes (1-year)
- **Savings**: 30-40% vs On-Demand
- **Example**: cache.t4g.micro: $12.41 → $7.50/month

---

## Budget-Friendly Alternative Architecture

### Ultra-Low Cost Setup (1-5GB/day)

```
Frontend:     S3 + CloudFront (Free tier: 50GB transfer)
Backend:      Lambda (Free tier: 1M requests/month)
Database:     RDS db.t4g.micro (Reserved: $7.50/month)
Cache:        ElastiCache Serverless (pay-per-use)
Storage:      S3 Intelligent-Tiering
DNS:          Route 53 (Free tier: 1M queries/month)
```

**Estimated Cost**: $15-25/month (with optimizations)

---

## Cost Breakdown by Service (1GB/day example)

| Service | Monthly Cost | % of Total | Optimization Potential |
|---------|--------------|-----------|------------------------|
| **RDS** | $16.61 | 49% | Reserved Instances (-40%) |
| **ElastiCache** | $12.41 | 37% | Serverless or Reserved (-40%) |
| **CloudFront** | $2.65 | 8% | Price Class 100 (-20%) |
| **S3** | $0.72 | 2% | Intelligent-Tiering (-30%) |
| **Lambda** | $0.44 | 1% | Right-size memory (-20%) |
| **Route 53** | $0.90 | 3% | Minimal optimization |
| **Total** | $33.73 | 100% | **Optimized: ~$20/month** |

---

## Scaling Recommendations

### Phase 1: Start (1GB/day)
- **RDS**: db.t4g.micro (On-Demand)
- **ElastiCache**: cache.t4g.micro (On-Demand)
- **Cost**: $33.73/month

### Phase 2: Growth (5GB/day)
- **RDS**: db.t4g.micro (Reserved 1-year)
- **ElastiCache**: cache.t4g.micro (Reserved 1-year)
- **Cost**: $45/month (with optimizations)

### Phase 3: Scale (10GB/day)
- **RDS**: db.t4g.small (Reserved 1-year)
- **ElastiCache**: cache.t4g.micro (Reserved 1-year)
- **S3**: Intelligent-Tiering
- **Cost**: $75/month (with optimizations)

### Phase 4: Large Scale (50GB/day)
- **RDS**: db.t4g.medium (Reserved 1-year)
- **ElastiCache**: cache.t4g.small (Reserved 1-year)
- **S3**: Intelligent-Tiering + Lifecycle
- **CloudFront**: Price Class 100
- **Cost**: $250/month (with optimizations)

---

## Additional Cost Considerations

### Data Transfer Costs

#### Within AWS (Same Region)
- **Free**: Data transfer within same region
- **Best Practice**: Keep services in same region (us-east-1 recommended)

#### Outbound to Internet
- **First 100GB/month**: Free (if using CloudFront)
- **After 100GB**: $0.09/GB (varies by region)
- **Optimization**: Use CloudFront (cheaper than direct S3)

### Backup Costs
- **RDS Backups**: $0.095/GB-month
- **S3 Versioning**: $0.023/GB-month
- **Optimization**: Reduce retention periods

### Monitoring Costs
- **CloudWatch**: First 10 metrics free, then $0.30/metric-month
- **CloudWatch Logs**: $0.50/GB ingested
- **Optimization**: Set log retention, filter logs

---

## Cost Estimation Tool

### Daily Cost Formula

```
Daily Cost = (
  RDS Instance Cost / 30 +
  ElastiCache Cost / 30 +
  S3 Storage Cost / 30 +
  CloudFront Transfer Cost / 30 +
  Lambda Cost / 30 +
  Route 53 Cost / 30
)
```

### Monthly Cost Formula

```
Monthly Cost = (
  RDS: Instance + Storage + Backups +
  ElastiCache: Instance +
  S3: Storage + Requests +
  CloudFront: Transfer + Requests +
  Lambda: Requests + Compute +
  Route 53: Hosted Zone + Queries
)
```

---

## AWS Free Tier Benefits

### Always Free (No Expiration)
- **S3**: 5GB storage, 20,000 GET requests
- **Lambda**: 1M requests/month, 400,000 GB-seconds
- **CloudFront**: 50GB data transfer out
- **Route 53**: 1M queries/month

### 12-Month Free Tier
- **RDS**: 750 hours/month db.t2.micro (expired after 12 months)
- **ElastiCache**: Not included in free tier

**Note**: Free tier helps in first year, but production costs apply after.

---

## Recommended Budget-Friendly Setup

### For 1-5GB/day Traffic

```
Service              Instance/Config          Monthly Cost
─────────────────────────────────────────────────────────
RDS PostgreSQL       db.t4g.micro (Reserved)  $7.50
ElastiCache Redis    Serverless (pay-per-use) $3-5
S3 Storage           Intelligent-Tiering      $1-2
CloudFront CDN       Price Class 100         $2-5
Lambda Functions     Free tier + minimal      $0-1
Route 53 DNS         Free tier                $0.50
─────────────────────────────────────────────────────────
TOTAL (Optimized)                            $15-25/month
Daily Cost                                    $0.50-0.83/day
```

---

## Cost Alerts & Monitoring

### Set Up Billing Alerts
1. **CloudWatch Billing Alarm**: Alert at 80% of budget
2. **Cost Anomaly Detection**: Detect unusual spending
3. **Budget Reports**: Weekly/monthly summaries

### Cost Monitoring Tools
- **AWS Cost Explorer**: Analyze spending
- **AWS Budgets**: Set spending limits
- **AWS Cost Anomaly Detection**: Automatic alerts

---

## Migration Path

### Month 1-3: Development
- Use free tier where possible
- **Estimated Cost**: $0-10/month

### Month 4-6: Launch (1GB/day)
- Production setup
- **Estimated Cost**: $20-35/month (with optimizations)

### Month 7-12: Growth (5GB/day)
- Scale as needed
- **Estimated Cost**: $40-60/month

### Year 2+: Scale (10GB+/day)
- Optimize with Reserved Instances
- **Estimated Cost**: $75-150/month

---

*This AWS infrastructure proposal provides budget-friendly options with detailed cost analysis.*  
*Last updated: [Date]*


