"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@tabler/icons-react";
import { CloudUpload, Paperclip } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { EmployeeRole } from "@/lib/model/employee";
import { Button } from "@repo/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/drawer";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem
} from "@repo/ui/file-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Textarea } from "@repo/ui/textarea";

const dropZoneConfig = {
  maxFiles: 1,
  maxSize: 1024 * 1024 * 4,
  multiple: false,
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", ".webp"]
  }
};

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2),
  surname: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.string(),
  description: z.string().optional(),
  file: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export function NewEmployeeDrawer() {
  const [file, setFile] = useState<File[] | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      role: "",
      phone: "",
      description: "",
      file: ""
    }
  });

  function onSubmit(values: FormValues) {
    try {
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }


  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" className="text-foreground w-fit text-left">
          <IconPlus /> New Employee
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Add new employee</DrawerTitle>
          <DrawerDescription>
            Fill out the form below to add a new employee.
          </DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="name" render={({ field }) => <NameField field={field} />} />
              <FormField control={form.control} name="surname" render={({ field }) => <SurnameField field={field} />} />
              <FormField control={form.control} name="role" render={({ field }) => <RoleChooser field={field} />} />
              <FormField control={form.control} name="email" render={({ field }) => <EmailField field={field} />} />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 456 789"
                        type="text"
                        {...field}
                        value={field.value ?? undefined}
                      />
                    </FormControl>
                    <FormDescription>Enter phone number in format XXX XXX XXX</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="description" render={({ field }) => <BioField field={field} />} />
              <FormField control={form.control} name="file" render={() => <FileChooser file={file} setFile={setFile} />} />
            </form>
          </div>
          <DrawerFooter>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Done</Button>
            </DrawerClose>
          </DrawerFooter>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

export function UpdateEmployeeDrawer({ employee }: { employee: FormValues; }) {
  const [file, setFile] = useState<File[] | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: employee || {}
  });

  function onSubmit(values: Partial<FormValues>) {
    const diff = (Object.keys(values) as (keyof FormValues)[]).reduce((diff, key) => {
      if (employee[key] === values[key]) return diff;
      if (values[key] === "") return {
        ...diff,
        [key]: null
      };
      return {
        ...diff,
        [key]: values[key]
      };
    }, {} as Partial<FormValues>);

    if (Object.keys(diff).length === 0) {
      toast.info("No changes detected");
      return;
    }

    diff.id = employee.id;

    try {
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(diff, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {employee.name} {employee.surname}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{employee.name} {employee.surname}</DrawerTitle>
          <DrawerDescription>Modify the necessary fields to update employee details.</DrawerDescription>
        </DrawerHeader>
        <Form {...form}>
          <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="role" render={({ field }) => <RoleChooser field={field} />} />
              <FormField control={form.control} name="email" render={({ field }) => <EmailField field={field} />} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 456 789"
                      type="text" {...field}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => <BioField field={field} />} />
              <FormField control={form.control} name="file" render={() => <FileChooser file={file} setFile={setFile} />} />
            </form>
          </div>
          <DrawerFooter>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>Update</Button>
            <DrawerClose asChild>
              <Button variant="outline">Done</Button>
            </DrawerClose>
          </DrawerFooter>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}

const roleOptions = Object.values(EmployeeRole);

const RoleChooser = ({ field }: { field: Partial<ControllerRenderProps<{ role: string; }, "role">>; }) => (
  <FormItem className="flex flex-col gap-3">
    <FormLabel>Role*</FormLabel>
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <FormControl>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select employee role" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {roleOptions.map((role) => (
          <SelectItem key={role} value={role}>{role}</SelectItem>
        ))}
      </SelectContent>
    </Select>
    <FormMessage />
  </FormItem>
);

interface FileChooserProps {
  file: File[] | null;
  setFile: (file: File[] | null) => void;
}
const FileChooser = ({ file, setFile }: FileChooserProps) => (
  <FormItem>
    <FormLabel>Select Photo</FormLabel>
    <FormControl>
      <FileUploader
        value={file}
        onValueChange={setFile}
        dropzoneOptions={dropZoneConfig}
        className="relative bg-background rounded-lg p-2"
      >
        <FileInput id="fileInput" className="outline-dashed outline-1 outline-slate-500">
          <div className="flex items-center justify-center flex-col p-8 w-full">
            <CloudUpload className='text-gray-500 w-10 h-10' />
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">JPG, JPEG, PNG, WEBP up to 4MB</p>
          </div>
        </FileInput>
        <FileUploaderContent>
          {file && file.length > 0 && (
            <FileUploaderItem index={0}>
              <Paperclip className="h-4 w-4 stroke-current" />
              <span>{file[0]?.name}</span>
            </FileUploaderItem>
          )}
        </FileUploaderContent>
      </FileUploader>
    </FormControl>
    <FormMessage />
  </FormItem>
);

const BioField = ({ field }: { field: Partial<ControllerRenderProps<{ description: string | null; }, "description">>; }) => (
  <FormItem>
    <FormLabel>Bio</FormLabel>
    <FormControl>
      <Textarea placeholder="Type Bio section of employee" className="resize-none" {...field} value={field.value ?? undefined} />
    </FormControl>
    <FormMessage />
  </FormItem>
);

const EmailField = ({ field }: { field: Partial<ControllerRenderProps<{ email: string; }, "email">>; }) => (
  <FormItem>
    <FormLabel>Email*</FormLabel>
    <FormControl>
      <Input placeholder="xxxx@xxx.xxx" className="resize-none" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
);

const NameField = ({ field }: { field: Partial<ControllerRenderProps<{ name: string; }, "name">>; }) => (
  <FormItem>
    <FormLabel>Name*</FormLabel>
    <FormControl>
      <Input placeholder="e.g. Anna" type="text" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
);

const SurnameField = ({ field }: { field: Partial<ControllerRenderProps<{ surname: string; }, "surname">>; }) => (
  <FormItem>
    <FormLabel>Surname*</FormLabel>
    <FormControl>
      <Input placeholder="e.g. Smith" type="text" {...field} />
    </FormControl>
    <FormMessage />
  </FormItem>
);