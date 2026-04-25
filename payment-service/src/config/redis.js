const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

let publisher = null;
let subscriber = null;

async function getPublisher() {
  if (!publisher) {
    publisher = redis.createClient({ url: REDIS_URL });
    publisher.on('error', (err) => console.error('Redis Publisher Error:', err));
    await publisher.connect();
    console.log('📡 Redis publisher connected');
  }
  return publisher;
}

async function getSubscriber() {
  if (!subscriber) {
    subscriber = redis.createClient({ url: REDIS_URL });
    subscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));
    await subscriber.connect();
    console.log('📡 Redis subscriber connected');
  }
  return subscriber;
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

async function subscribeToEvent(channel, handler) {
  const client = await getSubscriber();
  await client.subscribe(channel, (message) => {
    const parsed = JSON.parse(message);
    console.log(`📥 [${channel}] Received:`, JSON.stringify(parsed.data, null, 2));
    handler(parsed);
  });
  console.log(`👂 Listening on channel: ${channel}`);
}

module.exports = { getPublisher, getSubscriber, publishEvent, subscribeToEvent };
