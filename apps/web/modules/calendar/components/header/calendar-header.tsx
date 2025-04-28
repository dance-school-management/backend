import {
    CalendarRange,
    Columns,
    LayoutList,
    List,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@repo/ui/button";
import {
    buttonHover,
    slideFromLeft,
    slideFromRight,
    transition,
} from "@/modules/calendar/animations";

import { TodayButton } from "@/modules/calendar/components/header/today-button";
import { DateNavigator } from "@/modules/calendar/components/header/date-navigator";

import type { IEvent } from "@/modules/calendar/interfaces";
import { ButtonGroup } from "@repo/ui/button-group";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { Toggle } from "@repo/ui/toggle";

const MotionButton = motion(Button);

export function CalendarHeader({ events }: { events: IEvent[]; }) {
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
                <TodayButton />
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
                        <Toggle>{isAgendaMode ? <CalendarRange /> : <LayoutList />}</Toggle>
                    </MotionButton>
                    <ButtonGroup className="flex">
                        <MotionButton
                            variant={view === "day" ? "default" : "outline"}
                            aria-label="View by day"
                            onClick={() => {
                                setView("day");
                            }}
                            variants={buttonHover}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <List className="h-4 w-4" />
                        </MotionButton>

                        <MotionButton
                            variant={view === "week" ? "default" : "outline"}
                            aria-label="View by week"
                            onClick={() => setView("week")}
                            variants={buttonHover}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Columns className="h-4 w-4" />
                        </MotionButton>
                    </ButtonGroup>
                </div>
            </motion.div>
        </div>
    );
}