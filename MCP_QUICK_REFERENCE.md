# MCP Tools Quick Reference

## 🎯 What We Need (Simplified - No AWS)

### Essential MCP Servers (Now)

#### 1. Supabase MCP ⭐⭐⭐
**Status**: Need to check/create
**Purpose**: Database + Storage operations
**What it should do**:
- Query events table
- Create/update events
- Manage team members
- Query media gallery
- Database schema management
- **Upload/manage media files** (Supabase Storage)

#### 2. Vercel MCP ⭐⭐⭐
**Status**: Need to check/create
**Purpose**: Deployment management
**What it should do**:
- Deploy to Vercel
- Manage environment variables
- View deployment logs
- Configure domains
- View analytics

### Optional MCP Servers (Later)

#### 3. AWS MCP ⚠️
**Status**: Optional - Skip for now
**Purpose**: AWS services (S3, CloudFront)
**What it should do** (When ready):
- Upload files to S3
- List S3 objects
- Configure CloudFront
- Invalidate CloudFront cache
- Monitor costs

**Note**: Using Supabase Storage for media initially

**Note**: Use Supabase Storage for media initially

---

## ✅ What's Available Now

### CLI Tools (Use These Now)

```bash
# Supabase CLI
supabase db pull
supabase db push
supabase db diff

# Vercel CLI
vercel deploy
vercel env add
vercel logs

# AWS CLI
aws s3 cp file.jpg s3://bucket/
aws cloudfront create-invalidation
```

### GitHub MCP
**Status**: ✅ Already available
**Purpose**: Code management, PRs, issues

---

## 🚀 Quick Setup

### Step 1: Install CLI Tools
```bash
# Supabase (Essential)
npm install -g supabase

# Vercel (Essential)
npm install -g vercel

# AWS CLI (Optional - Skip for now)
# pip install awscli
```

### Step 2: Configure Authentication
```bash
# Supabase
supabase login

# Vercel
vercel login

# AWS (Skip for now)
# aws configure
```

### Step 3: Test
```bash
# Test Supabase
supabase projects list

# Test Vercel
vercel whoami

# Test AWS (Skip for now)
# aws s3 ls
```

---

## 📋 Common Operations

### Database (Supabase)
```bash
# Pull schema
supabase db pull

# Push changes
supabase db push

# View differences
supabase db diff
```

### Deployment (Vercel)
```bash
# Deploy
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs
```

### Media (Supabase Storage - For Now)
```bash
# Use Supabase Storage API or Dashboard
# Or use Supabase CLI
supabase storage list
supabase storage upload bucket-name file.jpg
```

### Media (AWS S3 - Optional, Later)
```bash
# When ready for AWS
aws s3 cp image.jpg s3://hoadao-media/images/
aws s3 ls s3://hoadao-media/images/
aws s3 sync ./images s3://hoadao-media/images/
```

---

## 🔍 Check for MCP Servers

### How to Check
1. Look in MCP server registry
2. Search GitHub for "supabase-mcp", "vercel-mcp", "aws-mcp"
3. Check official documentation
4. Ask in MCP community

### If Not Available
- Use CLI tools (immediate solution)
- Create custom MCP servers (later)
- Use helper scripts (middle ground)

---

## 💡 Recommended Approach

### Now (MVP)
✅ Use CLI tools
✅ Create helper scripts
✅ Document commands

### Later (Production)
✅ Check for MCP servers
✅ Create custom MCP if needed
✅ Integrate with development workflow

---

*Quick reference for MCP tools and CLI alternatives.*  
*See MCP_TOOLS_GUIDE.md for detailed setup.*  
*Last updated: [Date]*

