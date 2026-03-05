# Line Duel Development Roadmap

## Current Status: Initial Setup Complete ✅

The repository has been created with the foundational structure in place.

## Completed

- ✅ GitHub repository created
- ✅ Expo React Native project with TypeScript
- ✅ Core dependencies installed (Skia, Zustand, React Query, Supabase, RevenueCat)
- ✅ Project folder structure
- ✅ TypeScript types and interfaces
- ✅ Supabase database schema with migrations
- ✅ State management stores (Zustand)
- ✅ Utility functions for territory detection (placeholders)
- ✅ Environment configuration

## Next Steps (Priority Order)

### Phase 1: Core Rendering (Next)
1. **Create GameBoard Component with Skia**
   - Render 20x20 grid
   - Draw grid lines
   - Handle touch events for line drawing
   - Snap lines to grid points

2. **Implement Drawing System**
   - Track touch start/end positions
   - Draw line segments in real-time
   - Visual feedback during drawing
   - Validate line placement (must connect to existing points)

### Phase 2: Game Logic
3. **Territory Detection Algorithm**
   - Implement polygon closure detection
   - Flood fill or graph traversal for territory calculation
   - Update scores when territory is captured
   - Visualize captured territories with transparent fills

4. **Local Game State Management**
   - Update gameStore with new moves
   - Calculate and display scores
   - Enforce turn limits (40 total)
   - Determine winner

### Phase 3: Multiplayer Integration
5. **Supabase Integration**
   - User authentication (anonymous or social)
   - Create game functionality
   - Submit move to database
   - Query game state and moves

6. **Realtime Subscriptions**
   - Subscribe to moves table for active game
   - Update UI when opponent makes a move
   - Handle connection states

7. **Matchmaking**
   - Create game waiting for opponent
   - Join random game
   - Friend invite system (future enhancement)

### Phase 4: User Experience
8. **Push Notifications**
   - Request notification permissions
   - Send notification when it's user's turn
   - Handle notification tap to open game

9. **UI Screens**
   - Home screen with active games list
   - Game screen with board and scores
   - Matchmaking/lobby screen
   - Game over screen with results

### Phase 5: Monetization
10. **RevenueCat Integration**
    - Initialize SDK
    - Fetch offerings
    - Create paywall screen
    - Handle purchase flow
    - Restore purchases
    - Sync subscription status

11. **Game Limit Enforcement**
    - Check active games count
    - Show paywall when limit reached (free users)
    - Allow unlimited games for premium users

### Phase 6: Polish
12. **Animations & Visual Effects**
    - Line drawing animations
    - Territory capture animations
    - Score updates with transitions
    - Win/lose celebrations

13. **Sound Effects**
    - Line draw sound
    - Territory capture sound
    - Turn notification sound
    - Background music (optional)

14. **Cosmetics (Premium)**
    - Custom line colors
    - Board themes
    - Replay animations

### Phase 7: Testing & Launch
15. **Testing**
    - Unit tests for territory detection
    - Integration tests for multiplayer flow
    - E2E tests for complete game
    - Manual testing on iOS and Android

16. **App Store Preparation**
    - Screenshots and preview videos
    - App descriptions
    - Privacy policy
    - Terms of service
    - App icons in all sizes

17. **Analytics Integration**
    - Set up analytics service (Mixpanel, Amplitude, or similar)
    - Implement event tracking
    - Set up dashboards

## Technical Considerations

### Performance
- Use Skia for hardware-accelerated canvas rendering
- Optimize territory calculation (only recalculate on new moves)
- Implement efficient polygon algorithms
- Cache rendered territories

### Data Sync
- Handle offline scenarios gracefully
- Implement optimistic UI updates
- Retry failed network requests
- Resolve conflicts (should be rare with turn-based play)

### Security
- Validate moves server-side
- Use Row Level Security (RLS) in Supabase
- Prevent cheating (impossible moves)
- Rate limit API calls

### User Experience
- Fast app startup
- Smooth 60fps animations
- Clear visual feedback
- Helpful error messages
- Tutorial for first-time players

## Files to Create Next

1. `src/components/GameBoard.tsx` - Main board component
2. `src/components/GridCanvas.tsx` - Skia canvas for grid
3. `src/components/LineLayer.tsx` - Render line segments
4. `src/components/TerritoryLayer.tsx` - Render captured territories
5. `src/hooks/useDrawing.ts` - Handle drawing interaction
6. `src/hooks/useGameLogic.ts` - Game rules and validation
7. `src/screens/HomeScreen.tsx` - List of active games
8. `src/screens/GameScreen.tsx` - Active game view
9. `src/screens/MatchmakingScreen.tsx` - Find/create games

## Questions to Resolve

- [ ] Should we support undo/redo?
- [ ] How to handle abandoned games (player doesn't move)?
- [ ] Implement ELO or ranking system?
- [ ] Add chat between players?
- [ ] Support custom board sizes in premium?
- [ ] Tournament/bracket system?

## Resources Needed

- [ ] Supabase project URL and keys
- [ ] RevenueCat API key
- [ ] App Store Developer account
- [ ] Google Play Developer account
- [ ] Analytics service account
- [ ] Custom app icon design
- [ ] Sound effects library

## Timeline Estimate

This is a rough estimate for a single developer:

- Phase 1-2 (Core Rendering + Game Logic): 1-2 weeks
- Phase 3 (Multiplayer): 1 week
- Phase 4 (UX): 1 week
- Phase 5 (Monetization): 3-5 days
- Phase 6 (Polish): 1-2 weeks
- Phase 7 (Testing & Launch): 1 week

**Total: 6-8 weeks to MVP**

## Success Metrics

- App launches without crashes
- Games complete successfully end-to-end
- Push notifications delivered reliably
- Subscription flow works on both platforms
- Territory detection is accurate
- Performance: 60fps rendering, <100ms move submission

---

Last Updated: 2026-03-05
