import { RegisterForm } from "@/components/forms/register-form";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}