# MongoDB Docker with Replica Set

A Docker Compose setup for MongoDB 8.0 configured as a single-node replica set, enabling transaction support for development environments.

## Features

- ✅ MongoDB 8.0 with replica set configuration
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

## Testing Transaction Support

This setup supports multi-document transactions. You can test transaction functionality:

```bash
# Copy and run the transaction test script
docker cp test_transaction.js mongodb:/tmp/test_transaction.js
docker exec mongodb mongosh -u admin -p supersecret --authenticationDatabase admin --file /tmp/test_transaction.js
```

## Live Server Deployment

### Prerequisites for Production

1. **Server Requirements:**
   - Ubuntu/CentOS/RHEL server with Docker and Docker Compose installed
   - Minimum 2GB RAM, 10GB free disk space
   - Open port 27017 (or configure custom port)
   - SSL/TLS certificates (recommended)

2. **Security Considerations:**
   - Change default credentials in `.env` file
   - Use strong, randomly generated passwords
   - Configure firewall rules to restrict access
   - Consider using Docker secrets for sensitive data
   - Enable MongoDB audit logging if needed

### Step-by-Step Live Deployment

#### 1. Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y  # Ubuntu/Debian
# OR
sudo yum update -y  # CentOS/RHEL

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes to take effect
```

#### 2. Deploy MongoDB

```bash
# Clone repository
git clone https://github.com/fcortesbio/mongo-docker.git
cd mongo-docker

# Configure environment with strong credentials
cp .env-example .env
nano .env  # Edit with strong passwords

# Generate secure keyfile (already included)
ls -la keyfile  # Should show 400 permissions

# Start services
docker-compose up -d

# Verify deployment
docker-compose ps
docker-compose logs -f
```

#### 3. Security Hardening

```bash
# Configure firewall (UFW example)
sudo ufw allow ssh
sudo ufw allow 27017  # Or your custom MongoDB port
sudo ufw enable

# Restrict MongoDB access to specific IPs (optional)
sudo ufw delete allow 27017
sudo ufw allow from YOUR_APP_SERVER_IP to any port 27017
```

#### 4. Configure Custom Domain/Port (Optional)

To use a custom port or domain:

```yaml
# In docker-compose.yml, change port mapping:
ports:
  - "27018:27017"  # Custom external port
```

For SSL/TLS, you can use a reverse proxy like nginx:

```bash
# Install nginx
sudo apt install nginx

# Configure nginx for MongoDB proxy with SSL
# This requires additional nginx stream module configuration
```

#### 5. Backup and Monitoring

```bash
# Create backup script
cat > backup_mongo.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/mongodb"
DATE=$(date +"%Y%m%d_%H%M%S")
mkdir -p $BACKUP_DIR

docker exec mongodb mongodump --username admin --password supersecret --authenticationDatabase admin --out /tmp/backup_$DATE
docker cp mongodb:/tmp/backup_$DATE $BACKUP_DIR/
docker exec mongodb rm -rf /tmp/backup_$DATE

echo "Backup completed: $BACKUP_DIR/backup_$DATE"
EOF

chmod +x backup_mongo.sh

# Add to crontab for regular backups
# crontab -e
# 0 2 * * * /path/to/backup_mongo.sh
```

### Production Connection Strings

#### For Applications (Production)

```bash
# Use environment variables for credentials
mongodb://username:password@your-server.com:27017/database?replicaSet=rs0&authSource=admin&ssl=true
```

#### Health Check Endpoint

```bash
# Test MongoDB health
docker exec mongodb mongosh --username admin --password supersecret --authenticationDatabase admin --eval "db.runCommand('ping')"
```

### Troubleshooting Live Deployment

1. **Container keeps restarting:**
   ```bash
   docker logs mongodb
   # Check keyfile permissions and replica set initialization
   ```

2. **Cannot connect from external applications:**
   ```bash
   # Check firewall settings
   sudo ufw status
   
   # Verify MongoDB is binding to all interfaces
   docker exec mongodb mongosh --eval "db.runCommand({getCmdLineOpts: 1})"
   ```

3. **Transaction failures:**
   ```bash
   # Verify replica set status
   docker exec mongodb mongosh -u admin -p supersecret --authenticationDatabase admin --eval "rs.status()"
   ```

4. **Performance issues:**
   ```bash
   # Check resource usage
   docker stats mongodb
   
   # Consider increasing container resources in docker-compose.yml
   deploy:
     resources:
       limits:
         memory: 4G
         cpus: '2'
   ```
