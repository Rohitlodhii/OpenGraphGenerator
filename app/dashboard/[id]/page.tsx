import DashboardClient from "@/components/workspace/DashboardClient";

export default async function DashboardProject({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DashboardClient projectId={id} />;
}
