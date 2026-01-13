#!/usr/bin/env node
'use strict';

/**
 * Seed the DB using the existing scripts/seed.js, then verify core endpoints.
 *
 * This is NOT a test suite; it's a lightweight operational verification script.
 *
 * Usage:
 *   cd express_backend
 *   node scripts/verifyEndpoints.js
 *
 * Expected env:
 *   - MONGO_URI / MONGODB_URI / MONGO_URL (already configured by the user)
 *   - JWT_SECRET (optional; defaults to dev-secret)
 */

require('dotenv').config();

const http = require('http');
const path = require('path');
const { execFileSync } = require('child_process');

const mongoose = require('mongoose');
const app = require('../src/app');
const { connectToMongo } = require('../src/db/mongo');

function requestJson({ method, port, urlPath, headers = {}, body }) {
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? null : Buffer.from(JSON.stringify(body), 'utf8');

    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: urlPath,
        method,
        headers: {
          ...(payload
            ? {
                'Content-Type': 'application/json',
                'Content-Length': payload.length,
              }
            : {}),
          ...headers,
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          let json = null;
          try {
            json = text ? JSON.parse(text) : null;
          } catch {
            // Not JSON (shouldn't happen in this API, but keep robust).
          }

          resolve({
            status: res.statusCode,
            headers: res.headers,
            text,
            json,
          });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function assert2xx(label, res) {
  if (!res || typeof res.status !== 'number' || res.status < 200 || res.status >= 300) {
    const details = res
      ? `status=${res.status}\nbody=${res.text || JSON.stringify(res.json)}`
      : 'no response';
    throw new Error(`[FAIL] ${label}\n${details}`);
  }
}

async function main() {
  console.log('== Backend verification: seed DB and check endpoints ==');

  // 1) Seed database using existing script.
  console.log('\n[1/3] Seeding database via scripts/seed.js ...');
  execFileSync(process.execPath, [path.join(__dirname, 'seed.js')], {
    stdio: 'inherit',
    env: process.env,
  });

  // 2) Start server (in-process) and connect to Mongo.
  console.log('\n[2/3] Starting API server (ephemeral port) ...');
  const { uri } = await connectToMongo();
  console.log(`Connected to MongoDB for verification: ${uri}`);

  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const port = server.address().port;
  console.log(`Server listening on http://127.0.0.1:${port}`);

  try {
    // 3) Verify core endpoints
    console.log('\n[3/3] Verifying endpoints ...');

    const health = await requestJson({ method: 'GET', port, urlPath: '/health' });
    assert2xx('GET /health', health);

    const email = `verify_${Date.now()}@example.com`;
    const password = 'password123';

    const register = await requestJson({
      method: 'POST',
      port,
      urlPath: '/api/auth/register',
      body: { email, password, displayName: 'Verify User' },
    });
    assert2xx('POST /api/auth/register', register);

    const login = await requestJson({
      method: 'POST',
      port,
      urlPath: '/api/auth/login',
      body: { email, password },
    });
    assert2xx('POST /api/auth/login', login);

    const token = login.json?.token;
    if (!token) {
      throw new Error(`[FAIL] POST /api/auth/login did not return token.\nbody=${login.text}`);
    }

    const labs = await requestJson({ method: 'GET', port, urlPath: '/api/labs' });
    assert2xx('GET /api/labs', labs);

    const firstLab = Array.isArray(labs.json?.labs) ? labs.json.labs[0] : null;
    const labId = firstLab?._id || firstLab?.id;
    if (!labId) {
      throw new Error(`[FAIL] GET /api/labs returned no labs to test.\nbody=${labs.text}`);
    }

    const labDetail = await requestJson({ method: 'GET', port, urlPath: `/api/labs/${labId}` });
    assert2xx('GET /api/labs/:id', labDetail);

    const hints = await requestJson({ method: 'GET', port, urlPath: `/api/labs/${labId}/hints` });
    assert2xx('GET /api/labs/:id/hints', hints);

    const submit = await requestJson({
      method: 'POST',
      port,
      urlPath: `/api/labs/${labId}/submit`,
      headers: { Authorization: `Bearer ${token}` },
      body: { answer: 'not-the-right-answer', hintsUsed: 0 },
    });
    assert2xx('POST /api/labs/:id/submit', submit);

    console.log('\n[OK] All required endpoints responded with non-error 2xx responses.');
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
