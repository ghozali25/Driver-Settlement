import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export function getSheetsClient() {
  const keyFilePath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyFilePath) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not set');
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: SCOPES,
  });

  return google.sheets({ version: 'v4', auth });
}

export async function getSheetData(spreadsheetId: string, range: string) {
  const sheets = getSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return response.data.values;
}

export async function updateSheetData(spreadsheetId: string, range: string, data: any[]) {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values: data },
  });
}