import { redirectTo, requestSession, sameOriginError } from "@/lib/form-routes";
import { toggleTaskCompletion } from "@/lib/tasks";

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
  await toggleTaskCompletion(session.user.id, id);
  return redirectTo(request, "/tasks");
}