const securityHeaders = {
  'Content-Security-Policy': `
    default-src 'self';
    connect-src 'self' https://api.openai.com https://customsearch.googleapis.com;
    img-src 'self' https: data:;
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
  `.replace(/\s+/g, ' ').trim()
};

export default securityHeaders; 