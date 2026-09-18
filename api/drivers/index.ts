import { getSheetData } from '../../google_sheets_client';

const DRIVERS_SHEET_ID = process.env.DRIVERS_SHEET_ID;
const DRIVERS_SHEET_RANGE = 'Drivers!A:G'; // id, name, status, earnings, expenses, route, lastPayment

if (!DRIVERS_SHEET_ID) {
  throw new Error('DRIVERS_SHEET_ID not set');
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const rows = await getSheetData(DRIVERS_SHEET_ID, DRIVERS_SHEET_RANGE);
    // Assuming first row is header, skip it
    const drivers = rows.slice(1).map(row => ({
      id: row[0],
      name: row[1],
      status: row[2],
      earnings: Number(row[3] || 0),
      expenses: Number(row[4] || 0),
      route: row[5] || '',
      lastPayment: row[6] || ''
    }));
    return res.status(200).json({ drivers });
  } catch (err) {
    console.error('Drivers fetch error:', err);
    return res.status(500).json({ error: 'Failed to fetch drivers' });
  }
}