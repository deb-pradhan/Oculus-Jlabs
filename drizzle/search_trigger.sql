-- Full-text search trigger for posts table
-- Run manually or via sync-posts.ts on startup

CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN (tags);

CREATE OR REPLACE FUNCTION posts_search_trigger() RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('english', array_to_string(COALESCE(NEW.tags, '{}'), ' ')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_posts_search ON posts;

CREATE TRIGGER trg_posts_search
    BEFORE INSERT OR UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION posts_search_trigger();
