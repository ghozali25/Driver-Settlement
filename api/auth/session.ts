import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { getSheetData, updateSheetData } from '../../google_sheets_client';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const SESSION_SECRET = process.env.SESSION_SECRET;
const USERS_SHEET_ID = process.env.USERS_SHEET_ID;
const USERS_SHEET_RANGE = 'Users!A:E'; // Assuming columns: id, email, name, role, createdAt

if (!GOOGLE_CLIENT_ID || !SESSION_SECRET || !USERS_SHEET_ID) {
  throw new Error('Missing required environment variables for auth');
}

const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: 'ID token required' });
  }

  try {
    // Verify Google ID token
    const ticket = await oauth2Client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    // Check required claims
    if (!payload.email_verified) {
      return res.status(401).json({ error: 'Email not verified' });
    }

    const { email, name, sub: googleId } = payload;

    // Find or create user in Users sheet
    const users = await getSheetData(USERS_SHEET_ID, USERS_SHEET_RANGE);
    let user = users.find(row => row[1] === email); // email in column B

    if (!user) {
      // Create new user with DRIVER role by default
      const newUser = [Date.now().toString(), email, name, 'DRIVER', new Date().toISOString()];
      await updateSheetData(USERS_SHEET_ID, USERS_SHEET_RANGE, [...users, newUser]);
      user = newUser;
    }

    // Generate session JWT
    const sessionToken = jwt.sign(
      { userId: user[0], email: user[1], role: user[3] },
      SESSION_SECRET,
      { expiresIn: '7d' }
    );

    // Set secure HTTP-only cookie
    res.setHeader('Set-Cookie', `session=${sessionToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`);

    return res.status(200).json({
      user: { id: user[0], email: user[1], name: user[2], role: user[3] }
    });
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}