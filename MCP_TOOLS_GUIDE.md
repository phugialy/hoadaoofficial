# MCP Tools & Development Workflow Guide
## Model Context Protocol (MCP) Support for Infrastructure

## Overview

MCP (Model Context Protocol) allows AI assistants to interact with external services and tools. This guide outlines what MCP tools are needed and available for our infrastructure stack.

---

## Required MCP Servers

### Current Infrastructure Stack
```
Frontend:     Vercel
Database:     Supabase
Media:        Supabase Storage (for now) → AWS S3 + CloudFront (later)
Monitoring:   Sentry
CI/CD:        Vercel (built-in)
```

### MCP Servers Needed

#### 1. ✅ Supabase MCP (Recommended)
**Purpose**: Database operations, schema management, data queries

**Capabilities Needed**:
- Query database tables
- Insert/update/delete records
- Manage database schema
- View table structures
- Execute SQL queries
- Monitor database performance

**Use Cases**:
- Create/update events
- Manage team members
- Query media gallery
- Database migrations
- Data analysis

**Status**: Check if Supabase MCP server exists or needs to be created

#### 2. ✅ Vercel MCP (Recommended)
**Purpose**: Deployment management, environment variables, project configuration

**Capabilities Needed**:
- Deploy applications
- Manage deployments
- Configure environment variables
- View deployment logs
- Manage domains
- View analytics

**Use Cases**:
- Deploy new versions
- Configure production/staging environments
- View deployment status
- Manage environment variables
- View performance metrics

**Status**: Check if Vercel MCP server exists or needs to be created

#### 3. ✅ AWS MCP (Recommended)
**Purpose**: AWS service management (S3, CloudFront, Lambda, etc.)

**Capabilities Needed**:
- S3 bucket operations (upload, list, delete)
- CloudFront distribution management
- Lambda function management
- IAM policy management
- CloudWatch monitoring
- Cost tracking

**Use Cases**:
- Upload media to S3
- Configure CloudFront
- Manage S3 lifecycle policies
- Monitor AWS costs
- View CloudWatch metrics

**Status**: Check if AWS MCP server exists or needs to be created

---

## Available MCP Servers (Current)

### Currently Available
Based on available MCP resources:
- ✅ **Canva MCP** - Available (not needed for this project)
- ❓ **Supabase MCP** - Need to check/create
- ❓ **Vercel MCP** - Need to check/create
- ❓ **AWS MCP** - Need to check/create

---

## MCP Server Setup Guide

### Option 1: Use Existing MCP Servers (If Available)

#### Supabase MCP
```bash
# If Supabase MCP exists
# Configure in MCP settings
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

#### Vercel MCP
```bash
# If Vercel MCP exists
# Configure in MCP settings
VERCEL_TOKEN=your-vercel-token
VERCEL_TEAM_ID=your-team-id
VERCEL_PROJECT_ID=your-project-id
```

#### AWS MCP
```bash
# If AWS MCP exists
# Configure in MCP settings
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

### Option 2: Create Custom MCP Servers (If Not Available)

#### Supabase MCP Server (Example Structure)
```typescript
// mcp-servers/supabase/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseMCPServer {
  private supabase: SupabaseClient;
  
  async queryTable(table: string, filters?: any) {
    // Query Supabase table
  }
  
  async insertRecord(table: string, data: any) {
    // Insert into Supabase
  }
  
  async updateRecord(table: string, id: string, data: any) {
    // Update Supabase record
  }
  
  async getSchema() {
    // Get database schema
  }
}
```

#### Vercel MCP Server (Example Structure)
```typescript
// mcp-servers/vercel/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Vercel } from '@vercel/sdk';

export class VercelMCPServer {
  private vercel: Vercel;
  
  async deploy() {
    // Trigger deployment
  }
  
  async getDeployments() {
    // List deployments
  }
  
  async setEnvironmentVariable(key: string, value: string) {
    // Set env var
  }
  
  async getLogs(deploymentId: string) {
    // Get deployment logs
  }
}
```

#### AWS MCP Server (Example Structure)
```typescript
// mcp-servers/aws/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { S3Client } from '@aws-sdk/client-s3';
import { CloudFrontClient } from '@aws-sdk/client-cloudfront';

export class AWSMCPServer {
  private s3: S3Client;
  private cloudfront: CloudFrontClient;
  
  async uploadToS3(bucket: string, key: string, file: Buffer) {
    // Upload to S3
  }
  
  async listS3Objects(bucket: string, prefix?: string) {
    // List S3 objects
  }
  
  async invalidateCloudFront(distributionId: string, paths: string[]) {
    // Invalidate CloudFront cache
  }
  
  async getCloudFrontMetrics(distributionId: string) {
    // Get CloudFront metrics
  }
}
```

---

## Alternative: CLI Tools & Scripts

If MCP servers are not available, use CLI tools and scripts:

### Supabase CLI
```bash
# Install
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Commands
supabase db pull          # Pull schema
supabase db push          # Push schema
supabase db diff          # Show differences
supabase db reset         # Reset database
supabase db dump          # Export data
```

### Vercel CLI
```bash
# Install
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Commands
vercel env add            # Add environment variable
vercel env ls             # List environment variables
vercel logs               # View logs
vercel domains            # Manage domains
vercel inspect            # Inspect deployment
```

### AWS CLI
```bash
# Install
# Windows: Use AWS CLI MSI installer
# Or: pip install awscli

# Configure
aws configure

# S3 Commands
aws s3 ls s3://hoadao-media
aws s3 cp file.jpg s3://hoadao-media/images/
aws s3 sync ./local-folder s3://hoadao-media/

# CloudFront Commands
aws cloudfront list-distributions
aws cloudfront create-invalidation --distribution-id ID --paths "/*"
```

---

## Development Workflow with MCP

### Ideal Workflow (With MCP)

```
Developer Request
    │
    │
    ▼
AI Assistant (with MCP)
    │
    ├── Supabase MCP
    │   ├── Query events
    │   ├── Create event
    │   └── Update schema
    │
    ├── Vercel MCP
    │   ├── Deploy changes
    │   ├── Set env vars
    │   └── View logs
    │
    └── AWS MCP
        ├── Upload media
        ├── Configure CloudFront
        └── Monitor costs
```

### Current Workflow (Without MCP)

```
Developer Request
    │
    ▼
AI Assistant
    │
    ├── Generate code
    ├── Provide CLI commands
    └── Guide manual setup
    │
    ▼
Developer executes commands manually
```

---

## Recommended MCP Setup

### Priority 1: Essential MCP Servers (Now)

#### 1. Supabase MCP ⭐⭐⭐
**Priority**: High - Essential
**Why**: Database is core to the application
**Benefits**:
- Query data directly
- Create/update records
- Manage schema
- Debug database issues
- Manage Supabase Storage (media files)

**Implementation**:
- Check if official Supabase MCP exists
- If not, create custom MCP server
- Or use Supabase CLI with scripts

#### 2. Vercel MCP ⭐⭐⭐
**Priority**: High - Essential
**Why**: Deployment is frequent
**Benefits**:
- Deploy automatically
- Manage environments
- View deployment status
- Configure settings

**Implementation**:
- Check if official Vercel MCP exists
- If not, use Vercel CLI
- Or create custom MCP server

### Priority 2: Optional MCP Servers (Later)

#### 3. AWS MCP ⚠️
**Priority**: Low - Optional (Not ready yet)
**Why**: Media management (using Supabase Storage for now)
**Benefits** (When ready):
- Upload media programmatically
- Configure CloudFront
- Monitor costs
- Manage S3 lifecycle

**Implementation** (When ready):
- Check if AWS MCP exists
- Use AWS CLI as alternative
- Or create custom MCP server

**Note**: Use Supabase Storage for media initially, migrate to AWS S3 when ready

### Priority 2: Optional MCP Servers

#### 4. GitHub MCP ⭐
**Priority**: Low (already available)
**Why**: Code management
**Status**: Already available in MCP tools

#### 5. Sentry MCP ⭐
**Priority**: Low
**Why**: Error monitoring
**Benefits**: View errors, create issues

---

## Implementation Strategy

### Phase 1: Use CLI Tools (Immediate)
```
✅ Supabase CLI - Available
✅ Vercel CLI - Available
✅ AWS CLI - Available
✅ GitHub CLI - Available
```

**Setup**:
1. Install all CLI tools
2. Configure authentication
3. Create helper scripts
4. Document commands

### Phase 2: Create MCP Servers (If Needed)
```
✅ Check for existing MCP servers
✅ Create custom MCP servers if needed
✅ Configure MCP in Cursor/IDE
✅ Test MCP integration
```

### Phase 3: Optimize Workflow
```
✅ Create MCP tool wrappers
✅ Document MCP usage
✅ Create automation scripts
✅ Integrate with development workflow
```

---

## MCP Configuration Files

### MCP Server Configuration (Example)

```json
// .cursor/mcp.json or similar
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["./mcp-servers/supabase/index.js"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_ANON_KEY": "${SUPABASE_ANON_KEY}",
        "SUPABASE_SERVICE_KEY": "${SUPABASE_SERVICE_KEY}"
      }
    },
    "vercel": {
      "command": "node",
      "args": ["./mcp-servers/vercel/index.js"],
      "env": {
        "VERCEL_TOKEN": "${VERCEL_TOKEN}",
        "VERCEL_TEAM_ID": "${VERCEL_TEAM_ID}"
      }
    },
    "aws": {
      "command": "node",
      "args": ["./mcp-servers/aws/index.js"],
      "env": {
        "AWS_ACCESS_KEY_ID": "${AWS_ACCESS_KEY_ID}",
        "AWS_SECRET_ACCESS_KEY": "${AWS_SECRET_ACCESS_KEY}",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

---

## CLI Tools Setup Guide

### Supabase CLI Setup

```bash
# Install
npm install -g supabase

# Login
supabase login

# Initialize (if starting new project)
supabase init

# Link to existing project
supabase link --project-ref your-project-ref

# Common commands
supabase db pull          # Pull remote schema
supabase db push          # Push local changes
supabase db diff          # Show differences
supabase db reset         # Reset local database
supabase db dump          # Export data
supabase db remote commit # Commit remote changes
```

### Vercel CLI Setup

```bash
# Install
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy
vercel                    # Deploy to preview
vercel --prod             # Deploy to production

# Environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env ls
vercel env rm VARIABLE_NAME

# View logs
vercel logs
vercel logs --follow

# Domains
vercel domains add yourdomain.com
vercel domains ls
```

### AWS CLI Setup

```bash
# Install (Windows)
# Download from: https://awscli.amazonaws.com/AWSCLIV2.msi

# Or use pip
pip install awscli

# Configure
aws configure
# Enter: Access Key ID
# Enter: Secret Access Key
# Enter: Default region (us-east-1)
# Enter: Output format (json)

# Test
aws s3 ls
aws sts get-caller-identity

# S3 operations
aws s3 mb s3://hoadao-media
aws s3 cp file.jpg s3://hoadao-media/images/
aws s3 sync ./images s3://hoadao-media/images/
aws s3 ls s3://hoadao-media --recursive

# CloudFront operations
aws cloudfront list-distributions
aws cloudfront get-distribution --id DISTRIBUTION_ID
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

---

## Helper Scripts (Alternative to MCP)

### Supabase Helper Scripts

```typescript
// scripts/supabase-helpers.ts
import { createClient } from '@supabase/supabase-js';

export async function queryEvents() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
  
  const { data, error } = await supabase
    .from('events')
    .select('*');
  
  return { data, error };
}

export async function createEvent(event: any) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
  
  const { data, error } = await supabase
    .from('events')
    .insert(event);
  
  return { data, error };
}
```

### Vercel Helper Scripts

```typescript
// scripts/vercel-helpers.ts
import { Vercel } from '@vercel/sdk';

export async function deploy() {
  const vercel = new Vercel({
    token: process.env.VERCEL_TOKEN!,
  });
  
  // Deploy logic
}

export async function getDeployments() {
  const vercel = new Vercel({
    token: process.env.VERCEL_TOKEN!,
  });
  
  const deployments = await vercel.deployments.list({
    projectId: process.env.VERCEL_PROJECT_ID!,
  });
  
  return deployments;
}
```

### AWS Helper Scripts

```typescript
// scripts/aws-helpers.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export async function uploadToS3(file: Buffer, key: string) {
  const s3 = new S3Client({ region: 'us-east-1' });
  
  await s3.send(new PutObjectCommand({
    Bucket: 'hoadao-media',
    Key: key,
    Body: file,
  }));
  
  return `https://your-cloudfront-domain.cloudfront.net/${key}`;
}
```

---

## Recommended Approach

### For MVP (Start Here)

1. **Use CLI Tools** (Available Now)
   - ✅ Supabase CLI (Essential)
   - ✅ Vercel CLI (Essential)
   - ⚠️ AWS CLI (Optional - Skip for now)
   - Create helper scripts

2. **Document Commands**
   - Common operations
   - Workflow steps
   - Troubleshooting

3. **Create Helper Scripts**
   - Wrap CLI commands
   - Simplify operations
   - Add to package.json

### For Production (Later)

1. **Check for MCP Servers**
   - Supabase MCP (if exists) - Priority
   - Vercel MCP (if exists) - Priority
   - AWS MCP (if exists) - Optional, skip for now

2. **Create Custom MCP Servers** (If Needed)
   - Start with Supabase
   - Add Vercel
   - Add AWS (when ready)

3. **Integrate with Development**
   - Configure in IDE
   - Test integration
   - Document usage

---

## Quick Setup Checklist

### Immediate Setup (CLI Tools)
- [ ] Install Supabase CLI
- [ ] Install Vercel CLI
- [ ] Install AWS CLI
- [ ] Configure authentication for all
- [ ] Test each CLI tool
- [ ] Create helper scripts
- [ ] Document common commands

### MCP Setup (If Available)
- [ ] Check for Supabase MCP server
- [ ] Check for Vercel MCP server
- [ ] Check for AWS MCP server
- [ ] Configure MCP servers
- [ ] Test MCP integration
- [ ] Document MCP usage

### Alternative (Custom MCP)
- [ ] Create Supabase MCP server
- [ ] Create Vercel MCP server
- [ ] Create AWS MCP server
- [ ] Configure in IDE
- [ ] Test integration

---

## Resources & Documentation

### MCP Documentation
- MCP Protocol: https://modelcontextprotocol.io
- MCP SDK: https://github.com/modelcontextprotocol

### Service CLIs
- Supabase CLI: https://supabase.com/docs/guides/cli
- Vercel CLI: https://vercel.com/docs/cli
- AWS CLI: https://docs.aws.amazon.com/cli/

### Service APIs
- Supabase API: https://supabase.com/docs/reference
- Vercel API: https://vercel.com/docs/rest-api
- AWS SDK: https://docs.aws.amazon.com/sdk-for-javascript/

---

*This guide helps set up MCP tools and CLI alternatives for infrastructure management.*  
*Start with CLI tools, then explore MCP servers for automation.*  
*Last updated: [Date]*

