# AWS Cost Calculator - Quick Reference

## Quick Cost Estimates

### Daily Cost by Data Volume

| Data Volume | Daily Cost | Monthly Cost | Optimized Daily | Optimized Monthly |
|-------------|------------|--------------|-----------------|-------------------|
| **1GB/day** | $1.12 | $33.73 | $0.50-0.83 | $15-25 |
| **5GB/day** | $1.89 | $56.77 | $0.83-1.33 | $25-40 |
| **10GB/day** | $3.35 | $100.61 | $1.50-2.50 | $45-75 |
| **50GB/day** | $13.02 | $390.71 | $6.00-10.00 | $180-300 |

---

## Service Cost Breakdown (1GB/day - Base)

| Service | Monthly | Daily | % of Total |
|---------|---------|-------|------------|
| RDS PostgreSQL | $16.61 | $0.55 | 49% |
| ElastiCache Redis | $12.41 | $0.41 | 37% |
| CloudFront CDN | $2.65 | $0.09 | 8% |
| S3 Storage | $0.72 | $0.02 | 2% |
| Lambda API | $0.44 | $0.01 | 1% |
| Route 53 DNS | $0.90 | $0.03 | 3% |
| **TOTAL** | **$33.73** | **$1.12** | **100%** |

---

## Service Cost Breakdown (5GB/day)

| Service | Monthly | Daily | % of Total |
|---------|---------|-------|------------|
| RDS PostgreSQL | $22.91 | $0.76 | 40% |
| ElastiCache Redis | $12.41 | $0.41 | 22% |
| CloudFront CDN | $13.25 | $0.44 | 23% |
| S3 Storage | $3.50 | $0.12 | 6% |
| Lambda API | $2.18 | $0.07 | 4% |
| Route 53 DNS | $2.50 | $0.08 | 4% |
| **TOTAL** | **$56.77** | **$1.89** | **100%** |

---

## Service Cost Breakdown (10GB/day)

| Service | Monthly | Daily | % of Total |
|---------|---------|-------|------------|
| RDS PostgreSQL | $45.82 | $1.53 | 46% |
| ElastiCache Redis | $12.41 | $0.41 | 12% |
| CloudFront CDN | $26.50 | $0.88 | 26% |
| S3 Storage | $6.99 | $0.23 | 7% |
| Lambda API | $4.37 | $0.15 | 4% |
| Route 53 DNS | $4.50 | $0.15 | 4% |
| **TOTAL** | **$100.61** | **$3.35** | **100%** |

---

## Service Cost Breakdown (50GB/day)

| Service | Monthly | Daily | % of Total |
|---------|---------|-------|------------|
| RDS PostgreSQL | $154.64 | $5.15 | 40% |
| CloudFront CDN | $132.50 | $4.42 | 34% |
| Lambda API | $32.78 | $1.09 | 8% |
| ElastiCache Redis | $24.82 | $0.83 | 6% |
| S3 Storage | $25.45 | $0.85 | 7% |
| Route 53 DNS | $20.50 | $0.68 | 5% |
| **TOTAL** | **$390.71** | **$13.02** | **100%** |

---

## Cost Optimization Impact

### With Optimizations (1GB/day)

| Optimization | Before | After | Savings |
|--------------|--------|-------|---------|
| RDS Reserved (1-year) | $16.61 | $7.50 | -$9.11 |
| ElastiCache Serverless | $12.41 | $3-5 | -$7-9 |
| S3 Intelligent-Tiering | $0.72 | $0.50 | -$0.22 |
| CloudFront Price Class 100 | $2.65 | $2.12 | -$0.53 |
| **TOTAL** | **$33.73** | **$15-25** | **-40-55%** |

### With Optimizations (50GB/day)

| Optimization | Before | After | Savings |
|--------------|--------|-------|---------|
| RDS Reserved (1-year) | $154.64 | $93.00 | -$61.64 |
| ElastiCache Reserved | $24.82 | $15.00 | -$9.82 |
| S3 Intelligent-Tiering | $25.45 | $18.00 | -$7.45 |
| CloudFront Price Class 100 | $132.50 | $106.00 | -$26.50 |
| **TOTAL** | **$390.71** | **$250-300** | **-23-36%** |

---

## Cost Per GB of Data Transfer

### CloudFront (CDN)
- **First 10TB/month**: $0.085/GB
- **10-40TB/month**: $0.080/GB
- **40-100TB/month**: $0.060/GB

### Direct S3 (without CloudFront)
- **First 10TB/month**: $0.09/GB
- **More expensive**: Always use CloudFront

### Cost Comparison
- **1GB/day** (30GB/month): $2.55/month via CloudFront
- **50GB/day** (1.5TB/month): $127.50/month via CloudFront

---

## Storage Cost Per GB

### S3 Standard Storage
- **$0.023/GB-month**
- **1GB**: $0.023/month
- **100GB**: $2.30/month
- **1TB**: $23.00/month

### S3 Intelligent-Tiering
- **Frequent Access**: $0.023/GB-month
- **Infrequent Access**: $0.0125/GB-month
- **Archive**: $0.004/GB-month
- **Monitoring**: $0.0025/1,000 objects/month

### Estimated Savings
- **100GB with 50% infrequent**: Save ~$0.50/month
- **1TB with 50% infrequent**: Save ~$5.00/month

---

## Database Cost Scaling

### RDS PostgreSQL (ARM-based t4g)

| Instance | Hourly | Monthly | Best For |
|----------|--------|---------|----------|
| db.t4g.micro | $0.017 | $12.41 | 1-5GB/day |
| db.t4g.small | $0.034 | $24.82 | 10GB/day |
| db.t4g.medium | $0.068 | $49.64 | 50GB/day |

### Reserved Instance Savings (1-year)
- **db.t4g.micro**: $12.41 → $7.50/month (-40%)
- **db.t4g.small**: $24.82 → $15.00/month (-40%)
- **db.t4g.medium**: $49.64 → $30.00/month (-40%)

### Storage Costs
- **General Purpose SSD**: $0.115/GB-month
- **Backup Storage**: $0.095/GB-month
- **Example**: 100GB = $11.50 storage + $9.50 backups = $21/month

---

## Lambda Cost Calculation

### Pricing
- **Requests**: $0.20 per 1M requests
- **Compute**: $0.0000166667 per GB-second

### Example Calculations

#### 1GB/day (50,000 requests/month)
- **Requests**: 50,000 × $0.20/1M = $0.01
- **Compute**: 50,000 × 1s × 512MB × $0.0000166667 = $0.43
- **Total**: $0.44/month

#### 50GB/day (2.5M requests/month)
- **Requests**: 2.5M × $0.20/1M = $0.50
- **Compute**: 2.5M × 1s × 512MB × $0.0000166667 = $21.33
- **Total**: $21.83/month

### Optimization
- **Right-size memory**: 512MB → 256MB = 50% savings
- **Optimize duration**: 1s → 0.5s = 50% savings
- **Combined**: 75% savings potential

---

## ElastiCache Cost

### On-Demand Pricing (cache.t4g.micro)
- **Hourly**: $0.017
- **Monthly**: $12.41

### Reserved Instance (1-year)
- **Monthly**: $7.50 (-40% savings)

### Serverless (if available)
- **Pay-per-use**: $3-5/month for low traffic
- **Best for**: Variable workloads

---

## Monthly Cost Projection

### Conservative Growth

| Month | Data Volume | Monthly Cost | Daily Cost |
|-------|-------------|--------------|------------|
| 1-3 | 1GB/day | $20-25 | $0.67-0.83 |
| 4-6 | 5GB/day | $40-50 | $1.33-1.67 |
| 7-9 | 10GB/day | $70-85 | $2.33-2.83 |
| 10-12 | 20GB/day | $120-150 | $4.00-5.00 |

### Aggressive Growth

| Month | Data Volume | Monthly Cost | Daily Cost |
|-------|-------------|--------------|------------|
| 1-2 | 1GB/day | $20-25 | $0.67-0.83 |
| 3-4 | 10GB/day | $70-85 | $2.33-2.83 |
| 5-6 | 30GB/day | $180-220 | $6.00-7.33 |
| 7-12 | 50GB/day | $250-300 | $8.33-10.00 |

---

## Cost Alerts Thresholds

### Recommended Billing Alerts

| Alert Level | Threshold | Action |
|-------------|-----------|--------|
| **Warning** | 80% of budget | Review usage |
| **Critical** | 100% of budget | Immediate review |
| **Anomaly** | 150% of average | Investigate |

### Example Alerts (1GB/day budget: $25/month)
- **Warning**: $20/month
- **Critical**: $25/month
- **Anomaly**: $37.50/month

---

## Cost Comparison: AWS vs Alternatives

### AWS (1GB/day - Optimized)
- **Monthly**: $15-25
- **Daily**: $0.50-0.83

### Vercel + Supabase + Cloudinary
- **Monthly**: $144
- **Daily**: $4.80

### AWS Advantage
- **67-83% cheaper** than managed alternatives
- **More control** over resources
- **Better scaling** options

---

## Quick Cost Formula

### Daily Cost Estimate
```
Daily Cost ≈ (
  (Data Transfer GB × $0.085) / 30 +
  (Storage GB × $0.023) / 30 +
  $0.55 (RDS) +
  $0.41 (ElastiCache) +
  $0.01 (Lambda) +
  $0.03 (Route 53)
)
```

### Simplified (1GB/day)
```
$0.09 (CDN) + $0.02 (Storage) + $0.55 (RDS) + 
$0.41 (Cache) + $0.01 (Lambda) + $0.03 (DNS) 
= $1.11/day
```

---

## Budget Planning

### Year 1 Budget (Conservative)

| Quarter | Expected Volume | Monthly Budget | Annual Total |
|---------|----------------|----------------|--------------|
| Q1 | 1GB/day | $25 | $75 |
| Q2 | 5GB/day | $50 | $150 |
| Q3 | 10GB/day | $85 | $255 |
| Q4 | 20GB/day | $150 | $450 |
| **Total** | | | **$930/year** |

### Year 1 Budget (Optimized with Reserved)

| Quarter | Expected Volume | Monthly Budget | Annual Total |
|---------|----------------|----------------|--------------|
| Q1 | 1GB/day | $20 | $60 |
| Q2 | 5GB/day | $40 | $120 |
| Q3 | 10GB/day | $70 | $210 |
| Q4 | 20GB/day | $120 | $360 |
| **Total** | | | **$750/year** |

**Savings with Reserved Instances**: $180/year (19%)

---

*Quick reference for AWS cost calculations.*  
*See AWS_INFRASTRUCTURE_PROPOSAL.md for detailed analysis.*  
*Last updated: [Date]*


