import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combobox";

type Field = {
  value: string;
  onChange: (value: string) => void;
};

type FieldState = {
  error?: {
    message?: string;
  };
};

type Option = {
  value: string;
  label: string;
};

type FormComboboxProps = {
  label: string;
  field: Field;
  fieldState: FieldState;
  options: Option[];
  placeholder: string;
  disabled?: boolean;
};

export const FormCombobox = ({
  label,
  field,
  fieldState,
  options,
  placeholder,
  disabled,
}: FormComboboxProps) => {
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Combobox
          className="w-full"
          options={options}
          selectedValue={field.value ?? ""}
          onChange={(value) => field.onChange(value)}
          placeholder={placeholder}
          emptyMessage={`${label} tidak ditemukan.`}
          disabled={disabled}
          hasError={!!fieldState.error}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
