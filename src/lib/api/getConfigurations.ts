import { Configuration } from "../db/schema";

type GetConfigurationsResponse = Configuration[];

/**
 * 
 * @returns 
 */
export async function getConfigurations() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/configurations`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch configurations');
  }

  const data = await res.json();
  return data.data;
}