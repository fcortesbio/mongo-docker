# MongoDB with Docker

A simple setup to run a MongoDB server using Docker Compose. It's configured to use environment variables for credentials, ensuring sensitive information is not hard-coded in the `docker-compose.yml` file.

## Getting Started

Follow these steps to get a local MongoDB instance up and running.

### Prerequisites

Make sure you have Docker and Docker Compose installed on your system.

* [Install Docker](https://docs.docker.com/get-docker/)
* [Install Docker Compose](https://docs.docker.com/compose/install/)

### Configuration

The project uses an `.env` file to manage the database credentials.

1.  **Create your `.env` file:** Copy the example file to create your own configuration.

    ```bash
    cp .env-example .env
    ```

2.  **Edit the `.env` file:** Open the newly created `.env` file and set your desired username and password.

    ```
    MONGO_ROOT_USERNAME=admin
    MONGO_ROOT_PASSWORD=supersecret
    ```

### Running the Server

Start the MongoDB container using Docker Compose.

```bash
docker-compose up -d
```
The -d flag runs the containers in the background.

### Connecting to MongoDB
You can connect to the database using mongosh or any other MongoDB client.

### Connection String
The connection string for this local instance is:

```bash
mongodb://<username>:<password>@localhost:27017
```

### Using [mongosh](https://www.mongodb.com/docs/mongodb-shell/)
To connect using the mongosh shell, you can use a command like this, replacing the credentials with your own:

```bash
mongosh "mongodb://admin:supersecret@localhost:27017"
```
**Note:** For security, it's best to use a connection string that prompts for the password instead of including it directly in the command. This prevents your password from being stored in your command history.

```bash
mongosh "mongodb://admin@localhost:27017" --authenticationDatabase admin
# You will be prompted to enter the password securely.
```
