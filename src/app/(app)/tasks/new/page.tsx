import type { Metadata } from "next";
import { TaskForm } from "@/components/task-form";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "New task" };

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireSession();
  const { error } = await searchParams;

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Capture it while it is clear</p>
          <h1>New task</h1>
          <p className="page-intro">A title and description are all you need.</p>
        </div>
      </div>
      <div className="form-page">
        <TaskForm
          action="/api/forms/tasks"
          submitLabel="Create task"
          error={error === "invalid" ? "Add a title and check the field lengths." : undefined}
        />
      </div>
    </main>
  );
}