import { submitAuthForm } from "@/lib/form-routes";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return submitAuthForm(request, "sign-out", {}, "/sign-in", "/sign-in");
}