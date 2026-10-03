import type { Metadata } from "next";
import { Notice } from "@/components/notice";
import { TaskRow } from "@/components/task-row";
import { listTasks } from "@/lib/tasks";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Your tasks" };

function parsePage(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; notice?: string }>;
}) {
  const session = await requireSession();
  const params = await searchParams;
  const result = await listTasks(session.user.id, parsePage(params.page));

  return (
    <main className="page-shell">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Your private workspace</p>
          <h1>Tasks</h1>
          <p className="page-intro">Keep the next useful thing within reach.</p>
        </div>
        <a className="button" href="/tasks/new">
          <span aria-hidden="true">+</span> New task
        </a>
      </div>

      <Notice value={params.notice} />

      <div className="list-summary">
        <span>
          {result.total} {result.total === 1 ? "task" : "tasks"}
        </span>
        {result.total > 0 ? (
          <span>
            Page {result.page} of {result.pageCount}
          </span>
        ) : null}
      </div>

      {result.tasks.length ? (
        <>
          <div className="task-list">
            {result.tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
          {result.pageCount > 1 ? (
            <nav className="pagination" aria-label="Task pages">
              {result.page > 1 ? (
                <a href={`/tasks?page=${result.page - 1}`}>← Newer tasks</a>
              ) : (
                <span />
              )}
              {result.page < result.pageCount ? (
                <a href={`/tasks?page=${result.page + 1}`}>Older tasks →</a>
              ) : null}
            </nav>
          ) : null}
        </>
      ) : (
        <section className="empty-state">
          <h2>A clear page to start</h2>
          <p>Your tasks will appear here, newest first.</p>
          <a className="button" href="/tasks/new">
            Create your first task
          </a>
        </section>
      )}
    </main>
  );
}