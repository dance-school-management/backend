import { useState } from "react";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { addDays, isSameDay, startOfDay, startOfWeek } from "date-fns";
import { IEvent } from "@/modules/calendar/interfaces";
import { TEventColor } from "@/modules/calendar/types";



export function useDisclosure({ defaultIsOpen = false }: { defaultIsOpen?: boolean; } = {}) {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen(currentValue => !currentValue);

  return { onOpen, onClose, isOpen, onToggle };
}


export const getEventsForDay = (events: IEvent[], date: Date, isWeek = false): IEvent[] => {
  return events.filter((event) => {
    const startOfDayForEventStartDate = startOfDay(event.startDate);
    const startOfDayForEventEndDate = startOfDay(event.endDate);
    const targetDate = startOfDay(date);

    if (isWeek) return (event.startDate !== event.endDate) && (startOfDayForEventStartDate <= targetDate && startOfDayForEventEndDate >= targetDate);
    else return startOfDayForEventStartDate <= targetDate && startOfDayForEventEndDate >= targetDate;
  }).map((event) => {
    let point = undefined;

    if (isSameDay(new Date(event.startDate).setHours(0, 0, 0, 0), new Date(event.endDate).setHours(0, 0, 0, 0))) {
      point = 'none';
    } else if (isSameDay(new Date(event.startDate).setHours(0, 0, 0, 0), new Date(date))) {
      point = 'start';
    } else if (isSameDay(new Date(event.endDate).setHours(0, 0, 0, 0), new Date(date))) {
      point = 'end';
    }

    return {
      ...event,
      point,
    };
  }) as IEvent[];
};

export const getWeekDates = (date: Date): Date[] => {
  const startDate = startOfWeek(date, { weekStartsOn: 1 });
  const weekDates: Date[] = [];

  for (let i = 0; i < 7; i++) {
    weekDates.push(addDays(startDate, i));
  }

  return weekDates;
};

export const getEventsForWeek = (events: IEvent[], date: Date): IEvent[] => {
  const weekDates = getWeekDates(date);
  const startOfWeek = weekDates[0];
  const endOfWeek = weekDates[6];

  return events.filter((event) => {
    return new Date(event.startDate) <= endOfWeek && new Date(event.endDate) >= startOfWeek;
  });
};

export const getColorClass = (color: string): string => {
  const colorClasses: Record<TEventColor, string> = {
    red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    green: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
    blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
    orange: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300',
    purple: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300',
  };
  return colorClasses[color as TEventColor] || '';
};

export const getBgColor = (color: string): string => {
  const colorClasses: Record<TEventColor, string> = {
    red: 'bg-red-400 dark:bg-red-600',
    yellow: 'bg-yellow-400 dark:bg-yellow-600',
    green: 'bg-green-400 dark:bg-green-600',
    blue: 'bg-blue-400 dark:bg-blue-600',
    orange: 'bg-orange-400 dark:bg-orange-600',
    purple: 'bg-purple-400 dark:bg-purple-600',
  };
  return colorClasses[color as TEventColor] || '';
};

export const useGetEventsByMode = (events: IEvent[]) => {
  const { view, selectedDate } = useCalendar();

  switch (view) {
    case 'day': {
      return getEventsForDay(events, selectedDate);
    }
    case 'week': {
      return getEventsForWeek(events, selectedDate);
    }
    default: {
      return [];
    }
  }
};