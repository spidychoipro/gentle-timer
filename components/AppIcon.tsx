import React from 'react';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

export type AppIconName =
  | 'timer'
  | 'stopwatch'
  | 'settings'
  | 'play'
  | 'pause'
  | 'reset'
  | 'plus'
  | 'minus'
  | 'lap'
  | 'volume'
  | 'vibrate'
  | 'moon'
  | 'palette'
  | 'check';

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function AppIcon({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.9,
}: AppIconProps) {
  const common = {
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'timer' && (
        <>
          <Circle cx="12" cy="13" r="7.5" {...common} />
          <Line x1="12" y1="13" x2="15.5" y2="9.5" {...common} />
          <Line x1="9" y1="2.75" x2="15" y2="2.75" {...common} />
          <Line x1="12" y1="2.75" x2="12" y2="5.5" {...common} />
        </>
      )}
      {name === 'stopwatch' && (
        <>
          <Circle cx="12" cy="13" r="7.5" {...common} />
          <Line x1="12" y1="13" x2="12" y2="8.5" {...common} />
          <Line x1="12" y1="13" x2="15" y2="15" {...common} />
          <Line x1="9" y1="2.75" x2="15" y2="2.75" {...common} />
          <Line x1="17.5" y1="6.5" x2="19.25" y2="4.75" {...common} />
        </>
      )}
      {name === 'settings' && (
        <>
          <Circle cx="12" cy="12" r="3" {...common} />
          <Path
            d="M19.1 13.6c.08-.52.08-1.08 0-1.6l2-1.55-2-3.45-2.45.98a7.2 7.2 0 0 0-1.38-.8L14.9 4.5h-4l-.38 2.68c-.5.2-.96.46-1.38.8L6.7 7l-2 3.45L6.7 12c-.08.52-.08 1.08 0 1.6l-2 1.55 2 3.45 2.44-.98c.42.34.88.6 1.38.8l.38 2.68h4l.37-2.68c.5-.2.96-.46 1.38-.8l2.45.98 2-3.45-2-1.55Z"
            {...common}
          />
        </>
      )}
      {name === 'play' && (
        <Path d="m9 7 8 5-8 5V7Z" fill={color} stroke="none" />
      )}
      {name === 'pause' && (
        <>
          <Line x1="9" y1="7" x2="9" y2="17" {...common} strokeWidth={2.6} />
          <Line x1="15" y1="7" x2="15" y2="17" {...common} strokeWidth={2.6} />
        </>
      )}
      {name === 'reset' && (
        <>
          <Path d="M5.5 8.5A7.5 7.5 0 1 1 4.7 14" {...common} />
          <Polyline points="5.5,4.5 5.5,8.5 9.5,8.5" {...common} />
        </>
      )}
      {name === 'plus' && (
        <>
          <Line x1="12" y1="6" x2="12" y2="18" {...common} />
          <Line x1="6" y1="12" x2="18" y2="12" {...common} />
        </>
      )}
      {name === 'minus' && <Line x1="6" y1="12" x2="18" y2="12" {...common} />}
      {name === 'lap' && (
        <>
          <Path d="M7 3.5v17" {...common} />
          <Path d="M7 5h9l-2.2 3L16 11H7" {...common} />
        </>
      )}
      {name === 'volume' && (
        <>
          <Path d="M5 10v4h3l4 3V7L8 10H5Z" {...common} />
          <Path d="M15 9.2a4 4 0 0 1 0 5.6" {...common} />
          <Path d="M17.5 6.8a7.4 7.4 0 0 1 0 10.4" {...common} />
        </>
      )}
      {name === 'vibrate' && (
        <>
          <Path d="M9 6h6v12H9z" {...common} />
          <Path d="M6.5 8.5a5 5 0 0 0 0 7" {...common} />
          <Path d="M17.5 8.5a5 5 0 0 1 0 7" {...common} />
          <Line x1="11" y1="16" x2="13" y2="16" {...common} />
        </>
      )}
      {name === 'moon' && (
        <Path d="M19.5 15.5A8 8 0 0 1 8.5 4.5a8 8 0 1 0 11 11Z" {...common} />
      )}
      {name === 'palette' && (
        <>
          <Path d="M12 3.5a8.5 8.5 0 0 0 0 17h1.2a1.7 1.7 0 0 0 0-3.4h-.7a1.5 1.5 0 0 1 0-3h2.2a5.8 5.8 0 0 0 5.8-5.8c0-3.1-3.8-4.8-8.5-4.8Z" {...common} />
          <Circle cx="7.5" cy="11" r=".8" fill={color} />
          <Circle cx="9" cy="7.2" r=".8" fill={color} />
          <Circle cx="13.2" cy="6.5" r=".8" fill={color} />
          <Circle cx="16.7" cy="8.5" r=".8" fill={color} />
        </>
      )}
      {name === 'check' && <Polyline points="5,12.5 10,17 19,7.5" {...common} />}
    </Svg>
  );
}
