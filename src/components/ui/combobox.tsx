import { cn } from "@/lib/cn";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type Option = {
  value: string;
  label: string;
};

export type ComboboxProps = {
  options: Option[];
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
  hasError?: boolean;
};

export function Combobox({
  options,
  placeholder = "Select...",
  emptyMessage = "No results found.",
  disabled = false,
  selectedValue,
  onChange,
  className,
  hasError,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((option) => option.value === selectedValue)?.label || "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={hasError}
          className={cn(
            "flex w-[200px] justify-between",
            "aria-invalid:border-destructive",
            className,
          )}
          disabled={disabled}
        >
          <p className="w-[180px] truncate text-left">
            {selectedLabel || placeholder}
          </p>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Cari...`} />
          <CommandList>
            <CommandEmpty className="p-4 text-center text-sm">
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValue === option.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
