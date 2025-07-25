'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';

export default function RentalCalendar() {
  const [date, setDate] = useState<DateRange | undefined>();

  return (
    <div className="flex justify-center">
      <Calendar
        mode="range"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        numberOfMonths={1}
      />
    </div>
  );
}
