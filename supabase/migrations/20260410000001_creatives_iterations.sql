-- Add iteration fields to creatives table
ALTER TABLE creatives ADD COLUMN IF NOT EXISTS strengths jsonb;
ALTER TABLE creatives ADD COLUMN IF NOT EXISTS weaknesses jsonb;
ALTER TABLE creatives ADD COLUMN IF NOT EXISTS iteration_recommendations jsonb;
ALTER TABLE creatives ADD COLUMN IF NOT EXISTS iteration_priority numeric DEFAULT 0;
