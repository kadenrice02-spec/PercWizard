import express from 'express';
import cors from 'cors';
import * as cron from 'node-cron';
import dotenv from 'dotenv';
import { fetchAndCacheSEC } from './jobs/fetchSEC.js';
import { fetchAndCacheContracts } from './jobs/fetchContracts.js';
import { fetchAndCacheCongress } from './jobs/fetchCongress.js';
import { getCache } from './utils/cache.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// LIVE DATA ENDPOINTS
// ============================================

// SEC Filings
app.get('/api/signals/sec', async (req, res) => {
  try {
    const data = getCache('sec-filings');
    res.json({ 
      source: 'SEC EDGAR',
      lastUpdated: new Date(),
      filings: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch SEC data' });
  }
});

// Government Contracts
app.get('/api/signals/contracts', async (req, res) => {
  try {
    const data = getCache('contracts');
    res.json({ 
      source: 'SAM.gov',
      lastUpdated: new Date(),
      contracts: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contract data' });
  }
});

// Congress Hearings & Actions
app.get('/api/signals/congress', async (req, res) => {
  try {
    const data = getCache('congress-hearings');
    res.json({ 
      source: 'Congress.gov',
      lastUpdated: new Date(),
      hearings: data || [],
      count: data?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Congress data' });
  }
});

// Combined Live Feed
app.get('/api/signals/live-feed', async (req, res) => {
  try {
    const sec = getCache('sec-filings') || [];
    const contracts = getCache('contracts') || [];
    const congress = getCache('congress-hearings') || [];

    const combined = [
      ...sec.map((f: any) => ({ ...f, type: 'SEC', severity: 'high' })),
      ...contracts.map((c: any) => ({ ...c, type: 'CONTRACT', severity: 'medium' })),
      ...congress.map((h: any) => ({ ...h, type: 'CONGRESS', severity: 'medium' }))
    ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json({ 
      feed: combined.slice(0, 50),
      total: combined.length,
      lastUpdated: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch live feed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// ============================================
// AUTOMATED DATA REFRESH JOBS
// ============================================

// Refresh SEC data every 4 hours
cron.schedule('0 */4 * * *', async () => {
  console.log('🔄 Refreshing SEC filings...');
  await fetchAndCacheSEC();
});

// Refresh contracts every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('🔄 Refreshing government contracts...');
  await fetchAndCacheContracts();
});

// Refresh Congress data every 2 hours
cron.schedule('0 */2 * * *', async () => {
  console.log('🔄 Refreshing Congress hearings...');
  await fetchAndCacheCongress();
});

// Initial data fetch on startup
async function initializeData() {
  console.log('📊 Initializing data sources...');
  try {
    await fetchAndCacheSEC();
    await fetchAndCacheContracts();
    await fetchAndCacheCongress();
    console.log('✅ All data sources initialized');
  } catch (error) {
    console.error('⚠️ Error initializing data:', error);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 GovSignal Backend running on http://localhost:${PORT}`);
  await initializeData();
});
