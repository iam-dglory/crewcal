import { Suspense } from "react";
import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background px-4">
      <Suspense>
        <SignupForm />
      </Suspense>
    </div>
  );
}
