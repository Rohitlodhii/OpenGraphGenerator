import DashboardClient from "@/components/workspace/DashboardClient";

export default async function DashboardNew({
  searchParams,
}: {
  searchParams?: Promise<{ template?: string }>;
}) {
  const params = await searchParams;
  return <DashboardClient templateId={params?.template} />;
}
