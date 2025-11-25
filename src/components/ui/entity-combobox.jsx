"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * EntityCombobox - Searchable combobox for selecting entities
 *
 * Fetches entity data from an API endpoint and displays them in a searchable dropdown.
 * Used for selecting employees, customers, suppliers, etc.
 *
 * @param {string} value - Currently selected entity ID
 * @param {Function} onChange - Callback when selection changes (receives entity ID)
 * @param {string} apiEndpoint - API endpoint to fetch entities from
 * @param {Function} displayFormat - Function to format entity for display
 * @param {string} valueField - Field name to use as value (default: 'id')
 * @param {string} placeholder - Placeholder text
 * @param {string} emptyText - Text to show when no results found
 * @param {boolean} disabled - Whether the combobox is disabled
 */
export function EntityCombobox({
  value,
  onChange,
  apiEndpoint,
  displayFormat,
  valueField = "id",
  placeholder = "Select...",
  emptyText = "No results found.",
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);
  const [entities, setEntities] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Fetch entities when component mounts or apiEndpoint changes
  React.useEffect(() => {
    if (!apiEndpoint) {
      setEntities([]);
      return;
    }

    const fetchEntities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(apiEndpoint);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch entities');
        }

        setEntities(result.data || []);
      } catch (err) {
        console.error('Error fetching entities:', err);
        setError(err.message);
        setEntities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [apiEndpoint]);

  // Find the currently selected entity
  const selectedEntity = entities.find(
    (entity) => entity[valueField] === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : selectedEntity ? (
            displayFormat(selectedEntity)
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>
              {error ? `Error: ${error}` : emptyText}
            </CommandEmpty>
            <CommandGroup>
              {entities.map((entity) => (
                <CommandItem
                  key={entity[valueField]}
                  value={entity[valueField]}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === entity[valueField] ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {displayFormat(entity)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
