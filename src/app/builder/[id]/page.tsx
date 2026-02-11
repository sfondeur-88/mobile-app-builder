import { getConfigurationById } from "@/lib/api/getConfigurationById";
import { notFound } from "next/navigation";
import BuilderClient from "../BuilderClient";

export default async function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const configId = parseInt(id);

  if (isNaN(configId)) {
    notFound();
  }

  const config = await getConfigurationById(configId);

  if (!config) {
    notFound();
  }

  return (<BuilderClient initialConfig={config} />);
}