import { NextRequest, NextResponse } from 'next/server';

const TARGET_URL = 'https://kick-360-app-backend.onrender.com';

export async function ANY(request: NextRequest) {
  // Extract the original path from the request including any query parameters
  const { pathname, search } = new URL(request.url);
  
  // Create the destination URL. `pathname` already includes `/api/...` from Next.js
  const destinationUrl = `${TARGET_URL}${pathname}${search}`;
  
  // Clone all headers to forward them safely
  const requestHeaders = new Headers(request.headers);
  // Remove Host Header to ensure we don't trigger SSL/Hostname mismatches on the remote server
  requestHeaders.delete('host');
  requestHeaders.delete('origin'); // Also remove origin if we want the backend to act like we are direct 
  requestHeaders.delete('referer');

  try {
    const config: RequestInit = {
      method: request.method,
      headers: requestHeaders,
      redirect: 'manual', // Crucial to prevent fetch from auto-following redirects the wrong way
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      config.body = await request.arrayBuffer();
    }

    const res = await fetch(destinationUrl, config);
    
    // Check if backend returned a 301/302 Redirect
    // If Django redirects to add a slash e.g. /api/.../ -> we should pass it back directly
    if ([301, 302, 307, 308].includes(res.status)) {
      const location = res.headers.get('location');
      if (location) {
        // If the location is absolute, make it relative to our app so the browser hits our proxy again
        let newLocation = location;
        if (location.startsWith(TARGET_URL)) {
            newLocation = location.replace(TARGET_URL, '');
        }
        return NextResponse.redirect(new URL(newLocation, request.url), res.status);
      }
    }

    const responseHeaders = new Headers(res.headers);
    // Overwrite the CORS headers dynamically
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    // Remove encodings that might confuse Next.js response parsing
    responseHeaders.delete('content-encoding');
    // REMOVE content-length so Next.js correctly recalculates it for the uncompressed buffer
    responseHeaders.delete('content-length');

    // Read the response safely into a buffer to avoid chunking/stream truncation issues
    // Using arrayBuffer protects binary files (like your PDF exports) and guarantees 
    // JSON payloads don't get 'Unterminated' due to content-length mismatches.
    const bodyBuffer = await res.arrayBuffer();

    if (res.status === 204 || res.status === 205) {
      return new NextResponse(null, {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
      });
    }

    return new NextResponse(bodyBuffer, {
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy Fetch Error:', error);
    return NextResponse.json({ error: 'Proxy Error' }, { status: 500 });
  }
}

// NextJS expects specific exports for methods since App Router doesn't technically support ANY
export async function GET(req: NextRequest) { return ANY(req); }
export async function POST(req: NextRequest) { return ANY(req); }
export async function PUT(req: NextRequest) { return ANY(req); }
export async function PATCH(req: NextRequest) { return ANY(req); }
export async function DELETE(req: NextRequest) { return ANY(req); }
export async function OPTIONS(req: NextRequest) { return ANY(req); }
