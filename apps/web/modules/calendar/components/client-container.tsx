"use client";

import { isSameDay, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { fadeIn, transition } from "@/modules/calendar/animations";

import { CalendarHeader } from "@/modules/calendar/components/header/calendar-header";
import { CalendarDayView } from "@/modules/calendar/components/week-and-day-view/calendar-day-view";
import { CalendarWeekView } from "@/modules/calendar/components/week-and-day-view/calendar-week-view";
import { AgendaEvents } from "@/modules/calendar/components/agenda-view/agenda-events";

export function ClientContainer() {
  const { selectedDate, view, isAgendaMode, selectedUserId, events } = useCalendar();

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
            {view === "week" && (
              <CalendarWeekView
                singleDayEvents={singleDayEvents}
                multiDayEvents={[]}
              />
            )}
            {view === "day" && (
              <CalendarDayView
                singleDayEvents={singleDayEvents}
                multiDayEvents={[]}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
