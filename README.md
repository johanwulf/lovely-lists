# lovely-lists

Full-stack web application which allows users to create lists, order them by drag and dropping, and adding items to lists.

## Installation

### Repository set up

```bash
git clone https://github.com/johanwulf/lovely-lists
cd lovely-lists
npm install
npm run dev
```

### Database set up

1. Create a .env file which has the following content

```
DATABASE_URL="postgresql://<DATBASE_NAME>:<DATABASE_PASSWORD>@localhost:5432/postgres?schema=public"
```

2. Initialise database schema

```
npx prisma migrate dev --name init
```

## Features

-   Create, order, and rename lists.
-   Add, order and rename items to lists.

## Technologies

-   Next.js
-   Prisma
-   PostgreSQL
-   TailwindCSS
