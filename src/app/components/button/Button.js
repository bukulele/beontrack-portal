import React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Tooltip } from "react-tooltip";

/**
 * Button Wrapper Component
 * Wraps shadcn/ui Button while maintaining backward compatibility with old API
 * Uses pure shadcn styling - no custom classes
 */
function Button({
  content,
  style,
  fn,
  tooltipContent,
  tooltipId,
  highlighted,
  disabled,
  className,
}) {
  const handleClick = (e) => {
    if (fn) {
      fn(content, e);
    }
  };

  // Map old style prop to shadcn variant and size ONLY
  // No custom styling - pure shadcn
  const getVariantAndSize = () => {
    const mapping = {
      classicButton: { variant: "secondary", size: "default" },
      "classicButton-s": { variant: "secondary", size: "sm" },
      iconButton: { variant: "ghost", size: "icon" },
      "iconButton-l": { variant: "ghost", size: "icon" },
      tabButton: { variant: "outline", size: "default" },
      menuPoint: { variant: "ghost", size: "default" },
      wideButton: { variant: "default", size: "default" },
      imageButton: { variant: "ghost", size: "default" },
      smallButton: { variant: "ghost", size: "sm" },
      warnButton: { variant: "destructive", size: "sm" },
    };

    return mapping[style] || { variant: "default", size: "default" };
  };

  const config = getVariantAndSize();

  // Override variant if highlighted - use primary/default
  const finalVariant = highlighted ? "default" : config.variant;

  return (
    <>
      <ShadcnButton
        variant={finalVariant}
        size={config.size}
        disabled={disabled}
        onClick={handleClick}
        className={className}
        data-tooltip-id={tooltipId}
        data-tooltip-hidden={!tooltipContent}
      >
        {content}
      </ShadcnButton>

      {tooltipContent && tooltipId && (
        <Tooltip
          id={tooltipId}
          openEvents={{ mouseenter: true, focus: true, click: true }}
          style={{ maxWidth: "90%", zIndex: 20 }}
        >
          {tooltipContent}
        </Tooltip>
      )}
    </>
  );
}

export default Button;
