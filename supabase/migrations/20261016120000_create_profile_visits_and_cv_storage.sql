/*
# Profile visit tracking + replaceable CV storage

1. New Tables
- `profile_visits`
  - `id` (uuid, primary key)
  - `visitor_id` (text) — random id kept in the visitor's browser, used for unique-visitor counts
  - `referrer` (text)
  - `user_agent` (text)
  - `country` (text) — from the edge request headers when available
  - `created_at` (timestamptz, default now())

2. Storage
- Public `cv` bucket holding the currently published CV (`current.pdf`).

3. Security
- RLS enabled on `profile_visits` with no anon/authenticated policies.
- Visits are recorded and read only through the community-api edge function (service role).
- Admin credentials are NOT stored in this repo. Set them as edge function secrets
  (`ADMIN_USERNAME`, `ADMIN_PASSWORD`) or as rows in `app_config`.
*/

CREATE TABLE IF NOT EXISTS profile_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  referrer text,
  user_agent text,
  country text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profile_visits_created_at_idx ON profile_visits (created_at DESC);
CREATE INDEX IF NOT EXISTS profile_visits_visitor_id_idx ON profile_visits (visitor_id);

ALTER TABLE profile_visits ENABLE ROW LEVEL SECURITY;

-- Aggregated stats for the admin panel (called by the edge function with the service role)
CREATE OR REPLACE FUNCTION profile_visit_stats(tz text DEFAULT 'Asia/Dubai')
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'total', (SELECT count(*) FROM profile_visits),
    'unique', (SELECT count(DISTINCT visitor_id) FROM profile_visits),
    'today', (SELECT count(*) FROM profile_visits WHERE (created_at AT TIME ZONE tz)::date = (now() AT TIME ZONE tz)::date),
    'last7', (SELECT count(*) FROM profile_visits WHERE created_at >= now() - interval '7 days'),
    'last30', (SELECT count(*) FROM profile_visits WHERE created_at >= now() - interval '30 days'),
    'unique30', (SELECT count(DISTINCT visitor_id) FROM profile_visits WHERE created_at >= now() - interval '30 days'),
    'daily', (
      SELECT coalesce(jsonb_agg(jsonb_build_object('date', d::date, 'visits', coalesce(v.visits, 0)) ORDER BY d), '[]'::jsonb)
      FROM generate_series((now() AT TIME ZONE tz)::date - 29, (now() AT TIME ZONE tz)::date, interval '1 day') AS d
      LEFT JOIN (
        SELECT (created_at AT TIME ZONE tz)::date AS day, count(*) AS visits
        FROM profile_visits
        WHERE created_at >= now() - interval '31 days'
        GROUP BY 1
      ) v ON v.day = d::date
    ),
    'referrers', (
      SELECT coalesce(jsonb_agg(jsonb_build_object('source', source, 'visits', visits) ORDER BY visits DESC), '[]'::jsonb)
      FROM (
        SELECT coalesce(nullif(referrer, ''), 'Direct') AS source, count(*) AS visits
        FROM profile_visits GROUP BY 1 ORDER BY 2 DESC LIMIT 8
      ) r
    ),
    'countries', (
      SELECT coalesce(jsonb_agg(jsonb_build_object('country', country, 'visits', visits) ORDER BY visits DESC), '[]'::jsonb)
      FROM (
        SELECT coalesce(nullif(country, ''), 'Unknown') AS country, count(*) AS visits
        FROM profile_visits GROUP BY 1 ORDER BY 2 DESC LIMIT 8
      ) c
    ),
    'recent', (
      SELECT coalesce(jsonb_agg(jsonb_build_object('at', created_at, 'referrer', referrer, 'country', country, 'device', device) ORDER BY created_at DESC), '[]'::jsonb)
      FROM (
        SELECT created_at, coalesce(nullif(referrer, ''), 'Direct') AS referrer, coalesce(nullif(country, ''), 'Unknown') AS country,
          CASE WHEN user_agent ~* '(mobile|android|iphone)' THEN 'Mobile' WHEN user_agent ~* '(ipad|tablet)' THEN 'Tablet' ELSE 'Desktop' END AS device
        FROM profile_visits ORDER BY created_at DESC LIMIT 20
      ) rv
    )
  );
$$;

REVOKE ALL ON FUNCTION profile_visit_stats(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION profile_visit_stats(text) TO service_role;

INSERT INTO storage.buckets (id, name, public)
VALUES ('cv', 'cv', true)
ON CONFLICT (id) DO NOTHING;
