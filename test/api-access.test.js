const test = require('node:test');
const assert = require('node:assert/strict');
const { isAllowedForRole } = require('../api-access');

test('admin and office roles retain their intended access while user management is admin-only', () => {
  assert.equal(isAllowedForRole('admin', 'GET', '/api/users'), true);
  assert.equal(isAllowedForRole('user', 'GET', '/api/sitework'), true);
  assert.equal(isAllowedForRole('user', 'GET', '/api/users'), false);
  assert.equal(isAllowedForRole('user', 'PUT', '/api/devices/device-id'), false);
});

test('supervisors are restricted to their work routes and cannot reach nested payroll/admin routes', () => {
  assert.equal(isAllowedForRole('supervisor', 'POST', '/api/sitework'), true);
  assert.equal(isAllowedForRole('supervisor', 'PUT', '/api/sitework/site-id/payments/0'), true);
  assert.equal(isAllowedForRole('supervisor', 'GET', '/api/workers'), true);
  assert.equal(isAllowedForRole('supervisor', 'GET', '/api/workers/weekly-salary'), false);
  assert.equal(isAllowedForRole('supervisor', 'GET', '/api/company-expenses'), false);
  assert.equal(isAllowedForRole('supervisor', 'POST', '/api/sitework/site-id/completion/review'), false);
  assert.equal(isAllowedForRole('supervisor', 'GET', '/api/sales'), false);
});

test('drivers can only read or submit their own driver reports and check device approval', () => {
  assert.equal(isAllowedForRole('driver', 'GET', '/api/driverreports'), true);
  assert.equal(isAllowedForRole('driver', 'POST', '/api/driverreports'), true);
  assert.equal(isAllowedForRole('driver', 'POST', '/api/devices/check'), true);
  assert.equal(isAllowedForRole('driver', 'GET', '/api/driverreports/record-id'), false);
  assert.equal(isAllowedForRole('driver', 'GET', '/api/cashflow'), false);
});

test('only quotation share links are public', () => {
  assert.equal(isAllowedForRole('unknown', 'GET', '/api/public/quotations/share-token'), true);
  assert.equal(isAllowedForRole('unknown', 'GET', '/api/public/users'), false);
});
