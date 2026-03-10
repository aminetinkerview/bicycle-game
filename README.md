# Bicycle Game

A cross-platform runner game built with React Native and Expo. Ride a bicycle, outrun a monster, and reach the finish flag!

## Gameplay

- **Tap/click** anywhere (or press **Spacebar** on web) to accelerate
- Stay ahead of the **monster** chasing you from behind
- Reach the **finish flag** to complete the level
- 6 levels with increasing difficulty — the monster gets faster each level

### Web Controls

| Key       | Action  |
| --------- | ------- |
| Spacebar  | Accelerate |
| Enter     | Start   |
| Escape    | Pause   |
| R         | Restart |
| Q         | Quit    |

## Tech Stack

- **React Native** 0.81 + **Expo** 54
- **react-native-reanimated** — 60fps game loop & animations
- **Lottie** — character & monster sprites
- **react-native-svg** — background & flag graphics
- **Expo Router** — file-based navigation
- **TypeScript**

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

```bash
npm install
```

### Running

```bash
# Start development server
npm start

# Web
npm run web

# iOS
npm run ios

# Android
npm run android
```

## Project Structure

```
app/
  index.tsx              # Main menu
  levels/
    index.tsx            # Level selection
    [id]/index.tsx       # Gameplay screen
assets/                  # SVG backgrounds, Lottie animations, icons
components/
  menu-button.tsx        # Reusable menu button
consts.ts                # Background aspect ratio
data.ts                  # Level configurations
types.ts                 # TypeScript types
```
