-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player1_id UUID NOT NULL REFERENCES users(id),
  player2_id UUID REFERENCES users(id),
  turn_player UUID NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
  player1_score INTEGER NOT NULL DEFAULT 0,
  player2_score INTEGER NOT NULL DEFAULT 0,
  turn_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moves table
CREATE TABLE moves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES users(id),
  start_x INTEGER NOT NULL CHECK (start_x >= 0 AND start_x < 20),
  start_y INTEGER NOT NULL CHECK (start_y >= 0 AND start_y < 20),
  end_x INTEGER NOT NULL CHECK (end_x >= 0 AND end_x < 20),
  end_y INTEGER NOT NULL CHECK (end_y >= 0 AND end_y < 20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_games_player1 ON games(player1_id);
CREATE INDEX idx_games_player2 ON games(player2_id);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_moves_game_id ON moves(game_id);
CREATE INDEX idx_moves_created_at ON moves(created_at);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE moves ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for games
CREATE POLICY "Players can view their games" ON games
  FOR SELECT USING (
    auth.uid() = player1_id OR
    auth.uid() = player2_id OR
    status = 'waiting'
  );

CREATE POLICY "Players can create games" ON games
  FOR INSERT WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "Players can update their games" ON games
  FOR UPDATE USING (
    auth.uid() = player1_id OR
    auth.uid() = player2_id
  );

-- RLS Policies for moves
CREATE POLICY "Players can view moves in their games" ON moves
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = moves.game_id
      AND (games.player1_id = auth.uid() OR games.player2_id = auth.uid())
    )
  );

CREATE POLICY "Players can insert moves in their games" ON moves
  FOR INSERT WITH CHECK (
    auth.uid() = player_id AND
    EXISTS (
      SELECT 1 FROM games
      WHERE games.id = game_id
      AND (games.player1_id = auth.uid() OR games.player2_id = auth.uid())
      AND games.turn_player = auth.uid()
      AND games.status = 'active'
    )
  );
