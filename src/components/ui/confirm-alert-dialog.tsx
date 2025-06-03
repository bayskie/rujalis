import { type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

interface ConfirmAlertDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  children: ReactNode;
  label: ReactNode;
  labelVariant?:
    | "default"
    | "destructive"
    | "warning"
    | "success"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  cancelText?: string;
}

export function ConfirmAlertDialog({
  title,
  description,
  onConfirm,
  children,
  label,
  labelVariant = "default",
  cancelText = "Batal",
}: ConfirmAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={buttonVariants({ variant: labelVariant })}
          >
            {label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
