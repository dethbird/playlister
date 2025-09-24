-- Add refresh token and expiry columns to user table
ALTER TABLE "user" ADD COLUMN spotify_refresh_token VARCHAR(255);
ALTER TABLE "user" ADD COLUMN spotify_token_expires_at TIMESTAMP WITH TIME ZONE;

-- Create sessions table for connect-pg-simple
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");