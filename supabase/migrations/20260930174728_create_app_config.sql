/*
# Create app_config table for storing API keys and settings

1. New Tables
- `app_config`
  - `key` (text, primary key)
  - `value` (text, not null)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `app_config`.
- No anon/authenticated access — only the service role (used in edge functions) can read/write.
- This table stores API keys and other sensitive configuration.

3. Notes
- The edge function uses the service role key to read from this table, bypassing RLS.
- No SELECT/INSERT/UPDATE/DELETE policies for anon or authenticated roles.
*/

CREATE TABLE IF NOT EXISTS app_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
