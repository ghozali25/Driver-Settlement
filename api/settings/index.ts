import { getSheetData, updateSheetData } from '../../google_sheets_client';

const SETTINGS_SHEET_ID = process.env.SETTINGS_SHEET_ID;
const SETTINGS_SHEET_RANGE = 'Settings!A:B'; // key, value

if (!SETTINGS_SHEET_ID) {
  throw new Error('SETTINGS_SHEET_ID not set');
}

export async function getSetting(key: string): Promise<string | null> {
  const rows = await getSheetData(SETTINGS_SHEET_ID, SETTINGS_SHEET_RANGE);
  const idx = rows.findIndex(row => row[0] === key);
  return idx !== -1 ? rows[idx][1] : null;
}

export async function setSetting(key: string, value: string) {
  const rows = await getSheetData(SETTINGS_SHEET_ID, SETTINGS_SHEET_RANGE);
  const idx = rows.findIndex(row => row[0] === key);
  if (idx !== -1) {
    rows[idx][1] = value;
  } else {
    rows.push([key, value]);
  }
  await updateSheetData(SETTINGS_SHEET_ID, SETTINGS_SHEET_RANGE, rows);
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: 'key required' });
    const value = await getSetting(key as string);
    return res.status(200).json({ key, value });
  }
  if (req.method === 'POST') {
    const { key, value } = req.body;
    if (!key || value === undefined) return res.status(400).json({ error: 'key and value required' });
    await setSetting(key, value);
    return res.status(200).json({ key, value });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
