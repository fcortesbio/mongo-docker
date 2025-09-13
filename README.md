# MongoDB Docker with Replica Set

A Docker Compose setup for MongoDB 6.0 configured as a single-node replica set, enabling transaction support for development environments.

## Features

- ✅ MongoDB 6.0 with replica set configuration
- ✅ Transaction and session support
- ✅ Automatic replica set initialization
- ✅ Health checks and dependency management
- ✅ Persistent data storage
- ✅ Authentication enabled

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/fcortesbio/mongo-docker.git
cd mongo-docker
```

### 2. Prerequisites

Make sure you have Docker and Docker Compose installed on your system:

* [Install Docker](https://docs.docker.com/get-docker/)
* [Install Docker Compose](https://docs.docker.com/compose/install/)

### 3. Configure Environment

Copy the example environment file and customize if needed:

```bash
cp .env-example .env
```

Default credentials (you can modify these in `.env`):
- Username: `admin`
- Password: `supersecret`

### 4. Deploy MongoDB

Start the MongoDB replica set:

```bash
docker-compose up -d
```

This will:
- Start MongoDB with replica set configuration
- Wait for MongoDB to be healthy
- Automatically initialize the replica set named `rs0`
- Create persistent storage for your data

### 5. Verify Deployment

Check if the containers are running:

```bash
docker-compose ps
```

View the logs to confirm replica set initialization:

```bash
docker-compose logs mongo-init
```

You should see output indicating successful replica set initialization.

## Connection Strings

### For Applications

Use this connection string format in your applications:

```
mongodb://admin:supersecret@localhost:27017/your_database?replicaSet=rs0&authSource=admin
```

### For Direct Connection

Connect directly using MongoDB shell:

```bash
# Using Docker
docker exec -it mongodb mongosh --username admin --password supersecret --authenticationDatabase admin

# Or using local mongosh (if installed)
mongosh "mongodb://admin:supersecret@localhost:27017/admin?replicaSet=rs0"
```

**Note:** For security in production, use connection strings that prompt for passwords:

```bash
mongosh "mongodb://admin@localhost:27017/admin?replicaSet=rs0" --authenticationDatabase admin
# You will be prompted to enter the password securely.
```
