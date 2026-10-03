import type { InferSelectModel } from "drizzle-orm";
import type { tasks } from "@/db/schema";

type Task = InferSelectModel<typeof tasks>;

export function TaskRow({ task }: { task: Task }) {
  const date = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(task.updatedAt);

  return (
    <article className="task-row">
      <div>
        <h2 className="task-title">{task.title}</h2>
        {task.description ? (
          <p className="task-description">{task.description}</p>
        ) : null}
        <time className="task-date" dateTime={task.updatedAt.toISOString()}>
          Updated {date}
        </time>
      </div>
      <div className="task-actions" aria-label={`Actions for ${task.title}`}>
        <a href={`/tasks/${encodeURIComponent(task.id)}/edit`}>Edit</a>
        <a href={`/tasks/${encodeURIComponent(task.id)}/delete`}>Delete</a>
      </div>
    </article>
  );
}