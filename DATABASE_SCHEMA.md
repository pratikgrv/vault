# Database Schema Documentation

## Overview

This document describes the database schema for the user profile system. The schema is designed to be **simple, flexible, and future-proof**.

---

## Schema Design Principles

✅ **Unified Tables** - Single `Link` table for both social and regular links  
✅ **Flexible Content** - JSON field for category-specific metadata  
✅ **No Theme Complexity** - Removed theme table for simplicity  
✅ **Future-Proof** - Easy to add new categories (movies, games, books) without schema changes

---

## Models

### 1. Profile

**Purpose:** Core user profile information

| Field       | Type       | Description                      |
| ----------- | ---------- | -------------------------------- |
| `id`        | String     | Primary key (CUID)               |
| `userId`    | String     | Foreign key to User (unique)     |
| `bio`       | String?    | User biography/description       |
| `links`     | Link[]     | Related links (social + regular) |
| `interests` | Interest[] | User interests/rankings          |
| `createdAt` | DateTime   | Creation timestamp               |
| `updatedAt` | DateTime   | Last update timestamp            |

**Indexes:** `userId`

---

### 2. Link

**Purpose:** Unified table for both social links AND regular links

| Field       | Type     | Description                                |
| ----------- | -------- | ------------------------------------------ |
| `id`        | String   | Primary key (CUID)                         |
| `profileId` | String   | Foreign key to Profile                     |
| `title`     | String   | Display title                              |
| `url`       | String   | Link URL                                   |
| `type`      | String   | `"social"` or `"link"`                     |
| `platform`  | String?  | For socials: `"github"`, `"twitter"`, etc. |
| `icon`      | String?  | Icon name (e.g., `"Github"`, `"Globe"`)    |
| `order`     | Int      | Display order (default: 0)                 |
| `createdAt` | DateTime | Creation timestamp                         |
| `updatedAt` | DateTime | Last update timestamp                      |

**Indexes:** `profileId`, `type`

#### Example Data

**Social Link:**

```json
{
	"type": "social",
	"platform": "github",
	"title": "GitHub",
	"url": "https://github.com/username",
	"icon": "Github",
	"order": 1
}
```

**Regular Link:**

```json
{
	"type": "link",
	"title": "My Portfolio",
	"url": "https://mysite.com",
	"icon": "Globe",
	"order": 2
}
```

---

### 3. Interest

**Purpose:** Flexible table for user interests (anime, movies, games, books, etc.)

| Field       | Type     | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| `id`        | String   | Primary key (CUID)                             |
| `profileId` | String   | Foreign key to Profile                         |
| `title`     | String   | Interest title                                 |
| `imageUrl`  | String   | Cover/poster image URL                         |
| `category`  | String   | `"anime"`, `"movie"`, `"game"`, `"book"`, etc. |
| `content`   | Json?    | Flexible metadata (see examples below)         |
| `order`     | Int      | Ranking position (default: 0)                  |
| `createdAt` | DateTime | Creation timestamp                             |
| `updatedAt` | DateTime | Last update timestamp                          |

**Indexes:** `profileId`, `category`

#### Content Field Examples

**Anime:**

```json
{
	"score": 9.5,
	"type": "TV",
	"malId": "16498",
	"episodes": 25,
	"status": "Finished Airing",
	"year": 2013
}
```

**Movie:**

```json
{
	"score": 8.8,
	"year": 2010,
	"genre": "Sci-Fi",
	"tmdbId": "27205",
	"director": "Christopher Nolan",
	"runtime": 148
}
```

**Game:**

```json
{
	"score": 9.0,
	"platform": "PlayStation 5",
	"igdbId": "1942",
	"releaseYear": 2018,
	"genre": "Action-Adventure",
	"developer": "Santa Monica Studio"
}
```

**Book:**

```json
{
	"score": 4.5,
	"author": "J.R.R. Tolkien",
	"isbn": "9780544003415",
	"year": 1954,
	"pages": 1178,
	"genre": "Fantasy"
}
```

---

## Benefits of This Design

### 1. **Simplicity**

- Only 3 models (Profile, Link, Interest)
- Easy to understand and maintain
- No complex joins or nested relations

### 2. **Flexibility**

- `content` JSON field adapts to any category
- Add new categories without schema changes
- Store category-specific metadata freely

### 3. **Unified Links**

- Single table for social + regular links
- Easier queries and management
- Consistent ordering across all links

### 4. **Scalability**

- Proper indexing for fast queries
- Can add new fields easily
- Ready for future features (analytics, verification, etc.)

---

## Query Examples

### Get User Profile with All Data

```typescript
const profile = await prisma.profile.findUnique({
	where: { userId: "user123" },
	include: {
		links: {
			orderBy: { order: "asc" },
		},
		interests: {
			orderBy: { order: "asc" },
		},
	},
});
```

### Get Only Social Links

```typescript
const socials = await prisma.link.findMany({
	where: {
		profileId: "profile123",
		type: "social",
	},
	orderBy: { order: "asc" },
});
```

### Get Interests by Category

```typescript
const animeList = await prisma.interest.findMany({
	where: {
		profileId: "profile123",
		category: "anime",
	},
	orderBy: { order: "asc" },
});
```

---

## Migration Notes

When migrating from the old schema:

1. **Profile:**

   - Remove `theme`, `links`, `socials` JSON fields
   - Data will be migrated to new tables

2. **Links Migration:**

   - Parse old `links` JSON array → create `Link` records with `type: "link"`
   - Parse old `socials` JSON object → create `Link` records with `type: "social"`

3. **Interests Migration:**
   - Parse old `Ranking.content` JSON → create `Interest` records
   - Move individual fields into `content` JSON

---

## Future Enhancements

Possible additions without breaking changes:

- **Link Analytics:** Add `clicks` field to track engagement
- **Featured Items:** Add `featured` boolean to highlight specific interests
- **Privacy:** Add `visibility` field (`"public"`, `"private"`, `"friends"`)
- **Tags:** Add `tags` JSON array for filtering
- **Verification:** Add `verified` boolean for verified social accounts
- **Custom Themes:** Re-add theme support if needed (as JSON in Profile)

---

## TypeScript Types

```typescript
// Profile Data
interface ProfileData {
	name: string;
	username: string;
	bio: string;
	image?: string;
	links: LinkData[];
	interests: InterestData[];
}

// Link Data
interface LinkData {
	id: string;
	title: string;
	url: string;
	type: "social" | "link";
	platform?: string;
	icon?: string;
	order: number;
}

// Interest Data
interface InterestData {
	id: string;
	title: string;
	imageUrl: string;
	category: "anime" | "movie" | "game" | "book" | string;
	content: Record<string, any>; // Flexible metadata
	order: number;
}

// Category-specific content types
interface AnimeContent {
	score?: number;
	type?: string;
	malId?: string;
	episodes?: number;
	status?: string;
	year?: number;
}

interface MovieContent {
	score?: number;
	year?: number;
	genre?: string;
	tmdbId?: string;
	director?: string;
	runtime?: number;
}

interface GameContent {
	score?: number;
	platform?: string;
	igdbId?: string;
	releaseYear?: number;
	genre?: string;
	developer?: string;
}
```

---

## Summary

This schema provides a **clean, flexible foundation** for your profile system:

✅ Simple 3-table design  
✅ Unified link management  
✅ Flexible interest system  
✅ Easy to extend  
✅ No unnecessary complexity

You can now add movies, games, books, or any other category without touching the database schema!
