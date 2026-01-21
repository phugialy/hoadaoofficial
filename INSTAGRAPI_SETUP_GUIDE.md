# Instagrapi Setup Guide (Use at Your Own Risk)

## ⚠️ Important Disclaimers

- **Violates Instagram ToS**: Using instagrapi may violate Instagram's Terms of Service
- **Account Risk**: Your Instagram account may be banned or restricted
- **No Support**: This is unofficial and can break anytime
- **Legal**: May have legal implications in some jurisdictions

**Use only if:**
- You accept all risks
- You have a test/disposable account
- You understand the consequences

---

## Quick Setup Options

### Option A: Instagrapi-REST (Easiest)

**Using Docker:**

```bash
# Pull and run instagrapi-rest
docker run -d \
  -p 8080:8080 \
  -v $(pwd)/sessions:/app/sessions \
  subzeroid/instagrapi-rest:latest
```

**Using Python:**

```bash
pip install instagrapi-rest
instagrapi-rest
```

Then access at `http://localhost:8080`

**API Usage:**
```bash
# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'

# Get posts
curl http://localhost:8080/user/YOUR_USERNAME/media?amount=10
```

### Option B: Direct Python Implementation

**Install:**
```bash
pip install instagrapi
```

**Basic Script:**
```python
from instagrapi import Client
import json

# Initialize client
cl = Client()

# Login (use session if available)
try:
    cl.load_settings('session.json')
    cl.login("YOUR_USERNAME", "YOUR_PASSWORD")
    cl.dump_settings('session.json')
except Exception as e:
    print(f"Login failed: {e}")

# Get user posts
username = "your_instagram_username"
user_id = cl.user_id_from_username(username)
posts = cl.user_medias(user_id, amount=20)

# Format for your database
formatted_posts = []
for post in posts:
    formatted_posts.append({
        "instagram_post_id": post.code,
        "media_url": post.thumbnail_url or post.video_url,
        "permalink": f"https://www.instagram.com/p/{post.code}/",
        "caption": post.caption_text,
        "timestamp": post.taken_at.isoformat(),
        "media_type": "VIDEO" if post.media_type == 2 else "IMAGE",
    })

print(json.dumps(formatted_posts, indent=2))
```

---

## Integration with Your Next.js App

### Approach 1: Separate Python Service

1. **Create Python API (FastAPI example):**

```python
# api.py
from fastapi import FastAPI
from instagrapi import Client
import os

app = FastAPI()
cl = Client()

@app.on_event("startup")
async def startup():
    # Load session or login
    if os.path.exists('session.json'):
        cl.load_settings('session.json')
    else:
        cl.login(
            os.getenv('INSTAGRAM_USERNAME'),
            os.getenv('INSTAGRAM_PASSWORD')
        )
        cl.dump_settings('session.json')

@app.get("/api/posts/{username}")
async def get_posts(username: str, amount: int = 20):
    try:
        user_id = cl.user_id_from_username(username)
        posts = cl.user_medias(user_id, amount=amount)
        
        formatted = []
        for post in posts:
            formatted.append({
                "id": post.code,
                "media_url": post.thumbnail_url or post.video_url,
                "permalink": f"https://www.instagram.com/p/{post.code}/",
                "caption": post.caption_text or "",
                "timestamp": post.taken_at.isoformat(),
                "media_type": "VIDEO" if post.media_type == 2 else "IMAGE",
            })
        
        return {"posts": formatted}
    except Exception as e:
        return {"error": str(e)}, 500
```

2. **Update Next.js API route to call Python service:**

```typescript
// src/app/api/admin/instagram/instagrapi-sync/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Call your Python service
    const pythonServiceUrl = process.env.INSTAGRAPI_SERVICE_URL || 'http://localhost:8000'
    const { username } = await request.json()

    const response = await fetch(`${pythonServiceUrl}/api/posts/${username}`, {
      method: 'GET',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch from instagrapi service')
    }

    // Save to Supabase (same as Graph API sync)
    const supabase = createServerClient()
    // ... save posts logic

    return NextResponse.json({ success: true, posts: data.posts })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to sync via instagrapi' },
      { status: 500 }
    )
  }
}
```

3. **Add environment variable:**
```env
INSTAGRAPI_SERVICE_URL=http://localhost:8000
```

### Approach 2: Vercel Serverless Function (Limited)

Vercel supports Python, but instagrapi is heavy and may hit size limits:

```python
# api/instagrapi-sync.py (Vercel serverless)
from instagrapi import Client
import json

def handler(request):
    # Note: This may not work well due to size limits
    cl = Client()
    # ... implementation
```

---

## Deployment Options

### Option 1: Railway/Render (Recommended for Python)

1. Create `requirements.txt`:
```
instagrapi
fastapi
uvicorn
```

2. Create `Procfile`:
```
web: uvicorn api:app --host 0.0.0.0 --port $PORT
```

3. Deploy to Railway/Render

### Option 2: Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  instagrapi-api:
    image: subzeroid/instagrapi-rest:latest
    ports:
      - "8080:8080"
    volumes:
      - ./sessions:/app/sessions
    environment:
      - INSTAGRAM_USERNAME=your_username
      - INSTAGRAM_PASSWORD=your_password
```

Run: `docker-compose up -d`

---

## Security Best Practices (If Using)

1. **Use Environment Variables:**
   - Never hardcode credentials
   - Store in `.env` or secrets manager

2. **Session Management:**
   - Save session files securely
   - Don't commit sessions to git
   - Use encrypted storage

3. **Rate Limiting:**
   - Don't make too many requests
   - Add delays between requests
   - Cache results

4. **Dedicated Account:**
   - Use a test/separate account
   - Don't use your main business account

5. **Error Handling:**
   - Handle account bans gracefully
   - Have fallback methods
   - Monitor for issues

---

## Alternative: Safer Options

Instead of instagrapi, consider:

1. **Instagram Graph API** (Official, safe)
   - See `INSTAGRAM_API_QUICK_START.md`

2. **URL Import** (Already implemented)
   - See `INSTAGRAM_NO_API_SETUP.md`

3. **Third-party Services:**
   - RapidAPI Instagram APIs (paid)
   - Apify Instagram scraper (paid)
   - Social Media APIs (various)

---

## Conclusion

**My recommendation:**
- ✅ Use URL Import (current, works great)
- ✅ Set up Graph API if you need auto-sync (official, safe)
- ⚠️ Avoid instagrapi unless you really need it

**If you still want instagrapi:**
- Use a separate test account
- Deploy as separate service
- Monitor for account issues
- Have fallback to URL import

---

## Need Help?

If you want to implement instagrapi:
1. Tell me which approach you prefer
2. I can create the code files
3. Help with deployment setup

But remember: **Use at your own risk!** ⚠️
