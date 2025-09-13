// MongoDB Replica Set Initialization Script
// This script initializes a single-node replica set for development purposes

rs.initiate({
  _id: "rs0",
  version: 1,
  members: [
    {
      _id: 0,
      host: "mongodb:27017",
      priority: 1
    }
  ]
});

// Wait for the replica set to be initialized
print("Waiting for replica set initialization...");
sleep(2000);

// Print replica set status
print("Replica set status:");
printjson(rs.status());