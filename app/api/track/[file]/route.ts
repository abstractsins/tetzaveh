// app/api/track/[file]/route.ts

export const runtime = 'nodejs'; // needed for fs
import { NextRequest } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'public', 'audio'); // or another folder

export async function GET(req: NextRequest, { params }: { params: { file: string } }) {
  const filename = path.basename(params.file); // sanitize
  const filePath = path.join(ROOT, filename);

  if (!fs.existsSync(filePath)) {
    return new Response('Not found', { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  const range = req.headers.get('range');
  const contentType = guessContentType(filename); // simple helper below

  if (!range) {
    // full response (not ideal for large files, but valid)
    const stream = fs.createReadStream(filePath);
    return new Response(stream as any, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileSize),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // Parse "bytes=start-end"
  const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
  const start = Number(startStr);
  const end = endStr ? Number(endStr) : fileSize - 1;

  if (isNaN(start) || isNaN(end) || start > end || end >= fileSize) {
    return new Response('Bad Range', { status: 416, headers: { 'Content-Range': `bytes */${fileSize}` } });
  }

  const chunkSize = end - start + 1;
  const stream = fs.createReadStream(filePath, { start, end });

  return new Response(stream as any, {
    status: 206,
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(chunkSize),
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

function guessContentType(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'mp3': return 'audio/mpeg';
    case 'wav': return 'audio/wav';
    case 'ogg': return 'audio/ogg';
    case 'm4a': return 'audio/mp4';
    case 'webm': return 'audio/webm';
    default: return 'application/octet-stream';
  }
}
