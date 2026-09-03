CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL,
  content_id TEXT,
  type TEXT,
  source TEXT,
  path TEXT,
  position INTEGER,
  result_count INTEGER,
  has_results INTEGER,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_event ON events (event);
CREATE INDEX IF NOT EXISTS idx_events_content_id ON events (content_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at);
