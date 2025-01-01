import * as React from "react";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export function DateRangePicker({ value, onChange }) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (range) => {
    onChange(range);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value.start && value.end
            ? `${format(new Date(value.start), "PPP")} - ${format(
                new Date(value.end),
                "PPP"
              )}`
            : "Pilih rentang tanggal"}
          <CalendarIcon className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar mode="range" selected={value} onSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
}
