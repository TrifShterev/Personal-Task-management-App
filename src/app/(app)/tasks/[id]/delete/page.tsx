import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTask } from "@/lib/tasks";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Delete task" };

export default async function DeleteTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const task = await getTask(session.user.id, id);

  if (!task) {
    notFound();
  }

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <p className="eyebrow">This cannot be undone</p>
          <h1>Delete task</h1>
        </div>
      </div>
      <section className="confirm-panel">
        <p>
          Delete <strong>{task.title}</strong>? The task and its description will
          be permanently removed.
        </p>
        <div className="form-actions">
          <form
            action={`/api/forms/tasks/${encodeURIComponent(task.id)}/delete`}
            method="post"
          >
            <button className="button button-danger" type="submit">
              Delete task
            </button>
          </form>
          <a className="button button-secondary" href="/tasks">
            Keep task
          </a>
        </div>
      </section>
    </main>
  );
}