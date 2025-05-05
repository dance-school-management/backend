import { LoginForm } from "@/components/forms/login-form";

export default function Page() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}