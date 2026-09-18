import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/drive'];

export function getDriveClient() {
  const keyFilePath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyFilePath) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY not set');
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: SCOPES,
  });

  return google.drive({ version: 'v3', auth });
}

export async function listFiles(query = '') {
  const drive = getDriveClient();
  const res = await drive.files.list({
    q: query,
    fields: 'files(id, name, mimeType, modifiedTime, size)',
    pageSize: 100,
  });
  return res.data.files;
}

export async function getFileMetadata(fileId) {
  const drive = getDriveClient();
  const res = await drive.files.get({
    fileId,
    fields: 'id, name, mimeType, modifiedTime, size, parents',
  });
  return res.data;
}

export async function downloadFile(fileId) {
  const drive = getDriveClient();
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' }
  );
  return res.data;
}

export async function uploadFile(fileMetadata, media) {
  const drive = getDriveClient();
  const res = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  });
  return res.data;
}

export async function deleteFile(fileId) {
  const drive = getDriveClient();
  await drive.files.delete({ fileId });
}