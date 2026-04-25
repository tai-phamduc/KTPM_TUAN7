const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let publisher = null;

async function getPublisher() {
  if (!publisher) {
    publisher = redis.createClient({ url: REDIS_URL });
    publisher.on('error', (err) => console.error('Redis Publisher Error:', err));
    await publisher.connect();
    console.log('📡 Redis publisher connected');
  }
  return publisher;
}

async function publishEvent(channel, data) {
  const client = await getPublisher();
  const message = JSON.stringify({
    event: channel,
    data,
    timestamp: new Date().toISOString(),
  });
  await client.publish(channel, message);
  console.log(`📤 [${channel}] Published:`, JSON.stringify(data, null, 2));
}

module.exports = { getPublisher, publishEvent };
