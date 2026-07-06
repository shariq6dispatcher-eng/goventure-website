import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function RsmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = (await cookies()).get("rsm-auth");

  if (!auth) {
    redirect("/RSM/login");
  }

  return <>{children}</>;
}