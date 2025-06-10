import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import type { ButtonProps } from "@/components/ui/button";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
  const innerRef = useRef<T>(null);

  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  }, [ref]);

  return innerRef;
}

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, "value" | "onChange" | "onBlur"> & ColorPickerProps
>(
  (
    { disabled, value, onChange, onBlur, name, className, ...props },
    forwardedRef,
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);

    const parsedValue = useMemo(() => value || "#FFFFFF", [value]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
          <Button
            {...props}
            className={cn("block", className)}
            name={name}
            onClick={() => setOpen(true)}
            size="icon"
            style={{ backgroundColor: parsedValue }}
            variant="outline"
          >
            <div />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <HexColorPicker
            color={parsedValue}
            onChange={onChange}
            style={{ width: "100%" }}
          />
          <Input
            maxLength={7}
            value={parsedValue}
            onChange={(e) => onChange(e.currentTarget.value)}
            ref={ref}
            className="mt-2 w-full"
          />
        </PopoverContent>
      </Popover>
    );
  },
);

ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
