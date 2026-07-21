export type ItemOption = {
  itemId: number;
  itemName: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export async function getAllItemNames(): Promise<ItemOption[]> {
  const response = await fetch(`${API_BASE_URL}/items/names`);

  if (!response.ok) throw new Error(`Failed to load item names ${response.status}`);

  const itemOption = (await response.json()) as ItemOption[];

  return itemOption
}
