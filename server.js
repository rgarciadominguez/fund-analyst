import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY || KEY.includes('tu-key')) {
  console.log('⚠️  Crea un archivo .env con tu ANTHROPIC_API_KEY (ver .env.example)');
  console.log('   El dashboard funciona sin key, pero el chat no.');
}
app.post('/api/claude', async (req, res) => {
  try {
    console.log(`[${new Date().toLocaleTimeString()}] → API Claude...`);
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(req.body),
    });
    const data = await r.json();
    console.log(`[${new Date().toLocaleTimeString()}] ✓ OK`);
    res.json(data);
  } catch (e) {
    console.error('✗', e.message);
    res.status(500).json({ error: e.message });
  }
});
app.listen(3001, () => {
  console.log('\n🚀 Proxy API: http://localhost:3001');
  console.log('📊 Dashboard: http://localhost:5173\n');
});
