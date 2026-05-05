-- ============================================================================
-- THE BRIDGE — Agent Bus Schema
--
-- Message bus for inter-agent communication. Run this against any Postgres
-- database (Supabase, Neon, local). Agents read and write to this table
-- to coordinate work, hand off context, and maintain an audit trail.
--
-- Usage:
--   psql -f harness/bus-schema.sql
--   — or —
--   Paste into Supabase SQL Editor
-- ============================================================================

-- Enable UUID generation if not already available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- HANDOFF TABLE — the message bus
-- ============================================================================

CREATE TABLE IF NOT EXISTS handoff (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Routing
  from_agent      TEXT NOT NULL,          -- Entity ID of sender (e.g. "cowork.ops.scheduler")
  to_agent        TEXT NOT NULL,          -- Entity ID of recipient
  topic           TEXT NOT NULL,          -- Kebab-case subject (e.g. "deploy-status-check")

  -- Content
  body            TEXT NOT NULL,          -- Full message content (self-contained)

  -- Metadata (structured fields for querying and governance)
  metadata        JSONB DEFAULT '{}'::jsonb,

  -- Lifecycle
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN (
                    'pending',
                    'acknowledged',
                    'in_progress',
                    'resolved',
                    'blocked',
                    'superseded'
                  )),

  -- Timestamps
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  acknowledged_at TIMESTAMPTZ,

  -- Response
  response        TEXT
);

-- ============================================================================
-- INDEXES — fast polling by recipient and status
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_handoff_to_status
  ON handoff (to_agent, status);

CREATE INDEX IF NOT EXISTS idx_handoff_created
  ON handoff (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_handoff_priority
  ON handoff ((metadata->>'priority'));

-- ============================================================================
-- METADATA JSONB STRUCTURE (reference — not enforced by schema)
-- ============================================================================
--
-- {
--   "message_type": "ACT | OBS | DEC | FLAG | HANDOFF | QUERY",
--   "priority":     "critical | high | normal | low",
--   "category":     "bus_message | design_brief | session_handover | status_report",
--   "source_entity": "full.entity.id",
--   "objective_ref": "objective-id",
--   "why":          "So that [outcome].",
--   "stakeholders": [
--     { "entity": "entity.id", "role": "E", "status": "active" }
--   ],
--   "refs":         ["commit-sha", "file-path", "url"]
-- }
--
-- Role codes (RAINED):
--   R = Responsible (does the work)
--   A = Approver (signs off)
--   I = Informed (kept in the loop)
--   N = Needed (consulted before decision)
--   E = Executor (carries out the action)
--   D = Decider (makes the call)
-- ============================================================================

-- ============================================================================
-- ROW-LEVEL SECURITY (optional — enable if using Supabase auth)
-- ============================================================================

-- ALTER TABLE handoff ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Agents can read messages addressed to them"
--   ON handoff FOR SELECT
--   USING (true);  -- Adjust to match your auth model
--
-- CREATE POLICY "Agents can insert messages"
--   ON handoff FOR INSERT
--   WITH CHECK (true);  -- Adjust to match your auth model
--
-- CREATE POLICY "Agents can update their own messages"
--   ON handoff FOR UPDATE
--   USING (true);  -- Adjust to match your auth model

-- ============================================================================
-- HELPER VIEWS
-- ============================================================================

-- Pending messages by priority (useful for agent polling)
CREATE OR REPLACE VIEW bus_pending AS
  SELECT
    id,
    from_agent,
    to_agent,
    topic,
    metadata->>'priority' AS priority,
    metadata->>'message_type' AS message_type,
    status,
    created_at,
    EXTRACT(EPOCH FROM (now() - created_at)) / 3600 AS age_hours
  FROM handoff
  WHERE status = 'pending'
  ORDER BY
    CASE metadata->>'priority'
      WHEN 'critical' THEN 0
      WHEN 'high' THEN 1
      WHEN 'normal' THEN 2
      WHEN 'low' THEN 3
      ELSE 4
    END,
    created_at ASC;

-- Bus health summary
CREATE OR REPLACE VIEW bus_health AS
  SELECT
    COUNT(*) FILTER (WHERE status = 'pending') AS pending,
    COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress,
    COUNT(*) FILTER (WHERE status = 'resolved') AS resolved,
    COUNT(*) FILTER (WHERE status = 'blocked') AS blocked,
    COUNT(*) FILTER (WHERE status = 'pending'
      AND EXTRACT(EPOCH FROM (now() - created_at)) / 3600 > 24) AS stale_24h,
    COUNT(*) FILTER (WHERE status = 'pending'
      AND EXTRACT(EPOCH FROM (now() - created_at)) / 3600 > 72) AS stale_72h,
    COUNT(*) AS total
  FROM handoff;
