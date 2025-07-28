# Mystery Box Giveaway Feature

## Overview
The Mystery Box Giveaway is an interactive feature that randomly appears on the website, providing users with a chance to win Binance gift codes.

## Features

### 🎁 Mystery Box
- **Random Appearance**: The mystery box appears at random positions on the screen
- **Random Timing**: Appears every 15-45 seconds after the previous one is closed
- **Visual Effects**: 
  - Sparkling animation around the box
  - Hover effects with scale transformation
  - "Click me!" hint text

### 🎆 Fireworks Animation
- **Particle System**: 30 colorful particles explode from the box when clicked
- **Random Colors**: Uses a variety of bright colors (gold, red, cyan, blue, green, yellow)
- **Circular Spread**: Particles spread in a circular pattern with random variations
- **Smooth Animation**: 1.5-second animation with staggered delays

### 🎉 Gift Code Display
- **Random Generation**: Creates unique 8-character alphanumeric codes
- **Modal Display**: Beautiful modal with congratulations message
- **Auto-close**: Automatically closes after 5 seconds
- **Responsive Design**: Works on all screen sizes

## Technical Implementation

### Components
- `MysteryBox.tsx`: Main component handling the mystery box logic
- `App.tsx`: Integration point for the mystery box feature

### CSS Animations
- `firework`: Keyframe animation for particle explosion
- `sparkle`: Animation for box sparkle effects
- `giftCodeAppear`: Modal appearance animation

### State Management
- Position tracking for random placement
- Visibility states for different animation phases
- Timing management for automatic appearance

## Usage
The mystery box feature is automatically enabled and will start appearing after 5-15 seconds when the page loads. Users simply need to click on the mystery box when it appears to trigger the fireworks and receive their gift code.

## Customization
- Modify the `generateFireworkParticles()` function to change particle count, colors, or spread pattern
- Adjust timing in `handleMysteryBoxClose()` for different appearance intervals
- Update the gift code generation logic in the `useState` hook
- Customize CSS animations in `index.css` for different visual effects 