import { redirectTo, submitAuthForm } from "@/lib/form-routes";
import { signUpSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const input = signUpSchema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    password: form.get("password"),
  });

  if (!input.success) {
    return redirectTo(request, "/sign-up?error=invalid");
  }

  return submitAuthForm(
    request,
    "sign-up/email",
    input.data,
    "/tasks?notice=welcome",
    "/sign-up?error=account",
  );
}