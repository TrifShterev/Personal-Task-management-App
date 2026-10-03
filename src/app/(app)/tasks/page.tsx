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

function pageHref(page: number, query: string) {
  const params = new URLSearchParams({ page: String(page) });

  if (query) {
    params.set("q", query);
  }

  return `/tasks?${params.toString()}`;
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; notice?: string; q?: string }>;
}) {
  const session = await requireSession();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().slice(0, 120) : "";
  const result = await listTasks(
    session.user.id,
    parsePage(params.page),
    query,
  );

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

      <form className="task-search" action="/tasks" method="get" role="search">
        <label htmlFor="task-query">Search tasks</label>
        <div className="task-search-controls">
          <input
            id="task-query"
            name="q"
            type="search"
            maxLength={120}
            defaultValue={result.query}
            placeholder="Search titles and descriptions"
          />
          <button className="button" type="submit">
            Search
          </button>
          {result.query ? (
            <a className="quiet-link" href="/tasks">
              Clear
            </a>
          ) : null}
        </div>
      </form>

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
                <a href={pageHref(result.page - 1, result.query)}>
                  ← Newer tasks
                </a>
              ) : (
                <span />
              )}
              {result.page < result.pageCount ? (
                <a href={pageHref(result.page + 1, result.query)}>
                  Older tasks →
                </a>
              ) : null}
            </nav>
          ) : null}
        </>
      ) : (
        <section className="empty-state">
          <h2>{result.query ? "No matching tasks" : "A clear page to start"}</h2>
          <p>
            {result.query
              ? `No tasks match "${result.query}". Try another search.`
              : "Your tasks will appear here, newest first."}
          </p>
          {result.query ? (
            <a className="button button-secondary" href="/tasks">
              Clear search
            </a>
          ) : (
            <a className="button" href="/tasks/new">
              Create your first task
            </a>
          )}
        </section>
      )}
    </main>
  );
}