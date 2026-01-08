# Entity Access Rules (RBAC)

## Overview

This document provides a detailed explanation of role-based access control (RBAC) rules for each database entity in the Pixel Perfect Clone platform. All access control is implemented using PostgreSQL Row Level Security (RLS) policies.

## Role Definitions

### User Roles

The platform currently operates with the following role model:

**Authenticated User**
- Any user who has successfully logged in
- Has a valid JWT token
- Associated with a profile in the database

**Anonymous User**
- Not logged in
- No authentication token
- Limited read-only access

**Profile Owner**
- An authenticated user accessing their own data
- Special permissions for self-modification

## Entity: Profiles

### Table Schema

```sql
create table public.profiles (
  id uuid not null primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  department text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);
```

### RLS Policies

#### Policy: "Public profiles are viewable by everyone"

**Operation:** SELECT  
**Applies to:** All users (authenticated and anonymous)  
**Rule:** `true`

**SQL:**
```sql
create policy "Public profiles are viewable by everyone"
on public.profiles for select
using (true);
```

**Description:**
All user profiles are publicly viewable. This allows anyone to see user information for recognition and messaging features. This is suitable for internal team platforms where all team members should be discoverable.

**Use Cases:**
- Viewing team member directory
- Displaying sender information in messages
- Showing giver/receiver in recognitions

**Security Considerations:**
- No sensitive personal information should be stored in profiles
- Profile data is considered semi-public within the organization
- Consider adding a privacy setting in future iterations

#### Policy: "Users can update own profile"

**Operation:** UPDATE  
**Applies to:** Authenticated users  
**Rule:** `auth.uid() = id`

**SQL:**
```sql
create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id);
```

**Description:**
Users can only update their own profile. The policy checks that the authenticated user's ID matches the profile ID being updated.

**Use Cases:**
- User updating their name
- User changing their avatar
- User updating their department

**Prevents:**
- Users modifying other users' profiles
- Unauthorized profile changes
- Profile impersonation

#### Policy: "Users can insert own profile"

**Operation:** INSERT  
**Applies to:** Authenticated users  
**Rule:** `auth.uid() = id`

**SQL:**
```sql
create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);
```

**Description:**
Users can only create a profile for themselves. This policy uses `with check` to validate the data being inserted matches the authenticated user's ID.

**Use Cases:**
- Profile creation during user registration
- Automatic profile creation via database trigger

**Prevents:**
- Users creating profiles for other users
- Profile ID spoofing
- Unauthorized account creation

### Summary Table: Profiles Access

| Operation | Anonymous | Authenticated | Owner | Other User |
|-----------|-----------|---------------|-------|------------|
| SELECT    | ✅ All    | ✅ All        | ✅ Own | ✅ All     |
| INSERT    | ❌        | ✅ Own only   | ✅ Own | ❌         |
| UPDATE    | ❌        | ✅ Own only   | ✅ Own | ❌         |
| DELETE    | ❌        | ❌            | ❌*    | ❌         |

*Profile deletion is handled by cascade when auth.users record is deleted

## Entity: Messages

### Table Schema

```sql
create table public.messages (
  id uuid not null default gen_random_uuid() primary key,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone not null default now()
);
```

### RLS Policies

#### Policy: "Authenticated users can view messages"

**Operation:** SELECT  
**Applies to:** Authenticated users  
**Rule:** `true` (for authenticated users)

**SQL:**
```sql
create policy "Authenticated users can view messages"
on public.messages for select
to authenticated
using (true);
```

**Description:**
All authenticated users can view all messages. This implements a public chat/feed where all team members can see all communications.

**Use Cases:**
- Viewing team message feed
- Displaying message history
- Real-time message updates

**Security Considerations:**
- Messages are visible to all authenticated team members
- No private messaging in current implementation
- Consider adding channels/rooms for segmented conversations

#### Policy: "Users can insert their own messages"

**Operation:** INSERT  
**Applies to:** Authenticated users  
**Rule:** `auth.uid() = sender_id`

**SQL:**
```sql
create policy "Users can insert their own messages"
on public.messages for insert
to authenticated
with check (auth.uid() = sender_id);
```

**Description:**
Users can only send messages as themselves. The policy verifies that the sender_id matches the authenticated user's ID.

**Use Cases:**
- Sending messages to the team
- Posting updates or announcements

**Prevents:**
- Users sending messages as other users
- Message spoofing
- Impersonation attacks

### Summary Table: Messages Access

| Operation | Anonymous | Authenticated | Owner | Other User |
|-----------|-----------|---------------|-------|------------|
| SELECT    | ❌        | ✅ All        | ✅ All | ✅ All     |
| INSERT    | ❌        | ✅ Own only   | ✅ Own | ❌         |
| UPDATE    | ❌        | ❌            | ❌     | ❌         |
| DELETE    | ❌        | ❌            | ❌     | ❌         |

**Note:** Messages are immutable after creation. No update or delete operations are allowed via RLS policies.

## Entity: Recognitions

### Table Schema

```sql
create table public.recognitions (
  id uuid not null default gen_random_uuid() primary key,
  giver_id uuid not null references public.profiles(id) on delete cascade,
  receiver_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  badge_type text not null default 'star',
  created_at timestamp with time zone not null default now()
);
```

### RLS Policies

#### Policy: "Authenticated users can view recognitions"

**Operation:** SELECT  
**Applies to:** Authenticated users  
**Rule:** `true` (for authenticated users)

**SQL:**
```sql
create policy "Authenticated users can view recognitions"
on public.recognitions for select
to authenticated
using (true);
```

**Description:**
All authenticated users can view all recognitions. This supports a culture of public appreciation where everyone can see who is being recognized and why.

**Use Cases:**
- Viewing recognition feed
- Displaying user's received recognitions
- Showing recognition statistics

**Security Considerations:**
- All recognitions are public within the organization
- Promotes transparency and positive culture
- Consider privacy settings for sensitive recognitions

#### Policy: "Users can give recognitions"

**Operation:** INSERT  
**Applies to:** Authenticated users  
**Rule:** `auth.uid() = giver_id`

**SQL:**
```sql
create policy "Users can give recognitions"
on public.recognitions for insert
to authenticated
with check (auth.uid() = giver_id);
```

**Description:**
Users can only give recognitions as themselves. The policy ensures the giver_id matches the authenticated user's ID.

**Use Cases:**
- Giving recognition to a colleague
- Awarding badges for great work
- Appreciating team contributions

**Prevents:**
- Users giving recognitions as others
- Fake recognition attribution
- Recognition fraud

**Business Rules:**
- Users can recognize any other team member
- Users can give multiple recognitions to the same person
- No validation preventing self-recognition at RLS level (should be handled in application logic)

### Summary Table: Recognitions Access

| Operation | Anonymous | Authenticated | Giver | Other User |
|-----------|-----------|---------------|-------|------------|
| SELECT    | ❌        | ✅ All        | ✅ All | ✅ All     |
| INSERT    | ❌        | ✅ Own only   | ✅ Own | ❌         |
| UPDATE    | ❌        | ❌            | ❌     | ❌         |
| DELETE    | ❌        | ❌            | ❌     | ❌         |

**Note:** Recognitions are immutable after creation. No update or delete operations are allowed.

## Access Control Patterns

### Pattern: Public Read, Owner Write

**Entities:** Profiles  
**Description:** All users can read, but only the owner can modify

**Use When:**
- User profile information
- User preferences and settings
- Personal dashboards

### Pattern: Authenticated Read, Owner Write

**Entities:** Messages, Recognitions  
**Description:** Only authenticated users can read, only creator can write

**Use When:**
- Team communications
- Social features
- Collaborative content

### Pattern: Immutable Records

**Entities:** Messages, Recognitions  
**Description:** Records can be created but not modified or deleted

**Use When:**
- Audit trails
- Historical records
- Compliance requirements

## Security Best Practices

### JWT Token Validation

All RLS policies implicitly rely on JWT token validation:
1. Token must be valid and not expired
2. Token signature must be verified
3. User ID is extracted from `auth.uid()`

### Defense in Depth

Multiple security layers:
1. **Transport Layer:** HTTPS/TLS encryption
2. **Authentication:** JWT token validation
3. **Authorization:** RLS policies
4. **Application:** Client-side validation
5. **Database:** Foreign key constraints and triggers

### Least Privilege Principle

- Users have minimum necessary permissions
- Anonymous users have very limited access
- Operations are restricted to necessary functions
- Write operations more restricted than read

## Testing Access Rules

### Manual Testing Queries

**Test Profile Access:**
```sql
-- As authenticated user, try to update another user's profile
UPDATE profiles SET full_name = 'Hacked' WHERE id != auth.uid();
-- Should fail with: new row violates row-level security policy
```

**Test Message Creation:**
```sql
-- As authenticated user, try to send message as another user
INSERT INTO messages (sender_id, content) 
VALUES ('other-user-uuid', 'Fake message');
-- Should fail with: new row violates row-level security policy
```

**Test Recognition Giving:**
```sql
-- As authenticated user, try to give recognition as another user
INSERT INTO recognitions (giver_id, receiver_id, message, badge_type)
VALUES ('other-user-uuid', 'some-user-uuid', 'Fake recognition', 'star');
-- Should fail with: new row violates row-level security policy
```

### Automated Testing

Integration tests should verify:
- Authenticated users can read appropriate data
- Anonymous users are properly restricted
- Users cannot write with spoofed IDs
- Cascading deletes work correctly
- Foreign key constraints are enforced

## Future Enhancements

### Planned RBAC Improvements

**Admin Role**
- Ability to moderate messages
- User management capabilities
- System configuration access

**Department-based Access**
- Restrict visibility by department
- Department-specific channels
- Hierarchical permissions

**Private Messaging**
- Direct messages between users
- Private recognition options
- Selective visibility

**Enhanced Permissions**
- Message editing by author
- Recognition retraction
- Soft delete functionality

## Related Documentation

- [SECURITY.md](./SECURITY.md): Overall security architecture
- [API_REFERENCE.md](./API_REFERENCE.md): API endpoint documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md): System architecture overview
- [FRAMEWORK.md](./FRAMEWORK.md): Technology stack details
