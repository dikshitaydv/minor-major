# Database Setup

## Database

PostgreSQL 18

## Development Database

apla_dev

## Host

localhost

## Port

5432

## User

postgres

## Connection

The backend connects to PostgreSQL using the `DATABASE_URL`
environment variable.

Example:

DATABASE_URL=postgresql://postgres:<password>@localhost:5432/apla_dev

## Important

The actual database password is stored only in the local `.env` file.

The `.env` file must never be committed to Git.

The complete database schema will be created in a later phase.