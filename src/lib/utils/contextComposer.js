import React from "react";

/**
 * Wraps a component with multiple context providers dynamically
 *
 * This utility allows nesting multiple context providers based on configuration,
 * enabling the UniversalCard to work with different entity contexts dynamically.
 *
 * @param {Array} contexts - Array of context configurations
 * @param {React.Component} contexts[].Provider - The context provider component
 * @param {Object} contexts[].props - Props to pass to the provider
 * @param {React.ReactNode} children - The component to wrap
 * @returns {React.ReactNode} - Component wrapped with all providers
 *
 * @example
 * wrapWithContexts(
 *   [
 *     { Provider: DriverProvider, props: { userId: 123 } },
 *     { Provider: IncidentsListProvider, props: {} }
 *   ],
 *   <CardContent />
 * )
 * // Returns: <DriverProvider userId={123}><IncidentsListProvider><CardContent /></IncidentsListProvider></DriverProvider>
 */
export function wrapWithContexts(contexts, children) {
  // If no contexts, return children as-is
  if (!contexts || contexts.length === 0) {
    return children;
  }

  // Recursively nest providers from right to left
  return contexts.reduceRight((acc, context) => {
    const { Provider, props = {} } = context;
    return React.createElement(Provider, props, acc);
  }, children);
}

/**
 * Higher-order component that wraps a component with context providers
 *
 * @param {React.Component} Component - Component to wrap
 * @param {Array} contexts - Array of context configurations
 * @returns {React.Component} - Wrapped component
 *
 * @example
 * const WrappedCard = withContexts(UniversalCard, [
 *   { Provider: DriverProvider, props: { userId: 123 } }
 * ]);
 */
export function withContexts(Component, contexts) {
  return function WrappedWithContexts(props) {
    return wrapWithContexts(
      contexts,
      <Component {...props} />
    );
  };
}

/**
 * Creates a context wrapper component from configuration
 *
 * This is used to dynamically create provider wrappers based on card config
 *
 * @param {Object} config - Card configuration
 * @param {Object} contextRegistry - Map of context provider names to components
 * @returns {Array} - Array of context configurations ready for wrapWithContexts
 *
 * @example
 * const contexts = createContextsFromConfig(
 *   cardConfig,
 *   { DriverProvider, IncidentsListProvider }
 * );
 */
export function createContextsFromConfig(config, contextRegistry) {
  if (!config.entity?.contexts || config.entity.contexts.length === 0) {
    return [];
  }

  return config.entity.contexts.map((contextConfig) => {
    const Provider = contextRegistry[contextConfig.providerName];

    if (!Provider) {
      console.warn(`Context provider "${contextConfig.providerName}" not found in registry`);
      return null;
    }

    return {
      Provider,
      props: contextConfig.props || {}
    };
  }).filter(Boolean); // Remove null entries
}
