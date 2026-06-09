import React, { createContext, useContext, useRef, useCallback } from 'react';

const GameBoyContext = createContext();

export function GameBoyProvider({ children }) {
  const handlersRef = useRef({});

  const setHandlers = useCallback((newHandlers) => {
    handlersRef.current = newHandlers;
  }, []);

  const pressButton = useCallback((button) => {
    const handler = handlersRef.current[button];
    if (handler) handler();
  }, []);

  return (
    <GameBoyContext.Provider value={{ setHandlers, pressButton }}>
      {children}
    </GameBoyContext.Provider>
  );
}

export function useGameBoy() {
  return useContext(GameBoyContext);
}
