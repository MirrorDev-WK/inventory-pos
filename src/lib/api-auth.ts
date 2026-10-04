import type { Role } from "@prisma/client";
import { auth } from "@/auth";

export async function getApiUser(requiredRoles: Role[]) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Authentication required.", status: 401 } as const;
  if (!requiredRoles.includes(session.user.role)) return { error: "You do not have permission for this action.", status: 403 } as const;
  return { user: session.user } as const;
}
