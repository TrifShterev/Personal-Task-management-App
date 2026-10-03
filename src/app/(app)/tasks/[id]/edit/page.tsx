import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TaskForm } from "@/components/task-form";
import { getTask } from "@/lib/tasks";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Edit task" };

export default async function EditTaskPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const task = await getTask(session.user.id, id);

  if (!task) {
    notFound();
  }

  const { error } = await searchParams;

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Make a change</p>
          <h1>Edit task</h1>
          <p className="page-intro">Update the details and keep moving.</p>
        </div>
      </div>
      <div className="form-page">
        <TaskForm
          action={`/api/forms/tasks/${encodeURIComponent(task.id)}/update`}
          submitLabel="Save changes"
          task={task}
          error={error === "invalid" ? "Add a title and check the field lengths." : undefined}
        />
      </div>
    </main>
  );
}