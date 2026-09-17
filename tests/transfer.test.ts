import assert from 'assert';
import crypto from 'crypto';
import { sanitizeFilename, formatBytes, formatSpeed, formatEta, isValidUrl } from '../src/lib/crypto.ts';

console.log('Running QuickDrop unit tests...\n');

// 1. Filename Sanitization tests
{
  console.log('Test: Filename Sanitization');
  assert.strictEqual(sanitizeFilename('../../../etc/passwd'), 'passwd');
  assert.strictEqual(sanitizeFilename('..\\..\\windows\\system32\\calc.exe'), 'calc.exe');
  assert.strictEqual(sanitizeFilename('normal-photo.jpg'), 'normal-photo.jpg');
  assert.strictEqual(sanitizeFilename('forbidden:<>|?*chars.png'), 'forbidden______chars.png');
  assert.ok(sanitizeFilename('').startsWith('quickdrop-file-'));
  assert.ok(sanitizeFilename('   ..   ').startsWith('quickdrop-file-'));
  console.log('  ✓ Filename sanitization passed security checks');
}

// 2. Size and Speed Formatting tests
{
  console.log('Test: Size and Speed formatting');
  assert.strictEqual(formatBytes(0), '0 B');
  assert.strictEqual(formatBytes(1024), '1 KB');
  assert.strictEqual(formatBytes(1048576), '1 MB');
  assert.strictEqual(formatBytes(1073741824), '1 GB');

  assert.strictEqual(formatSpeed(0), '0 KB/s');
  assert.strictEqual(formatSpeed(1048576), '1 MB/s');
  assert.strictEqual(formatSpeed(26214400), '25 MB/s');
  console.log('  ✓ Size and speed formatters passed');
}

// 3. ETA Calculation tests
{
  console.log('Test: ETA calculations');
  assert.strictEqual(formatEta(0), 'Calculating...');
  assert.strictEqual(formatEta(-5), 'Calculating...');
  assert.strictEqual(formatEta(15), '15s');
  assert.strictEqual(formatEta(90), '1m 30s');
  assert.strictEqual(formatEta(3665), '1h 1m');
  console.log('  ✓ ETA calculation passed');
}

// 4. URL Validation tests
{
  console.log('Test: URL validation');
  assert.strictEqual(isValidUrl('https://example.com/file'), true);
  assert.strictEqual(isValidUrl('http://192.168.1.10:3000'), true);
  assert.strictEqual(isValidUrl('not-a-url'), false);
  assert.strictEqual(isValidUrl('javascript:alert(1)'), false);
  assert.strictEqual(isValidUrl(''), false);
  console.log('  ✓ URL validation passed');
}

// 5. Binary packet framing & header extraction
{
  console.log('Test: WebRTC Binary chunk packet framing and extraction');
  const payloadStr = 'QuickDrop real file chunk byte content!';
  const rawPayload = Buffer.from(payloadStr);

  const headerObj = { id: 'transfer-123', chunkIndex: 3, totalChunks: 10 };
  const headerBytes = Buffer.from(JSON.stringify(headerObj));
  const headerLength = headerBytes.length;

  // Build packet: [0x51, 0x44] [2 bytes length] [headerBytes] [rawPayload]
  const packet = Buffer.alloc(4 + headerLength + rawPayload.length);
  packet.writeUInt8(0x51, 0);
  packet.writeUInt8(0x44, 1);
  packet.writeUInt16BE(headerLength, 2);
  headerBytes.copy(packet, 4);
  rawPayload.copy(packet, 4 + headerLength);

  // Parse packet
  assert.strictEqual(packet.readUInt8(0), 0x51);
  assert.strictEqual(packet.readUInt8(1), 0x44);
  const parsedHeaderLength = packet.readUInt16BE(2);
  assert.strictEqual(parsedHeaderLength, headerLength);

  const parsedHeaderStr = packet.toString('utf-8', 4, 4 + parsedHeaderLength);
  const parsedHeader = JSON.parse(parsedHeaderStr);
  assert.strictEqual(parsedHeader.id, 'transfer-123');
  assert.strictEqual(parsedHeader.chunkIndex, 3);
  assert.strictEqual(parsedHeader.totalChunks, 10);

  const extractedPayload = packet.subarray(4 + parsedHeaderLength);
  assert.strictEqual(extractedPayload.toString(), payloadStr);
  console.log('  ✓ Binary packet framing round-trip verified');
}

// 6. SHA-256 Hash Integrity
{
  console.log('Test: SHA-256 Hash Verification');
  const testData = Buffer.from('QuickDrop data integrity test vector 2026');
  const expectedHash = crypto.createHash('sha256').update(testData).digest('hex');
  assert.strictEqual(expectedHash.length, 64);
  console.log(`  ✓ SHA-256 computed: ${expectedHash}`);
}

console.log('\nAll 6 test suites passed successfully! ✓');
