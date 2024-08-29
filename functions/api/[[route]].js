import { IttyRouter, error, json, withParams } from 'itty-router'

const router = IttyRouter()

router
  .all('*', withParams)
  .get('/json', () => ({ foo: 'bar', array: [1,2,3] }))
  .get('/params/:id', ({ id }) => id)
  .all('*', () => error(404))

export default {
  fetch: (request, ...args) => 
    router
      .fetch(request, ...args)
      .then(json)
      .catch(error)
}

router.post('/rsvp', async (request, env) => {
  const { name, attendance } = await request.json();
  const stmt = env.DB.prepare('INSERT INTO rsvps (name, attendance) VALUES (?, ?)').bind(name, attendance);
  await stmt.run();
  return new Response(JSON.stringify({ message: 'RSVP saved successfully' }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

router.get('/rsvps', async (request, env) => {
  const { results } = await env.DB.prepare('SELECT * FROM rsvps').all();
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  });
});

router.get('/export', async (request, env) => {
  const { results } = await env.DB.prepare('SELECT name, attendance FROM rsvps').all();
  const csv = results.map(row => `${row.name},${row.attendance}`).join('\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=rsvps.csv'
    }
  });
});

export function onRequest(context) {
  return router.handle(context.request, context.env);
}