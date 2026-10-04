import type { ReactNode } from "react";
import { Role } from "@prisma/client";
import { requireRole } from "@/lib/authorization";
import { AppShell } from "./app-shell";

type AdminShellProps = { children: ReactNode; title: string; description: string; action?: ReactNode };

export async function AdminShell({ children, title, description, action }: AdminShellProps) {
  const user = await requireRole(Role.ADMIN);
  return <AppShell title={title} description={description} userName={user.name ?? user.email ?? "Admin"} userRole={user.role} action={action}>{children}</AppShell>;
}
