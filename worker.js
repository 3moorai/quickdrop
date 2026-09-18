export default {
  async fetch(request, env) {
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response('QuickDrop Worker Running', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  },
};
