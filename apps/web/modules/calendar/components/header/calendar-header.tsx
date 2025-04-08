import { CalendarRange, LayoutList } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@repo/ui/button";
import {
    buttonHover,
    slideFromLeft,
    slideFromRight,
    transition,
} from "@/modules/calendar/animations";

import { DateNavigator } from "@/modules/calendar/components/header/date-navigator";

import type { IEvent } from "@/modules/calendar/interfaces";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { Toggle } from "@repo/ui/toggle";

interface IProps {
    events: IEvent[];
}

const MotionButton = motion(Button);

export function CalendarHeader({ events }: IProps) {
    const { view, setView, isAgendaMode, toggleAgendaMode } = useCalendar();
    return (
        <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
            <motion.div
                className="flex items-center gap-3"
                variants={slideFromLeft}
                initial="initial"
                animate="animate"
                transition={transition}
            >
                <DateNavigator view={view} events={events} />
            </motion.div>

            <motion.div
                className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-1.5"
                variants={slideFromRight}
                initial="initial"
                animate="animate"
                transition={transition}
            >
                <div className="options flex-wrap flex items-center gap-4 md:gap-2">
                    <MotionButton
                        variant="outline"
                        onClick={() => toggleAgendaMode(!isAgendaMode)}
                        asChild
                        variants={buttonHover}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Toggle>{isAgendaMode ? <LayoutList /> : <CalendarRange />}</Toggle>
                    </MotionButton>
                    <MotionButton
                        variant="outline"
                        aria-label="View by day"
                        onClick={() => {
                            if (view === "day") {
                                setView("week");
                            } else {
                                setView("day");
                            }
                        }}
                        asChild
                        variants={buttonHover}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Toggle>{view === "day" ? "Daily" : "Weekly"}</Toggle>
                    </MotionButton>
                </div>
            </motion.div>
        </div>
    );
}