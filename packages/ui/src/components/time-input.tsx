import { forwardRef } from "react";
import { Info } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";
import { Input } from "@repo/ui/input";

type TTimeInputRef = HTMLInputElement;
type TimeValue = { hour: number; minute: number; }; // Matches eventSchema structure
type TTimeInputProps = {
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  invalid?: boolean;
  value?: TimeValue; // Updated to object type
  onChange?: (value: TimeValue) => void; // Updated to return object
  placeholder?: string;
};

const TimeInput = forwardRef<TTimeInputRef, TTimeInputProps>(
  (
    {
      className,
      inputClassName,
      disabled,
      invalid,
      value,
      onChange,
      placeholder = "HH:MM",
      ...props
    },
    ref
  ) => {
    // Convert TimeValue object to HH:mm string for input
    const stringValue = value
      ? `${value.hour.toString().padStart(2, "0")}:${value.minute.toString().padStart(2, "0")}`
      : "";

    // Convert HH:mm string from input to TimeValue object
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const [hourStr, minuteStr] = e.target.value.split(":");
      if (hourStr && minuteStr) {
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        onChange?.({ hour, minute });
      }
    };

    return (
      <div className={cn("relative", className)}>
        <Input
          ref={ref}
          type="time"
          value={stringValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            "inline-flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-50",
            invalid && "border-destructive bg-destructive/10 focus-visible:ring-destructive",
            inputClassName
          )}
          {...props}
        />
        {invalid && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-destructive">
            <Info className="size-4" aria-hidden="true" />
          </div>
        )}
      </div>
    );
  }
);

TimeInput.displayName = "TimeInput";

export { TimeInput };