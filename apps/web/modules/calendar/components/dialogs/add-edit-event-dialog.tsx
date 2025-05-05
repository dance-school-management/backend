"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns";
import { useForm } from "react-hook-form";

import { COLORS } from "@/modules/calendar/constants";
import { useCalendar } from "@/modules/calendar/contexts/calendar-context";
import { useDisclosure } from "@/modules/calendar/hooks";
import { IEvent } from "@/modules/calendar/interfaces";
import { eventSchema, TEventFormData } from "@/modules/calendar/schemas";
import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { cn } from "@repo/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/select";
import { Textarea } from "@repo/ui/textarea";
import { TimeInput } from "@repo/ui/time-input";
import { CalendarIcon } from "lucide-react";
import { ReactNode } from "react";
import { toast } from "sonner";


interface IProps {
    children: ReactNode;
    startDate?: Date;
    startTime?: { hour: number; minute: number; };
    event?: IEvent;
}

export function AddEditEventDialog({ children, startDate, startTime, event }: IProps) {
    const { isOpen, onClose, onToggle } = useDisclosure();
    const { addEvent, updateEvent } = useCalendar();
    const isEditing = !!event;

    const form = useForm<TEventFormData>({
        resolver: zodResolver(eventSchema),
        defaultValues: event ? {
            title: event.title,
            description: event.description,
            startDate: new Date(event.startDate),
            startTime: {
                hour: new Date(event.startDate).getHours(),
                minute: new Date(event.startDate).getMinutes(),
            },
            endDate: new Date(event.endDate),
            endTime: {
                hour: new Date(event.endDate).getHours(),
                minute: new Date(event.endDate).getMinutes(),
            },
            color: event.color,
        } : {
            title: "",
            description: "",
            startDate: startDate ?? new Date(), // Default to current date
            startTime: startTime ?? { hour: 0, minute: 0 }, // Default to midnight
            endDate: startDate ?? new Date(), // Default to current date
            endTime: { hour: 1, minute: 0 }, // Default to 1 AM
            color: "blue" as const, // Default color
        },
    });

    const onSubmit = (values: TEventFormData) => {
        try {
            // Combine startDate and startTime
            const startDateTime = set(values.startDate, {
                hours: values.startTime.hour,
                minutes: values.startTime.minute,
            });

            // Combine endDate and endTime
            const endDateTime = set(values.endDate, {
                hours: values.endTime.hour,
                minutes: values.endTime.minute,
            });

            const formattedEvent: IEvent = {
                ...values,
                startDate: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
                endDate: format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss"),
                id: isEditing ? event.id : Math.floor(Math.random() * 1000000),
                user: isEditing ? event.user : {
                    id: Math.floor(Math.random() * 1000000).toString(),
                    name: "John Doe",
                    picturePath: null,
                },
                color: values.color,
            };

            if (isEditing) {
                updateEvent(formattedEvent);
                toast.success("Event updated successfully");
            } else {
                addEvent(formattedEvent);
                toast.success("Event created successfully");
            }

            onClose();
            form.reset();
        } catch (error) {
            console.error(`Error ${isEditing ? 'editing' : 'adding'} event:`, error);
            toast.error(`Failed to ${isEditing ? 'edit' : 'add'} event`);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onToggle}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Event" : "Add New Event"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Modify your existing event." : "Create a new event for your calendar."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        id="event-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-4 py-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel htmlFor="title" className="required">
                                        Title
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="title"
                                            placeholder="Enter a title"
                                            {...field}
                                            className={fieldState.invalid ? "border-red-500" : ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-start gap-2">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="required">Start Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? format(field.value, "PPP") :
                                                            <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date < new Date("1900-01-01")}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field, fieldState }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="required">Start Time</FormLabel>
                                        <FormControl>
                                            <TimeInput
                                                value={field.value}
                                                onChange={field.onChange}
                                                className={fieldState.invalid ? "border-red-500" : ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex items-start gap-2">
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="required">End Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-[240px] pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? format(field.value, "PPP") :
                                                            <span>Pick a date</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date < (form.getValues("startDate") || new Date())}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field, fieldState }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel className="required">End Time</FormLabel>
                                        <FormControl>
                                            <TimeInput
                                                value={field.value}
                                                onChange={field.onChange}
                                                className={fieldState.invalid ? "border-red-500" : ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="required">Variant</FormLabel>
                                    <FormControl>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger
                                                className={`w-full ${fieldState.invalid ? "border-red-500" : ""}`}
                                            >
                                                <SelectValue placeholder="Select a variant" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {COLORS.map(color => (
                                                    <SelectItem value={color} key={color}>
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className={`size-3.5 rounded-full bg-${color}-600 dark:bg-${color}-700`} />
                                                            {color}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="required">Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter a description"
                                            className={fieldState.invalid ? "border-red-500" : ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button form="event-form" type="submit">
                        {isEditing ? "Save Changes" : "Create Event"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}