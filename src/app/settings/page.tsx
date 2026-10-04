import { AdminShell } from "@/components/layout/admin-shell";
import { StoreSettingsForm } from "@/features/settings/components/store-settings-form";
import { getStoreSettings } from "@/features/settings/store-settings-service";
import { requireRole } from "@/lib/authorization";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireRole(Role.ADMIN);
  const settings = await getStoreSettings();
  if (!settings) throw new Error("Store settings have not been seeded.");
  return <AdminShell title="Settings" description="Store details appear on every receipt."><section className="content-card form-card"><StoreSettingsForm initialValues={settings} /></section></AdminShell>;
}
