import { getRsmAuth } from "@/lib/rsm-auth";

export default async function RsmProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getRsmAuth();

  return <>{children}</>;
}
