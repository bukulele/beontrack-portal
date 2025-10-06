"use client";

import { Form } from "@/components/ui/form";
import FormField from "./FormField";

/**
 * EntityForm - Renders a complete form based on config
 */
export default function EntityForm({ form, formConfig }) {
  if (!formConfig?.fields) {
    return (
      <div className="text-muted-foreground">No form configuration provided</div>
    );
  }

  return (
    <Form {...form}>
      <div className="grid grid-cols-2 gap-4">
        {formConfig.fields.map((field) => (
          <FormField key={field.key} field={field} form={form} />
        ))}
      </div>
    </Form>
  );
}
