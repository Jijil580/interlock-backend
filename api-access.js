const supervisorRoutes = [
  { path: '/sitework', methods: ['GET', 'POST', 'PUT', 'DELETE'], descendants: true },
  { path: '/dailyreport', methods: ['GET', 'POST', 'PUT', 'DELETE'], descendants: true },
  { path: '/workerreport', methods: ['GET', 'POST', 'PUT'], descendants: true },
  { path: '/workplan', methods: ['GET', 'POST', 'PUT'], descendants: true },
  { path: '/purchases', methods: ['GET', 'POST', 'PUT', 'DELETE'], descendants: true },
  { path: '/suppliers', methods: ['GET'] },
  { path: '/quotations', methods: ['GET', 'POST', 'PUT', 'DELETE'], descendants: true },
  { path: '/cashflow', methods: ['GET'] },
  { path: '/company-purchases', methods: ['GET', 'POST'] },
  { path: '/workers', methods: ['GET'] },
  { path: '/devices/check', methods: ['POST'] },
  { path: '/settings/branding', methods: ['GET'] },
];

function isAllowedForRole(role, method, path) {
  const routePath = path.replace(/^\/api(?=\/)/, '');
  if (routePath === '/login' || /^\/public\/quotations\/[^/]+(?:\/sign)?$/.test(routePath)) return true;
  if (role === 'admin') return true;
  if (role === 'driver') {
    return (routePath === '/driverreports' && ['GET', 'POST'].includes(method)) ||
      (routePath === '/devices/check' && method === 'POST');
  }
  if (role === 'supervisor') {
    if (/\/completion\/review$/.test(routePath)) return false;
    return supervisorRoutes.some(route => (
      (routePath === route.path || (route.descendants && routePath.startsWith(`${route.path}/`))) &&
      route.methods.includes(method)
    ));
  }
  if (role === 'user') {
    const adminOnly = ['/users', '/devices', '/report-audits', '/admin-cash-transfers'];
    return !adminOnly.some(prefix => routePath === prefix || routePath.startsWith(`${prefix}/`));
  }
  return false;
}

module.exports = { isAllowedForRole };
