"use client";

import { createContext, useContext, useState } from "react";

/**
 * NavigationContext - Simple state-based navigation for entity cards
 *
 * Manages a stack of viewed entities without URL involvement.
 * Stack resets on page refresh (intentional).
 *
 * NO HARDCODING - Works with any entity type generically.
 */

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const [stack, setStack] = useState([]);

  // Current card (top of stack)
  const current = stack[stack.length - 1] || null;

  // Can go back if more than one item in stack
  const canGoBack = stack.length > 1;

  /**
   * Push new entity to stack (navigate forward)
   * Generic - works with ANY entity type
   */
  const push = (entityType, entityId) => {
    // Prevent duplicate: don't add if already current
    if (current?.entityType === entityType && current?.entityId === entityId) {
      return;
    }

    setStack((prev) => [...prev, { entityType, entityId }]);
  };

  /**
   * Pop from stack (navigate back)
   */
  const pop = () => {
    if (stack.length <= 1) return; // Can't pop the base

    setStack((prev) => prev.slice(0, -1));
  };

  /**
   * Clear navigation stack (close all cards)
   */
  const clear = () => {
    setStack([]);
  };

  /**
   * Initialize stack when opening a card from table
   */
  const init = (entityType, entityId) => {
    setStack([{ entityType, entityId }]);
  };

  const value = {
    stack,
    current,
    canGoBack,
    push,
    pop,
    clear,
    init,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * Hook to access navigation context
 */
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}
