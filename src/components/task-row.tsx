import type { InferSelectModel } from "drizzle-orm";
import type { tasks } from "@/db/schema";

type Task = InferSelectModel<typeof tasks>;

export function TaskRow({ task }: { task: Task }) {
  const date = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(task.updatedAt);

  return (
    <article className={`task-row${task.completed ? " task-row-completed" : ""}`}>
      <form
        action={`/api/forms/tasks/${encodeURIComponent(task.id)}/toggle-completion`}
        className="task-completion-form"
        method="post"
      >
        <button
          aria-label={
            task.completed
              ? `Mark ${task.title} as incomplete`
              : `Mark ${task.title} as completed`
          }
          aria-pressed={task.completed}
          className="task-completion-toggle"
          title={task.completed ? "Mark as incomplete" : "Mark as completed"}
          type="submit"
        >
          <span aria-hidden="true">✓</span>
        </button>
      </form>
      <div className="task-content">
        <h2 className="task-title">{task.title}</h2>
        {task.description ? (
          <p className="task-description">{task.description}</p>
        ) : null}
        <div className="task-meta">
          <span className="task-priority">Priority {task.priority}</span>
          {task.dueDate ? (
            <span className="task-due-date">
              Due{" "}
              <time dateTime={task.dueDate}>
                {new Intl.DateTimeFormat("en", {
                  dateStyle: "medium",
                  timeZone: "UTC",
                }).format(new Date(`${task.dueDate}T00:00:00Z`))}
              </time>
            </span>
          ) : null}
          <time className="task-date" dateTime={task.updatedAt.toISOString()}>
            Updated {date}
          </time>
        </div>
      </div>
      <div className="task-actions" aria-label={`Actions for ${task.title}`}>
        <a href={`/tasks/${encodeURIComponent(task.id)}/edit`}>Edit</a>
        <a href={`/tasks/${encodeURIComponent(task.id)}/delete`}>Delete</a>
      </div>
    </article>
  );
}