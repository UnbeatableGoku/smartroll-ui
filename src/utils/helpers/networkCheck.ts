/**
 * Utility to measure network download speed in Mbps by downloading a test file.
 * Returns only the Mbps value (number) or 0 if the test fails or times out after 10 seconds.
 */
export async function getNetworkSpeedMbps(
  url = 'https://dev.smartroll.live/api/media/speedtest/blob_500kb.bin'
): Promise<number | null> {
  const fileSizeBytes = 500 * 1024; // 500 KB
  const timeoutMs = 10000;
  try {
    const startTime = performance.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let response;
    try {
      response = await fetch(url, { cache: 'no-store', signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    await response.blob(); // Ensure full download
    const endTime = performance.now();
    const durationSeconds = (endTime - startTime) / 1000;
    const bitsLoaded = fileSizeBytes * 8;
    const speedMbps = bitsLoaded / durationSeconds / 1_000_000;
    return speedMbps;
  } catch {
    return 0;
  }
}
