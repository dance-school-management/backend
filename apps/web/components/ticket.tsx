
import { Ticket } from "@/lib/model";
import { QRCodeSVG } from "qrcode.react";

import { AspectRatio } from "@repo/ui/aspect-ratio";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { Separator } from "@repo/ui/separator";

export function TicketPreview({ ticket }: { ticket: Ticket; }) {
  return (
    <Card className="max-w-xl w-full gap-0">
      <CardHeader>
        <CardTitle className="text-2xl">{ticket.class.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription >
          <p className="text-lg">Date: {ticket.class.date} ({ticket.class.start_time} - {ticket.class.end_time})</p>
          <p className="text-base">Trainer: {ticket.class.trainer}</p>
          <p className="text-base">Room: {ticket.class.classroom}</p>
        </CardDescription>
      </CardContent>
      <CardFooter className="mt-2">
        <TicketDialog ticket={ticket} />
      </CardFooter>
    </Card>
  );
}

function TicketDialog({ ticket }: { ticket: Ticket; }) {
  const meta = {
    ticket_id: ticket.id,
    user_id: ticket.user_id,
    class_id: ticket.class.id,
  };

  const date = `${ticket.class.date} (${ticket.class.start_time} - ${ticket.class.end_time})`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer ml-auto w-full sm:w-48">Show Code</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-h-[90%] overflow-auto">
        <DialogHeader>
          <DialogTitle>{ticket.class.name}</DialogTitle>
          <DialogDescription>
            {ticket.class.description}
          </DialogDescription>
        </DialogHeader>
        <div className="text-foreground font-semibold text-base">
          <Info caption="Date:" value={date} />
          <Info caption="Trainer:" value={ticket.class.trainer} />
          <Info caption="Room:" value={ticket.class.classroom} />
          <Info caption="Category:" value={ticket.class.dance_category} />
          <Info caption="Level:" value={ticket.class.advancement_level} />
          <Separator className="mt-2" />
        </div>
        <p className="font-normal text-xs md:text-sm text-muted-foreground">This is your ticket for the class. Scan it, please.</p>
        <AspectRatio ratio={1 / 1} className="w-full">
          <div className="bg-white rounded-xl w-full h-full flex justify-center items-center">
            <QRCodeSVG
              className="p-3 w-full h-full"
              value={JSON.stringify(meta)}
              bgColor="transparent"
              level="H"
            />
          </div>
        </AspectRatio>
        <p className="text-xs text-right">
          <span className="font-semibold">Ticket ID:</span> {ticket.id}
        </p>
      </DialogContent>
    </Dialog>
  );
}

function Info({ caption, value }: { caption: string; value: string; }) {
  return (
    <p>
      <span className="font-normal text-muted-foreground">{caption}</span>
      <span className="font-semibold"> {value}</span>
    </p>
  );
}
