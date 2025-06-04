import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
}

export function CustomDatePicker({
  value,
  onChange,
  className,
  placeholder = "Select date",
}: DatePickerProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [yearSelectOpen, setYearSelectOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    value ? value.getFullYear() : new Date().getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedYear(value.getFullYear());
      setCurrentMonth(value);
    }
  }, [value]);

  // Generate years for selection (20 years back, 20 years forward)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i);

  const handleYearChange = (year: string) => {
    const newYear = parseInt(year);
    setSelectedYear(newYear);

    // Create a new date with the selected year but keep the current month and day
    const newDate = new Date(currentMonth);
    newDate.setFullYear(newYear);
    setCurrentMonth(newDate);
  };

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger className="w-full justify-start text-left font-normal">
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          <Select
            value={selectedYear.toString()}
            onValueChange={handleYearChange}
            open={yearSelectOpen}
            onOpenChange={setYearSelectOpen}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue>{selectedYear}</SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setCalendarOpen(false);
          }}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          initialFocus
          className="p-3"
        />
      </PopoverContent>
    </Popover>
  );
}
