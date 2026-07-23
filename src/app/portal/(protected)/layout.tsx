import { getCustomerPortalAuth } from "@/lib/customer-portal-auth";
import PortalTopBar from "@/components/portal/PortalTopBar";

export default async function CustomerPortalProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCustomerPortalAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      <PortalTopBar name={session.name} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
