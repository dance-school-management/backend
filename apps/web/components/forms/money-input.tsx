import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";

const moneyFormatter = new Intl.NumberFormat("en-US", {
  currency: "PLN",
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatValue(value: number): string {
  return moneyFormatter.format(value);
}

function parseInput(input: string): number {
  const digits = input.replace(/\D/g, "");
  return Number(digits) / 100;
}

type TextInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  className?: string;
};

export function MoneyInput({ form, name, label, className }: TextInputProps) {
  const initialNumber = form.getValues()[name] || 0;
  const [formattedValue, setFormattedValue] = useState(formatValue(initialNumber));

  useEffect(() => {
    const newValue = form.getValues()[name] || 0;
    setFormattedValue(formatValue(newValue));
  }, [form, name]);

  const handleChange = (realChangeFn: (value: number) => void, input: string) => {
    setFormattedValue(formatValue(parseInput(input)));
    realChangeFn(parseInput(input));
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                className={className}
                type="text"
                {...field}
                value={formattedValue}
                onChange={(e) => {
                  handleChange(field.onChange, e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
