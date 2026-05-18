// MongoDB initialization script
// Runs automatically on first container start

db = db.getSiblingDB('kindness_wall');

// Create the kindness messages collection
db.createCollection('kindness_entries');

// Seed with a sample message matching backend schema
db.kindness_entries.insertOne({
  name: "Admin",
  story: "Welcome to the Kindness Wall! Share your acts of kindness here.",
  hearts: 0,
  created_at: new Date().toISOString(),
});

// Also create and seed messages collection as requested by the user
db.createCollection('messages');
db.messages.insertOne({
  author: "Admin",
  message: "Welcome to the Kindness Wall! Share your acts of kindness here.",
  createdAt: new Date(),
});

print("Database initialized: kindness_wall");
print("Collections created: kindness_entries, messages");
