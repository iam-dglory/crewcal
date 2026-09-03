import { requireUser } from "@/lib/auth";
import { CreateWorkspaceForm } from "@/components/CreateWorkspaceForm";

export default async function NewWorkspacePage() {
  await requireUser();

  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Set up your workspace</h1>
          <p className="mt-1 text-sm text-muted">
            This is where you&apos;ll plan your content calendar and bring in your team.
          </p>
        </div>
        <CreateWorkspaceForm />
      </div>
    </div>
  );
}
