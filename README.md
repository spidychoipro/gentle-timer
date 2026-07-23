# Gentle Timer ⏱️

A modern, customizable timer and stopwatch app with quiet mode for Android. Perfect for libraries, meetings, or any quiet environment.

## Features

- **Timer**: Set hours, minutes, and seconds with a beautiful countdown display
- **Stopwatch**: Track time with lap functionality
- **Quiet Mode**: Mute sounds, use vibration only - perfect for quiet places
- **Theme Customization**: Choose from 10+ built-in themes including Dracula, Nord, Tokyo Night, and more
- **Gentle Notifications**: Soft chime and vibration when timer completes
- **Visual Feedback**: Screen flash animation on timer completion

## Themes

Choose from a variety of beautiful themes:

- Dracula
- Light
- Dark
- Nord
- Solarized Dark
- Monokai
- GitHub Dark
- Tokyo Night
- Ocean
- Sunset

## Installation

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/gentle-timer.git
cd gentle-timer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on Android:
```bash
npm run android
```

Or scan the QR code with Expo Go app on your Android device.

## Usage

### Timer
1. Set your desired time using the +/- buttons
2. Tap "Start" to begin countdown
3. When timer completes, you'll hear a gentle chime (unless in quiet mode)
4. Tap "Reset" to set a new timer

### Stopwatch
1. Tap "Start" to begin timing
2. Tap "Lap" to record lap times
3. Tap "Pause" to pause timing
4. Tap "Reset" to clear all times

### Settings
- **Quiet Mode**: Toggle to mute all sounds (vibration still works)
- **Sound**: Enable/disable the gentle chime
- **Vibration**: Enable/disable vibration feedback
- **Theme**: Choose your preferred color scheme

## Quiet Mode

When Quiet Mode is enabled:
- No sounds will play
- Vibration still works (stronger pattern)
- Visual feedback (screen flash) on timer completion

This is perfect for:
- Libraries
- Meetings
- Classrooms
- Any quiet environment

## Customization

### Adding Custom Themes

Edit `lib/themes.ts` to add your own themes:

```typescript
export const themes: Theme[] = [
  // ... existing themes
  {
    id: 'my-custom-theme',
    name: 'My Custom Theme',
    colors: {
      primary: '#your-primary-color',
      secondary: '#your-secondary-color',
      background: '#your-background-color',
      surface: '#your-surface-color',
      text: '#your-text-color',
      textSecondary: '#your-secondary-text-color',
      border: '#your-border-color',
      success: '#your-success-color',
      warning: '#your-warning-color',
      error: '#your-error-color',
      accent: '#your-accent-color',
    },
  },
];
```

## Tech Stack

- React Native (Expo)
- TypeScript
- Expo Router (file-based routing)
- Expo AV (audio playback)
- Expo Haptics (vibration feedback)
- AsyncStorage (settings persistence)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with Expo
- Inspired by the need for quiet timer solutions
- Theme colors inspired by popular code editors
