import { getEvents, getUsers } from "@/modules/calendar/requests";
import { CalendarProvider } from "@/modules/calendar/contexts/calendar-context";
import { ClientContainer } from "@/modules/calendar/components/client-container";

export default async function Calendar() {
    const [events, users] = await Promise.all([getEvents(), getUsers()]);

    return (
        <CalendarProvider users={users} events={events} >
            <div className="flex max-w-screen-2xl flex-col gap-4 m-2">
                <ClientContainer />
            </div>
        </CalendarProvider>
    );
}