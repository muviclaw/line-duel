# Line Duel

A turn-based asynchronous multiplayer mobile game where two players draw lines on a shared board to capture territory.

## Overview

Line Duel is a strategic territory-capturing game where players alternate drawing line segments on a 20x20 grid. When a line closes a polygon, the enclosed territory is captured and scores points. The game runs asynchronously with push notifications, allowing players to take turns at their own pace.

## Features

- **Async Multiplayer**: Play with friends or random opponents on your own schedule
- **Territory Capture**: Close polygons to claim territory and score points
- **Push Notifications**: Get notified when it's your turn
- **Premium Subscription**: Unlimited concurrent games and cosmetic features
- **Real-time Updates**: See opponent moves instantly via Supabase realtime

## Tech Stack

- **Frontend**: React Native with Expo (TypeScript)
- **Canvas**: @shopify/react-native-skia for smooth rendering
- **State Management**: Zustand
- **Networking**: React Query (@tanstack/react-query)
- **Backend**: Supabase (PostgreSQL + Realtime)
- **Push Notifications**: expo-notifications
- **Monetization**: RevenueCat (react-native-purchases)

## Project Structure

```
line-duel/
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/          # Main app screens
│   ├── services/         # API and external service integrations
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── config/           # App configuration
├── supabase/
│   └── migrations/       # Database migration files
└── App.tsx               # Root component
```

## Game Rules

- **Board**: 20x20 grid
- **Turns**: 40 total turns (20 per player)
- **Gameplay**:
  1. Players alternate drawing line segments
  2. Lines snap to grid points
  3. Closing a polygon captures the enclosed territory
  4. Territory = points
- **Victory**: Player with the most territory after 40 turns wins

## Data Model

### Users
- `id`: UUID (primary key)
- `created_at`: Timestamp

### Games
- `id`: UUID (primary key)
- `player1_id`: UUID (foreign key → users)
- `player2_id`: UUID (foreign key → users, nullable)
- `turn_player`: UUID (foreign key → users)
- `status`: 'waiting' | 'active' | 'finished'
- `player1_score`: Integer
- `player2_score`: Integer
- `turn_count`: Integer
- `created_at`: Timestamp

### Moves
- `id`: UUID (primary key)
- `game_id`: UUID (foreign key → games)
- `player_id`: UUID (foreign key → users)
- `start_x`, `start_y`: Integer (0-19)
- `end_x`, `end_y`: Integer (0-19)
- `created_at`: Timestamp

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account
- RevenueCat account (for monetization)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/muviclaw/line-duel.git
   cd line-duel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `EXPO_PUBLIC_REVENUECAT_API_KEY`

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration in `supabase/migrations/001_initial_schema.sql`
   - Enable Realtime for the `moves` table
   - Copy your project URL and anon key to `.env`

5. **Set up RevenueCat**
   - Create a RevenueCat project
   - Configure your subscription product
   - Copy your API key to `.env`

### Running the App

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

## Development Milestones

- [x] Project setup with Expo and TypeScript
- [x] Database schema and types
- [x] State management with Zustand
- [ ] Skia canvas board rendering
- [ ] Drawing system for grid-snapped lines
- [ ] Territory detection algorithm
- [ ] Supabase multiplayer integration
- [ ] Async turn logic
- [ ] Push notifications
- [ ] RevenueCat subscription integration
- [ ] UI polish and animations

## Monetization

- **Free Tier**: 3 concurrent games
- **Premium**: $2.99/month
  - Unlimited games
  - Cosmetic customization
  - Replay animations

## Analytics Events

- `game_created`
- `move_played`
- `game_finished`
- `paywall_shown`
- `subscription_started`

## License

MIT

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## Contact

For questions or support, please open an issue on GitHub.
