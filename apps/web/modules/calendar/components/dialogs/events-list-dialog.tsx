import { formatTime } from "@/modules/calendar/helpers";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@repo/ui/dialog";
import { cn } from "@repo/ui/lib/utils";

import { ReactNode } from "react";
import { IEvent } from "@/modules/calendar/interfaces";
import { dayCellVariants } from "@/modules/calendar/components/month-view/day-cell";
import { EventBullet } from "@/modules/calendar/components/month-view/event-bullet";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";

interface EventListDialogProps {
    date: Date;
    events: IEvent[];
    maxVisibleEvents?: number;
    children?: ReactNode;
}

export function EventListDialog({
    date,
    events,
    maxVisibleEvents = 3,
    children
}: EventListDialogProps) {
    const cellEvents = events;
    const hiddenEventsCount = Math.max(cellEvents.length - maxVisibleEvents, 0);
    const { badgeVariant } = useCalendar();

    const defaultTrigger = (
        <span className="cursor-pointer">
            <span className="sm:hidden">
                +{hiddenEventsCount}
            </span>
            <span className="hidden sm:inline py-0.5 px-2 my-1 rounded-xl border">
                {hiddenEventsCount}
                <span className="mx-1">more...</span>
            </span>
        </span>
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children || defaultTrigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Events for {formatTime(date)}
                    </DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto space-y-2">
                    {cellEvents.map((event) => (
                        <div
                            key={event.id}
                            className={cn(
                                "flex items-center gap-2 p-2 border rounded-md hover:bg-muted",
                                {
                                    [dayCellVariants({ color: event.color })]: badgeVariant === "colored",
                                }
                            )}
                        >
                            <EventBullet color={event.color} className="" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">{event.title}</p>
                                <p
                                    className={cn("text-xs", {
                                        "text-muted": badgeVariant === "colored",
                                        "text-muted-foreground": badgeVariant === "dot",
                                    })}
                                >
                                    {formatTime(event.startDate)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}