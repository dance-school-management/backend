"use client";

import { isSameDay, parseISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

import { fadeIn, transition } from "@/modules/calendar/animations";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";

import { AgendaEvents } from "@/modules/calendar/components/agenda-view/agenda-events";
import { CalendarHeader } from "@/modules/calendar/components/header/calendar-header";
import { CalendarMonthView } from "@/modules/calendar/components/month-view/calendar-month-view";
import { CalendarDayView } from "@/modules/calendar/components/week-and-day-view/calendar-day-view";
import { CalendarWeekView } from "@/modules/calendar/components/week-and-day-view/calendar-week-view";
import { CalendarYearView } from "@/modules/calendar/components/year-view/calendar-year-view";

export function ClientContainer() {
  const { selectedDate, view, isAgendaMode, selectedUserId, events } =
    useCalendar();

  const filteredEvents = events.filter((event) => {
    const itemStartDate = new Date(event.startDate);
    const itemEndDate = new Date(event.endDate);

    const monthStart = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );
    const monthEnd = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    );

    const isInSelectedMonth =
      itemStartDate <= monthEnd && itemEndDate >= monthStart;
    const isUserMatch =
      selectedUserId === "all" || event.user.id === selectedUserId;
    return isInSelectedMonth && isUserMatch;
  });

  const singleDayEvents = filteredEvents.filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return isSameDay(startDate, endDate);
  });

  const multiDayEvents = filteredEvents.filter((event) => {
    const startDate = parseISO(event.startDate);
    const endDate = parseISO(event.endDate);
    return !isSameDay(startDate, endDate);
  });

  return (
    <motion.div
      className="w-full rounded-xl border"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
      transition={transition}
    >
      <CalendarHeader events={filteredEvents} />
      <AnimatePresence mode="wait">
        {isAgendaMode ? (
          <motion.div
            key="agenda"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeIn}
            transition={transition}
          >
            <AgendaEvents />
          </motion.div>
        ) : (
          <motion.div
            key={view}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeIn}
            transition={transition}
          >
            {view === "month" && (
              <CalendarMonthView
                singleDayEvents={singleDayEvents}
                multiDayEvents={multiDayEvents}
              />
            )}
            {view === "week" && (
              <CalendarWeekView
                singleDayEvents={singleDayEvents}
                multiDayEvents={multiDayEvents}
              />
            )}
            {view === "day" && (
              <CalendarDayView
                singleDayEvents={singleDayEvents}
                multiDayEvents={multiDayEvents}
              />
            )}
            {view === "year" && (
              <CalendarYearView
                singleDayEvents={singleDayEvents}
                multiDayEvents={multiDayEvents}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
