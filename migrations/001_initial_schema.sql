-- Create enums
CREATE TYPE challenge_status AS ENUM ('draft', 'active', 'ended', 'archived');
CREATE TYPE bet_status AS ENUM ('open', 'closed', 'hidden');
CREATE TYPE sportsbook AS ENUM ('prizepicks', 'underdog', 'draftkings', 'fanduel', 'betmgm', 'other');
CREATE TYPE league AS ENUM ('nfl', 'nba', 'nhl', 'mlb', 'ncaaf', 'ncaab', 'soccer', 'tennis', 'golf', 'other');
CREATE TYPE tie_handling AS ENUM ('split', 'tiebreaker');

-- Create users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    whop_user_id TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create challenges table
CREATE TABLE challenges (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    total_prize_pool DECIMAL(10,2) NOT NULL,
    first_place_percentage INTEGER NOT NULL DEFAULT 70,
    second_place_percentage INTEGER NOT NULL DEFAULT 20,
    third_place_percentage INTEGER NOT NULL DEFAULT 10,
    status challenge_status NOT NULL DEFAULT 'draft',
    tie_handling tie_handling NOT NULL DEFAULT 'split',
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create bets table
CREATE TABLE bets (
    id TEXT PRIMARY KEY,
    challenge_id TEXT NOT NULL REFERENCES challenges(id),
    title TEXT NOT NULL,
    caption TEXT,
    tail_link TEXT NOT NULL,
    image_url TEXT,
    sportsbook sportsbook NOT NULL,
    league league NOT NULL,
    tail_window_minutes INTEGER NOT NULL,
    tail_window_ends_at TIMESTAMP NOT NULL,
    status bet_status NOT NULL DEFAULT 'open',
    posted_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create tails table
CREATE TABLE tails (
    id TEXT PRIMARY KEY,
    bet_id TEXT NOT NULL REFERENCES bets(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    clicked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    points_awarded INTEGER NOT NULL DEFAULT 0,
    is_valid BOOLEAN NOT NULL DEFAULT FALSE,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create user_challenges table
CREATE TABLE user_challenges (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    challenge_id TEXT NOT NULL REFERENCES challenges(id),
    total_points INTEGER NOT NULL DEFAULT 0,
    rank INTEGER,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_tail_at TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create analytics_cache table
CREATE TABLE analytics_cache (
    id TEXT PRIMARY KEY,
    challenge_id TEXT REFERENCES challenges(id),
    metric TEXT NOT NULL,
    time_range TEXT NOT NULL,
    value DECIMAL(15,2) NOT NULL,
    calculated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_challenges_challenge_id ON user_challenges(challenge_id);
CREATE INDEX idx_tails_bet_id ON tails(bet_id);
CREATE INDEX idx_tails_user_id ON tails(user_id);
CREATE INDEX idx_bets_challenge_id ON bets(challenge_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Create unique constraint for user-challenge pairs
CREATE UNIQUE INDEX idx_user_challenges_unique ON user_challenges(user_id, challenge_id);

-- Create unique constraint for user-bet pairs (one tail per user per bet)
CREATE UNIQUE INDEX idx_tails_unique ON tails(user_id, bet_id);

