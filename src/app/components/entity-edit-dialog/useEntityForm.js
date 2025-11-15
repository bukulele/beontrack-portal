import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "@/lib/auth-client";
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
        fieldSchema = z.string().email();
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
 * Hook for managing entity form state and submission
 */
export default function useEntityForm({
  entityType,
  entityData,
  formConfig,
  onSuccess,
  onClose,
}) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const schema = generateSchema(formConfig);

  // Sanitize entityData: convert null to empty string for form inputs
  const sanitizedDefaults = Object.fromEntries(
    Object.entries(entityData).map(([key, value]) => [
      key,
      value === null ? "" : value
    ])
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: sanitizedDefaults,
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/v1/${entityType}/${entityData.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            changed_by: session?.user?.name || "Unknown",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message);
      console.error("Error saving entity:", err);
    } finally {
      setIsLoading(false);
    }
  });

  return {
    form,
    handleSubmit,
    isLoading,
    error,
    sanitizedDefaults, // Return sanitized defaults for reset
  };
}
