# Infrastructure Proposal
## HoadaoOfficial - Vietnamese Lion Dance Cultural Organization Platform

## Executive Summary

This document outlines the infrastructure architecture for a modern, scalable web platform featuring video/image showcases, team profiles, and calendar/events system with heavy UI focus and mobile responsiveness.

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Web App    │  │  Mobile Web   │  │   Admin UI   │ │
│  │  (React/TS)  │  │  (Responsive) │  │  (Optional)  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Frontend   │  │   API Layer  │  │   CDN/Media  │ │
│  │   (Static)   │  │  (Backend)   │  │   Storage    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    Data Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Database   │  │   File Store │  │   Cache      │ │
│  │  (PostgreSQL)│  │  (S3/CDN)    │  │  (Redis)     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Frontend Infrastructure

### Technology Stack

#### Core Framework
- **React 18+** with TypeScript
- **Vite** or **Next.js** (depending on SSR needs)
- **Tailwind CSS** for styling
- **React Query** for server state management

#### Recommended: Next.js Approach
**Pros:**
- Built-in SSR/SSG for SEO
- Image optimization
- API routes (can start without separate backend)
- Excellent performance
- Easy deployment

**Cons:**
- More complex than pure React
- Server-side rendering overhead

#### Alternative: Vite + React
**Pros:**
- Faster development
- Simpler setup
- Smaller bundle size
- Pure client-side

**Cons:**
- Need separate backend
- SEO requires additional setup
- No built-in image optimization

**Recommendation**: Start with **Next.js** for better SEO and built-in optimizations.

### Frontend Hosting Options

#### Option 1: Vercel (Recommended for Next.js)
- **Pros**: 
  - Zero-config deployment
  - Automatic SSL
  - Global CDN
  - Preview deployments
  - Free tier available
- **Cons**: 
  - Vendor lock-in
  - Limited customization
- **Cost**: Free tier, then $20/month+

#### Option 2: Netlify
- **Pros**:
  - Great for static sites
  - Free tier
  - Easy CI/CD
  - Form handling
- **Cons**:
  - Less optimized for Next.js
- **Cost**: Free tier, then $19/month+

#### Option 3: AWS Amplify / CloudFront
- **Pros**:
  - Full AWS integration
  - Highly scalable
  - Customizable
- **Cons**:
  - More complex setup
  - Higher cost
- **Cost**: Pay-as-you-go

**Recommendation**: **Vercel** for Next.js or **Netlify** for Vite/React.

---

## 2. Backend Infrastructure

### Backend Options

#### Option 1: Serverless Functions (Recommended)
**Platform**: Vercel Functions, Netlify Functions, or AWS Lambda

**Use Cases**:
- API endpoints
- Event management
- Calendar data
- Team profiles
- Form submissions

**Pros**:
- Auto-scaling
- Pay-per-use
- No server management
- Integrated with frontend hosting

**Cons**:
- Cold starts
- Limited execution time
- Stateless only

#### Option 2: Node.js Backend (Express/Fastify)
**Platform**: Railway, Render, Fly.io, or AWS EC2

**Use Cases**:
- Full REST API
- Real-time features
- Complex business logic
- WebSocket support

**Pros**:
- Full control
- Persistent connections
- More flexibility

**Cons**:
- Server management
- Scaling complexity
- Higher cost

#### Option 3: Backend-as-a-Service (BaaS)
**Platform**: Supabase, Firebase, or AWS Amplify

**Use Cases**:
- Database + API
- Authentication
- Real-time subscriptions
- File storage

**Pros**:
- Fast setup
- Built-in features
- Auto-scaling

**Cons**:
- Vendor lock-in
- Less customization
- Cost at scale

**Recommendation**: Start with **Serverless Functions** (Vercel/Netlify) for simplicity, migrate to dedicated backend if needed.

---

## 3. Database Infrastructure

### Database Options

#### Option 1: PostgreSQL (Recommended)
**Platform**: Supabase, Railway, Neon, or AWS RDS

**Why PostgreSQL**:
- Reliable and proven
- Great for relational data (events, team, calendar)
- JSON support for flexible schemas
- Strong ecosystem

**Schema Considerations**:
```sql
-- Events table
events (id, title, description, start_date, end_date, location, category, image_url, video_url, created_at)

-- Team members table
team_members (id, name, role, bio, image_url, social_links, created_at)

-- Media gallery table
media (id, type, url, thumbnail, title, description, event_id, created_at)

-- Calendar entries
calendar_entries (id, event_id, date, time, recurring_pattern)
```

#### Option 2: MongoDB
**Platform**: MongoDB Atlas

**Why MongoDB**:
- Flexible schema
- Good for media metadata
- Easy to scale

**Cons**:
- Less structured
- May need more validation

#### Option 3: Supabase (PostgreSQL + Extras)
**Platform**: Supabase

**Why Supabase**:
- PostgreSQL database
- Built-in auth
- Real-time subscriptions
- Storage included
- Free tier available

**Recommendation**: **Supabase** or **PostgreSQL on Railway/Neon** for best balance of features and cost.

---

## 4. Media Storage & CDN

### Media Requirements
- **Videos**: Lion dance performances, highlights
- **Images**: Team photos, event photos, gallery
- **Optimization**: WebP images, video compression
- **Delivery**: Fast global delivery

### Storage Options

#### Option 1: Cloudinary (Recommended)
**Pros**:
- Automatic image/video optimization
- Transformations on-the-fly
- CDN included
- Free tier (25GB)
- Easy integration

**Cons**:
- Cost at scale
- Vendor lock-in

**Cost**: Free tier, then $99/month+

#### Option 2: AWS S3 + CloudFront
**Pros**:
- Full control
- Highly scalable
- Cost-effective at scale
- Custom CDN

**Cons**:
- Manual optimization
- More complex setup
- Need separate image processing

**Cost**: Pay-as-you-go (~$0.023/GB storage)

#### Option 3: Supabase Storage
**Pros**:
- Integrated with database
- Built-in CDN
- Simple API
- Free tier (1GB)

**Cons**:
- Less optimization features
- Smaller ecosystem

**Cost**: Free tier, then $25/month+

#### Option 4: Vercel Blob / Netlify Blob
**Pros**:
- Integrated with hosting
- Simple setup
- Automatic CDN

**Cons**:
- Limited features
- Higher cost

**Recommendation**: **Cloudinary** for automatic optimization, or **Supabase Storage** for integrated solution.

---

## 5. Caching Strategy

### Cache Layers

#### 1. CDN Cache (Static Assets)
- Images, videos, fonts
- Cache: 1 year
- Platform: Vercel/Netlify CDN or CloudFront

#### 2. API Response Cache
- Event listings
- Team profiles
- Calendar data
- Cache: 5-15 minutes
- Platform: Redis or Vercel Edge Cache

#### 3. Browser Cache
- React Query cache
- Service Worker (PWA)
- Cache: Configurable per resource

### Caching Solution

#### Option 1: Vercel Edge Cache (if using Vercel)
- Built-in
- Automatic
- No setup needed

#### Option 2: Redis
**Platform**: Upstash (serverless Redis), Railway Redis, or AWS ElastiCache

**Use Cases**:
- API response caching
- Session storage
- Rate limiting

**Cost**: Upstash free tier, then $10/month+

**Recommendation**: **Vercel Edge Cache** if using Vercel, or **Upstash Redis** for serverless Redis.

---

## 6. Development Environment

### Local Development Stack

```bash
# Required
- Node.js 18+ (LTS)
- npm or pnpm
- Git

# Optional but recommended
- Docker (for local database)
- VS Code with extensions
- Postman/Insomnia (API testing)
```

### Development Tools

#### Code Quality
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Husky** - Git hooks
- **lint-staged** - Pre-commit checks

#### Testing (Future)
- **Vitest** - Unit tests
- **Playwright** - E2E tests
- **React Testing Library** - Component tests

#### Development Services
- **Local Database**: Docker PostgreSQL or Supabase local
- **Local Storage**: Local file system or MinIO (S3-compatible)
- **Environment Variables**: `.env.local` files

---

## 7. CI/CD Pipeline

### Pipeline Stages

```
1. Code Push → GitHub/GitLab
2. Automated Tests → Run test suite
3. Build → Compile and optimize
4. Deploy Preview → Staging environment
5. Deploy Production → Main environment
```

### CI/CD Options

#### Option 1: Vercel/Netlify (Recommended)
- **Pros**:
  - Zero-config
  - Automatic deployments
  - Preview deployments
  - Built-in
- **Setup**: Connect GitHub repo

#### Option 2: GitHub Actions
- **Pros**:
  - Full control
  - Customizable
  - Free for public repos
- **Cons**:
  - More setup
  - Need to configure deployments

#### Option 3: GitLab CI/CD
- **Pros**:
  - Integrated
  - Powerful
- **Cons**:
  - GitLab-specific

**Recommendation**: Use **Vercel/Netlify** built-in CI/CD for simplicity.

---

## 8. Monitoring & Analytics

### Application Monitoring

#### Option 1: Vercel Analytics (if using Vercel)
- Built-in
- Web vitals
- Real user monitoring
- Free tier

#### Option 2: Sentry
- Error tracking
- Performance monitoring
- Free tier available
- Great for production debugging

#### Option 3: LogRocket / Datadog
- Full-featured
- More expensive
- Enterprise-grade

**Recommendation**: **Vercel Analytics** + **Sentry** for error tracking.

### Analytics

#### Google Analytics 4
- Free
- Standard web analytics
- User behavior tracking

#### Plausible / Fathom
- Privacy-focused
- Simple
- Paid ($9/month+)

**Recommendation**: **Google Analytics 4** for free, comprehensive analytics.

---

## 9. Security Considerations

### Security Measures

#### 1. Authentication (if needed)
- **NextAuth.js** (Next.js)
- **Supabase Auth** (if using Supabase)
- **Auth0** (enterprise)

#### 2. API Security
- **Rate Limiting**: Upstash Rate Limit
- **CORS**: Configure properly
- **API Keys**: Environment variables
- **Input Validation**: Zod schemas

#### 3. Content Security
- **CSP Headers**: Content Security Policy
- **HTTPS**: Automatic with Vercel/Netlify
- **Security Headers**: Helmet.js or Next.js headers

#### 4. Data Protection
- **Environment Variables**: Never commit secrets
- **Database**: Use connection pooling
- **Backups**: Automated database backups

---

## 10. Scalability Considerations

### Current Scale (Initial)
- **Users**: 100-1,000 visitors/month
- **Events**: 10-50 events/month
- **Media**: 100-500 images, 10-50 videos
- **Traffic**: Low to moderate

### Future Scale (Growth)
- **Users**: 10,000+ visitors/month
- **Events**: 100+ events/month
- **Media**: 1,000+ images, 100+ videos
- **Traffic**: High, especially during Chinese New Year

### Scaling Strategy

#### Phase 1: Start Simple
- Vercel/Netlify hosting
- Supabase database
- Cloudinary media
- Serverless functions

#### Phase 2: Optimize
- Add Redis caching
- Implement CDN
- Database connection pooling
- Image/video optimization

#### Phase 3: Scale
- Database read replicas
- Multiple CDN regions
- Load balancing (if needed)
- Database sharding (if needed)

---

## 11. Cost Estimation

### Initial Setup (Monthly)

#### Option A: Minimal (Free Tier Focus)
- **Hosting**: Vercel/Netlify (Free)
- **Database**: Supabase (Free tier)
- **Storage**: Supabase Storage (Free tier) or Cloudinary (Free tier)
- **Total**: **$0-20/month**

#### Option B: Recommended (Production Ready)
- **Hosting**: Vercel Pro ($20/month)
- **Database**: Supabase Pro ($25/month) or Railway ($5-10/month)
- **Storage**: Cloudinary ($99/month) or Supabase Storage (included)
- **Cache**: Upstash Redis ($10/month)
- **Monitoring**: Sentry (Free tier)
- **Total**: **$55-155/month**

#### Option C: Enterprise Scale
- **Hosting**: Vercel Enterprise (custom)
- **Database**: AWS RDS ($50-200/month)
- **Storage**: AWS S3 + CloudFront ($50-200/month)
- **Cache**: AWS ElastiCache ($30-100/month)
- **Monitoring**: Datadog ($100+/month)
- **Total**: **$230-500+/month**

**Recommendation**: Start with **Option B** for production-ready setup.

---

## 12. Recommended Architecture (Phase 1)

### Tech Stack Summary

```
Frontend:
  - Next.js 14+ (App Router)
  - TypeScript
  - Tailwind CSS
  - React Query

Hosting:
  - Vercel (automatic deployments)

Database:
  - Supabase PostgreSQL
  - Supabase Auth (if needed)

Storage:
  - Cloudinary (images/videos)
  - Or Supabase Storage

Cache:
  - Vercel Edge Cache
  - React Query cache

Monitoring:
  - Vercel Analytics
  - Sentry (errors)

CI/CD:
  - Vercel (built-in)
```

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│         GitHub Repository               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Vercel (CI/CD + Hosting)        │
│  ┌──────────────┐  ┌──────────────┐    │
│  │  Next.js App │  │  API Routes  │    │
│  │  (Frontend)  │  │ (Serverless) │    │
│  └──────────────┘  └──────────────┘    │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
┌──────────────┐  ┌──────────────┐
│  Supabase   │  │  Cloudinary  │
│  (Database) │  │  (Media CDN)  │
└──────────────┘  └──────────────┘
```

---

## 13. Implementation Phases

### Phase 1: MVP (Weeks 1-4)
- [ ] Set up Next.js project
- [ ] Configure Tailwind CSS
- [ ] Set up Supabase database
- [ ] Deploy to Vercel
- [ ] Basic pages (Home, Events, Team)
- [ ] Image upload to Cloudinary

### Phase 2: Core Features (Weeks 5-8)
- [ ] Calendar/Events system
- [ ] Media gallery
- [ ] Team profiles
- [ ] Search functionality
- [ ] Responsive design

### Phase 3: Enhancements (Weeks 9-12)
- [ ] Animations integration
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Analytics setup
- [ ] Error monitoring

### Phase 4: Polish (Weeks 13-16)
- [ ] Testing
- [ ] Accessibility improvements
- [ ] Performance tuning
- [ ] Documentation
- [ ] Launch preparation

---

## 14. Decision Matrix

| Component | Option 1 | Option 2 | Option 3 | Recommendation |
|-----------|----------|----------|----------|----------------|
| **Frontend** | Next.js | Vite+React | Remix | Next.js |
| **Hosting** | Vercel | Netlify | AWS | Vercel |
| **Database** | Supabase | Railway | AWS RDS | Supabase |
| **Storage** | Cloudinary | Supabase | AWS S3 | Cloudinary |
| **Cache** | Vercel Edge | Upstash | Redis | Vercel Edge |
| **Monitoring** | Sentry | LogRocket | Datadog | Sentry |

---

## 15. Next Steps

### Immediate Actions
1. **Choose hosting platform** (Vercel recommended)
2. **Set up database** (Supabase recommended)
3. **Choose media storage** (Cloudinary recommended)
4. **Initialize Next.js project**
5. **Set up development environment**

### Questions to Answer
- [ ] Do we need user authentication?
- [ ] Do we need admin panel?
- [ ] What's the expected traffic?
- [ ] What's the budget?
- [ ] Do we need real-time features?

---

*This infrastructure proposal provides a scalable, cost-effective foundation for the platform.*  
*Last updated: [Date]*


