import { redirectTo, requestSession, sameOriginError } from "@/lib/form-routes";
import { deleteTask } from "@/lib/tasks";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const originError = sameOriginError(request);

  if (originError) {
    return originError;
  }

  const session = await requestSession(request);

  if (!session) {
    return redirectTo(request, "/sign-in");
  }

  const { id } = await context.params;
  const deleted = await deleteTask(session.user.id, id);
  return redirectTo(
    request,
    deleted ? "/tasks?notice=deleted" : "/tasks?notice=missing",
  );
}