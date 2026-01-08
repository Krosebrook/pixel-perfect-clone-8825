# API Reference

## Overview

This document provides a reference for available API endpoints and how to interact with them in the Pixel Perfect Clone platform.

## Base Configuration

### API Endpoint

```
Base URL: https://[your-project].supabase.co
```

The API is powered by Supabase and auto-generated from the database schema.

### Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

Tokens are obtained through the Supabase authentication flow and automatically managed by the `@supabase/supabase-js` client.

## Authentication API

### Sign Up

**Endpoint:** Supabase Auth - `auth.signUp()`

**Description:** Create a new user account

**Request:**
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure_password',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
})
```

**Response:**
```typescript
{
  user: {
    id: 'uuid',
    email: 'user@example.com',
    created_at: '2024-01-08T12:00:00Z'
  },
  session: {
    access_token: 'jwt_token',
    refresh_token: 'refresh_token'
  }
}
```

### Sign In

**Endpoint:** Supabase Auth - `auth.signInWithPassword()`

**Description:** Authenticate an existing user

**Request:**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure_password'
})
```

**Response:**
```typescript
{
  user: { /* user object */ },
  session: {
    access_token: 'jwt_token',
    refresh_token: 'refresh_token',
    expires_in: 3600
  }
}
```

### Sign Out

**Endpoint:** Supabase Auth - `auth.signOut()`

**Description:** End user session

**Request:**
```typescript
const { error } = await supabase.auth.signOut()
```

### Get Session

**Endpoint:** Supabase Auth - `auth.getSession()`

**Description:** Retrieve current user session

**Request:**
```typescript
const { data: { session }, error } = await supabase.auth.getSession()
```

## Profiles API

### Get All Profiles

**Endpoint:** `GET /rest/v1/profiles`

**Description:** Retrieve all user profiles

**Authorization:** Public (Read-only)

**Request:**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
```

**Response:**
```typescript
[
  {
    id: 'uuid',
    full_name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg',
    department: 'Engineering',
    created_at: '2024-01-08T12:00:00Z',
    updated_at: '2024-01-08T12:00:00Z'
  }
]
```

### Get Profile by ID

**Endpoint:** `GET /rest/v1/profiles?id=eq.<uuid>`

**Description:** Retrieve a specific user profile

**Request:**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()
```

### Update Own Profile

**Endpoint:** `PATCH /rest/v1/profiles?id=eq.<uuid>`

**Description:** Update authenticated user's profile

**Authorization:** User must own the profile

**Request:**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({
    full_name: 'Jane Doe',
    department: 'Product',
    avatar_url: 'https://example.com/new-avatar.jpg'
  })
  .eq('id', userId)
```

**Response:**
```typescript
{
  id: 'uuid',
  full_name: 'Jane Doe',
  department: 'Product',
  avatar_url: 'https://example.com/new-avatar.jpg',
  updated_at: '2024-01-08T13:00:00Z'
}
```

## Messages API

### Get All Messages

**Endpoint:** `GET /rest/v1/messages`

**Description:** Retrieve all messages

**Authorization:** Authenticated users only

**Request:**
```typescript
const { data, error } = await supabase
  .from('messages')
  .select(`
    *,
    sender:profiles(id, full_name, avatar_url)
  `)
  .order('created_at', { ascending: false })
```

**Response:**
```typescript
[
  {
    id: 'uuid',
    sender_id: 'uuid',
    content: 'Hello, team!',
    created_at: '2024-01-08T12:00:00Z',
    sender: {
      id: 'uuid',
      full_name: 'John Doe',
      avatar_url: 'https://example.com/avatar.jpg'
    }
  }
]
```

### Create Message

**Endpoint:** `POST /rest/v1/messages`

**Description:** Send a new message

**Authorization:** Authenticated users only

**Request:**
```typescript
const { data, error } = await supabase
  .from('messages')
  .insert({
    sender_id: userId,
    content: 'Hello, team!'
  })
  .select()
```

**Response:**
```typescript
{
  id: 'uuid',
  sender_id: 'uuid',
  content: 'Hello, team!',
  created_at: '2024-01-08T12:00:00Z'
}
```

### Real-time Message Subscription

**Description:** Subscribe to new messages in real-time

**Request:**
```typescript
const subscription = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages'
    },
    (payload) => {
      console.log('New message:', payload.new)
    }
  )
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

## Recognitions API

### Get All Recognitions

**Endpoint:** `GET /rest/v1/recognitions`

**Description:** Retrieve all recognitions

**Authorization:** Authenticated users only

**Request:**
```typescript
const { data, error } = await supabase
  .from('recognitions')
  .select(`
    *,
    giver:giver_id(id, full_name, avatar_url),
    receiver:receiver_id(id, full_name, avatar_url)
  `)
  .order('created_at', { ascending: false })
```

**Response:**
```typescript
[
  {
    id: 'uuid',
    giver_id: 'uuid',
    receiver_id: 'uuid',
    message: 'Great work on the project!',
    badge_type: 'star',
    created_at: '2024-01-08T12:00:00Z',
    giver: {
      id: 'uuid',
      full_name: 'John Doe',
      avatar_url: 'https://example.com/avatar.jpg'
    },
    receiver: {
      id: 'uuid',
      full_name: 'Jane Smith',
      avatar_url: 'https://example.com/avatar2.jpg'
    }
  }
]
```

### Get Recognitions for User

**Endpoint:** `GET /rest/v1/recognitions?receiver_id=eq.<uuid>`

**Description:** Retrieve recognitions received by a specific user

**Request:**
```typescript
const { data, error } = await supabase
  .from('recognitions')
  .select(`
    *,
    giver:giver_id(id, full_name, avatar_url)
  `)
  .eq('receiver_id', userId)
  .order('created_at', { ascending: false })
```

### Create Recognition

**Endpoint:** `POST /rest/v1/recognitions`

**Description:** Give a recognition to another user

**Authorization:** Authenticated users only

**Request:**
```typescript
const { data, error } = await supabase
  .from('recognitions')
  .insert({
    giver_id: currentUserId,
    receiver_id: recipientUserId,
    message: 'Excellent teamwork!',
    badge_type: 'star'
  })
  .select()
```

**Response:**
```typescript
{
  id: 'uuid',
  giver_id: 'uuid',
  receiver_id: 'uuid',
  message: 'Excellent teamwork!',
  badge_type: 'star',
  created_at: '2024-01-08T12:00:00Z'
}
```

**Badge Types:**
- `star`: Star badge
- `trophy`: Trophy badge
- `heart`: Heart badge
- `fire`: Fire badge
- `rocket`: Rocket badge

### Real-time Recognition Subscription

**Description:** Subscribe to new recognitions in real-time

**Request:**
```typescript
const subscription = supabase
  .channel('recognitions')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'recognitions'
    },
    (payload) => {
      console.log('New recognition:', payload.new)
    }
  )
  .subscribe()
```

## Query Builders

### Filtering

**Equal:**
```typescript
.eq('column', 'value')
```

**Not Equal:**
```typescript
.neq('column', 'value')
```

**Greater Than:**
```typescript
.gt('column', value)
```

**Greater Than or Equal:**
```typescript
.gte('column', value)
```

**Less Than:**
```typescript
.lt('column', value)
```

**Less Than or Equal:**
```typescript
.lte('column', value)
```

**Pattern Matching:**
```typescript
.like('column', '%pattern%')
.ilike('column', '%pattern%') // case-insensitive
```

**In Array:**
```typescript
.in('column', [value1, value2, value3])
```

**Is Null:**
```typescript
.is('column', null)
```

### Ordering

```typescript
.order('column', { ascending: true })
.order('column', { ascending: false })
```

### Pagination

**Limit:**
```typescript
.limit(10)
```

**Range:**
```typescript
.range(0, 9) // First 10 items
.range(10, 19) // Next 10 items
```

### Counting

```typescript
const { count, error } = await supabase
  .from('messages')
  .select('*', { count: 'exact', head: true })
```

## Error Handling

### Error Response Format

```typescript
{
  error: {
    message: 'Error description',
    code: 'error_code',
    details: 'Additional details',
    hint: 'Suggestion for fixing the error'
  }
}
```

### Common Error Codes

- `PGRST116`: Table not found
- `PGRST204`: No rows returned
- `23505`: Unique constraint violation
- `23503`: Foreign key constraint violation
- `42501`: Insufficient privileges

### Error Handling Pattern

```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')

if (error) {
  console.error('Error fetching profiles:', error.message)
  // Handle error appropriately
  return
}

// Process data
console.log('Profiles:', data)
```

## Rate Limiting

- Anonymous requests: 60 requests per hour per IP
- Authenticated requests: 600 requests per hour per user
- Real-time connections: 100 concurrent connections per user

## Versioning

The API follows the database schema version. Breaking changes will be communicated through:

- Migration scripts in `supabase/migrations/`
- Changelog entries in `CHANGELOG_SEMANTIC.md`
- Release notes in GitHub releases

## Related Documentation

- [FRAMEWORK.md](./FRAMEWORK.md): Technical stack details
- [ENTITY_ACCESS_RULES.md](./ENTITY_ACCESS_RULES.md): Access control rules
- [SECURITY.md](./SECURITY.md): Security and authentication details
- [ARCHITECTURE.md](./ARCHITECTURE.md): System architecture overview
