import { google } from 'googleapis';
import { getSheetData, updateSheetData } from '../../google_sheets_client';

const COUNTERS_SHEET_ID = process.env.COUNTERS_SHEET_ID;
const COUNTERS_SHEET_RANGE = 'Counters!A:B'; // name, value

if (!COUNTERS_SHEET_ID) {
  throw new Error('COUNTERS_SHEET_ID not set');
}

export async function getNextId(counterName: string): Promise<number> {
  const rows = await getSheetData(COUNTERS_SHEET_ID, COUNTERS_SHEET_RANGE);
  const header = rows[0];
  const idx = header.findIndex(col => col === counterName);
  if (idx === -1) throw new Error(`Counter ${counterName} not found`);
  const current = Number(rows[1][idx] || 0);
  const next = current + 1;
  // Update sheet value
  const updatedRow = rows[1];
  updatedRow[idx] = next.toString();
  await updateSheetData(COUNTERS_SHEET_ID, COUNTERS_SHEET_RANGE, rows);
  return next;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { counterName } = req.body;
  if (!counterName) {
    return res.status(400).json({ error: 'counterName required' });
  }
  try {
    const nextId = await getNextId(counterName);
    return res.status(200).json({ nextId });
  } catch (err) {
    console.error('Counter error:', err);
    return res.status(500).json({ error: err.message });
  }
}
