import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DropdownDialogItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuItem> {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onSelect?: () => void;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export const DropdownDialogItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuItem>,
  DropdownDialogItemProps
>(
  (
    {
      trigger,
      title,
      description,
      confirmLabel = "OK",
      cancelLabel = "Cancel",
      onConfirm,
      onSelect,
      onOpenChange,
      children,
      footer,
      ...itemProps
    },
    ref,
  ) => {
    return (
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <DropdownMenuItem
            {...itemProps}
            ref={ref}
            onSelect={(e) => {
              e.preventDefault();
              onSelect?.();
            }}
          >
            {trigger}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {children}
          <DialogFooter>
            {footer !== undefined ? (
              footer
            ) : (
              <>
                <DialogClose asChild>
                  <Button variant="ghost">{cancelLabel}</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={onConfirm}>{confirmLabel}</Button>
                </DialogClose>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);
