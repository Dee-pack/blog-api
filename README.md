# Blog API

A blog built as an API-only backend with two separate front-ends: a public site for reading and commenting, and an admin site for the author to write, edit and publish posts.

## Live demo

- [Reader site:](https://client-side-qk8f.onrender.com)
- [Admin site:](https://admin-2uhf.onrender.com)
- [API:](https://blog-api-00xb.onrender.com)

## Structure

| Folder    | What it is                                                             |
| --------- | ---------------------------------------------------------------------- |
| `api/`    | Express + Prisma + PostgreSQL REST API with JWT authentication         |
| `client/` | React reader site (read posts, register/login, comment)                |
| `admin/`  | React author site (manage posts, publish/unpublish, moderate comments) |

## Features

- JWT authentication sent in an `Authorization: Bearer` header
- Two roles: `AUTHOR` (can manage everything) and `USER` (can comment)
- Draft and published posts; drafts are only visible to the author
- Comments tied to logged-in users; the author can edit and delete any comment
- Input validation with express-validator, passwords hashed with bcrypt

## API endpoints

| Method | Route                         | Access                                              |
| ------ | ----------------------------- | --------------------------------------------------- |
| POST   | `/auth/register`              | public                                              |
| POST   | `/auth/login`                 | public                                              |
| GET    | `/posts`                      | public (published only); author can add `?all=true` |
| GET    | `/posts/:id`                  | public if published                                 |
| POST   | `/posts`                      | author                                              |
| PUT    | `/posts/:id`                  | author                                              |
| PATCH  | `/posts/:id/publish`          | author                                              |
| DELETE | `/posts/:id`                  | author                                              |
| GET    | `/posts/:postId/comments`     | public                                              |
| POST   | `/posts/:postId/comments`     | logged in                                           |
| PUT    | `/posts/:postId/comments/:id` | author                                              |
| DELETE | `/posts/:postId/comments/:id` | author                                              |

## Running locally

Requirements: Node.js and a local PostgreSQL database.

```bash
git clone https://github.com/Dee-pack/blog-api.git
# API
cd api
cp .env.example .env        # then fill in DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev
node scripts/createAuthor.js <username> <password>
npm run dev

# Reader site
cd client
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173

# Admin site
cd admin
cp .env.example .env
npm install
npm run dev                 # http://localhost:5174
```

## Tech stack

Node.js, Express, Prisma 7, PostgreSQL, JSON Web Tokens, bcrypt, React, Vite, React Router
