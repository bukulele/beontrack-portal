"use client";

import React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Mail, Phone, MessageCircle } from "lucide-react";
import copy from "copy-to-clipboard";
import callPhoneNumber from "@/app/functions/callPhoneNumber";
import formatDate from "@/app/functions/formatDate";

/**
 * InfoField - Read-only field display with action buttons
 *
 * Displays a field with label and value. Shows action buttons (copy, email, call, whatsapp)
 * based on fieldConfig.actions array. No inline editing - use form-level edit dialog instead.
 *
 * @param {Object} fieldConfig - Field configuration
 * @param {string} fieldConfig.key - Field key in entity data
 * @param {string} fieldConfig.label - Field label
 * @param {string} fieldConfig.type - Field type (text, number, date, etc.)
 * @param {Array} fieldConfig.actions - Array of action names (copy, email, call, whatsapp)
 * @param {Function} fieldConfig.formatter - Optional value formatter for display
 * @param {any} value - Current value
 * @param {Object} entityData - Full entity data
 * @param {React.ReactNode} sideContent - Optional content to render on the right side
 */
function InfoField({
  fieldConfig,
  value,
  entityData,
  sideContent,
  additionalContexts,
}) {
  // Action handlers
  const handleCopy = () => {
    if (value) {
      copy(String(value));
    }
  };

  const handleEmail = () => {
    if (value) {
      window.location.href = `mailto:${value}`;
    }
  };

  const handleCall = () => {
    if (value) {
      callPhoneNumber(value);
    }
  };

  const handleWhatsApp = () => {
    if (value) {
      // Remove formatting, keep only digits
      const cleanNumber = String(value).replace(/\D/g, '');
      window.open(`https://wa.me/1${cleanNumber}`, '_blank');
    }
  };

  // Format display value
  const getDisplayValue = () => {
    if (fieldConfig.formatter) {
      return fieldConfig.formatter(value, entityData, additionalContexts);
    }

    if (fieldConfig.type === "select" && fieldConfig.selectOptions) {
      return fieldConfig.selectOptions[value] || value || "N/A";
    }

    // Auto-format date fields
    if (fieldConfig.type === "date" && value) {
      return formatDate(value);
    }

    return value || "N/A";
  };

  // Check if field should be hidden (formatter returned null)
  const displayValue = getDisplayValue();
  if (displayValue === null) {
    return null;
  }

  // Action button configuration
  const actionConfig = {
    copy: {
      icon: Copy,
      handler: handleCopy,
      tooltip: "Copy to clipboard",
      color: "text-slate-600",
    },
    email: {
      icon: Mail,
      handler: handleEmail,
      tooltip: "Send email",
      color: "text-blue-600",
    },
    call: {
      icon: Phone,
      handler: handleCall,
      tooltip: "Call",
      color: "text-green-600",
    },
    whatsapp: {
      icon: MessageCircle,
      handler: handleWhatsApp,
      tooltip: "Open WhatsApp",
      color: "text-green-600",
    },
  };

  // Render action buttons
  const renderActionButtons = () => {
    if (!fieldConfig.actions || fieldConfig.actions.length === 0) {
      return null;
    }

    return (
      <ButtonGroup>
        {fieldConfig.actions.map((actionName) => {
          const action = actionConfig[actionName];
          if (!action) return null;

          const IconComponent = action.icon;

          return (
            <TooltipProvider key={actionName}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={action.handler}
                    className="h-6 w-6"
                  >
                    <IconComponent className={`h-3 w-3 ${action.color}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{action.tooltip}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </ButtonGroup>
    );
  };

  return (
    <Field className="py-0.5">
      <div className="flex items-center justify-between gap-3 min-h-[32px]">
        {/* Label */}
        <FieldLabel className="text-sm font-medium text-muted-foreground">
          {fieldConfig.label}
        </FieldLabel>

        {/* Value */}
        <div className="flex-1">
          <div className="text-sm">{displayValue}</div>
        </div>

        {/* Side Content or Action Buttons */}
        <div className="flex items-center gap-1 min-w-[80px] justify-end">
          {sideContent || renderActionButtons()}
        </div>
      </div>
    </Field>
  );
}

export default InfoField;
