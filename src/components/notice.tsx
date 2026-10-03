const notices: Record<string, string> = {
  welcome: "Your account is ready. Start with one task and build from there.",
  created: "Task created.",
  updated: "Task updated.",
  deleted: "Task deleted.",
  missing: "That task is no longer available.",
};

export function Notice({ value }: { value?: string }) {
  const message = value ? notices[value] : undefined;

  return message ? (
    <p className="notice" role="status">
      {message}
    </p>
  ) : null;
}