import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

/**
 * Generate Zod schema from form config
 */
function generateSchema(config) {
  const shape = {};

  config.fields.forEach((field) => {
    let fieldSchema;

    switch (field.type) {
      case "number":
        fieldSchema = z.coerce.number();
        break;
      case "email":
        fieldSchema = z.string().email("Invalid email address");
        break;
      case "date":
        fieldSchema = z.string();
        break;
      default:
        fieldSchema = z.string();
    }

    if (field.required) {
      fieldSchema = fieldSchema.min(1, `${field.label} is required`);
    } else {
      fieldSchema = fieldSchema.optional().or(z.literal(""));
    }

    shape[field.key] = fieldSchema;
  });

  return z.object(shape);
}

/**
 * Hook for managing entity creation form state and submission
 *
 * Uses universal API pattern: POST /api/v1/{entityType}
 */
export default function useEntityCreateForm({
  entityType,
  formConfig,
  onSuccess,
  onClose,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const schema = generateSchema(formConfig);

  // Get default values from config - all fields default to empty string
  const defaultValues = formConfig.fields.reduce((acc, field) => {
    acc[field.key] = "";
    return acc;
  }, {});

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      // Clean up data: remove empty strings and convert to null
      const cleanedData = Object.fromEntries(
        Object.entries(data)
          .filter(([_, value]) => value !== "")
          .map(([key, value]) => [key, value || null])
      );

      // Remove status field - backend will set it to 'new' automatically
      delete cleanedData.status;

      const response = await fetch(`/api/v1/${entityType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error messages from the API
        throw new Error(result.error || "Failed to create entity");
      }

      if (onSuccess) onSuccess(result);
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
      console.error("Error creating entity:", err);
    } finally {
      setIsLoading(false);
    }
  });

  return {
    form,
    handleSubmit,
    isLoading,
    error,
  };
}
