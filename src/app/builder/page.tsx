import { getConfigurationById } from "@/lib/api/getConfigurationById";
import { notFound } from "next/navigation";
import BuilderClient from "./BuilderClient";

export default async function BuilderPage() {
  const config = await getConfigurationById(1);

  if (!config) {
    notFound();
  }

  return (<BuilderClient initialConfig={config} />);
}