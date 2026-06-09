// Classic Pokémon dialog typewriter: reveals text character
// by character, then blinks a ▼ continue-marker.
import React, { useState, useEffect, useRef } from 'react';
import { Text, Animated } from 'react-native';

export default function TypewriterText({
  text,
  speed = 18,
  style,
  cursorStyle,
  onDone,
}) {
  const [count, setCount] = useState(0);
  const blink = useRef(new Animated.Value(1)).current;
  const done = count >= (text?.length || 0);

  useEffect(() => {
    setCount(0);
    if (!text) return;
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev >= text.length) { clearInterval(timer); return prev; }
        return prev + 1;
      });
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  useEffect(() => {
    if (!done) return;
    if (onDone) onDone();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0, duration: 420, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 420, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [done]);

  if (!text) return null;

  return (
    <Text style={style}>
      {text.slice(0, count)}
      {done && (
        <Animated.Text style={[cursorStyle, { opacity: blink }]}> ▼</Animated.Text>
      )}
    </Text>
  );
}
