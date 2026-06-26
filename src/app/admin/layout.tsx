import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = (await cookies()).get("admin-auth");

  if (!auth) {
    redirect("/admin-login");
  }

  return <>{children}</>;
}