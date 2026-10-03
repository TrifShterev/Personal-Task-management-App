import type { TaskInput } from "@/lib/validation";

type TaskFormProps = {
  action: string;
  submitLabel: string;
  task?: TaskInput;
  error?: string;
};

export function TaskForm({ action, submitLabel, task, error }: TaskFormProps) {
  return (
    <div className="form-panel">
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <form action={action} method="post">
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={120}
            autoComplete="off"
            defaultValue={task?.title ?? ""}
            placeholder="Give this task a clear name"
          />
          <p className="field-hint">Up to 120 characters.</p>
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            maxLength={10000}
            defaultValue={task?.description ?? ""}
            placeholder="Add the details you will want to remember"
          />
          <p className="field-hint">Optional. Up to 10,000 characters.</p>
        </div>
        <div className="form-actions">
          <button className="button" type="submit">
            {submitLabel}
          </button>
          <a className="button button-secondary" href="/tasks">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}