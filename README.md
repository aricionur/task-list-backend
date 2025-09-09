# Task List Backend API

Welcome to the Task List Backend API\! This is a simple, yet robust, Node.js API for managing tasks. It's built with **Express.js** and uses **TypeORM** for database interactions with a **PostgreSQL** database.

This project is containerized using Docker, which simplifies the setup process and ensures a consistent development environment.

---

## Prerequisites

Before you start, make sure you have the following installed on your machine:

- **Node.js**: [LTS version recommended](https://nodejs.org/en/download/)
- **Yarn**: [Installation instructions](https://classic.yarnpkg.com/lang/en/docs/install/)
- **Docker** and **Docker Compose**: [Installation instructions](https://docs.docker.com/get-docker/)

---

## Getting Started

### 📦 Local Development

To get the API running on your local machine for development:

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/aricionur/task-list-backend.git
    cd task-list-backend
    ```

2.  **Install dependencies**:

    ```bash
    yarn install
    ```

3.  **Configure environment variables**:
    A `.env` file is already provided in the repository for a quick start. You can modify it to match your specific database configuration if needed.

4.  **Start the development server**:
    You'll need a running PostgreSQL database. You can either use your own or use the one provided in the Docker Compose setup.

    - **If you have your own PostgreSQL database**, ensure its connection details are configured in the `.env` file and then run:
      ```bash
      yarn dev
      ```
    - **If you prefer to use Docker for the database**, skip to the **Docker** section below.

The API will be available at `http://localhost:3000`.

### 🛠️ Build and Test

- **Build**: Compile the TypeScript source code into JavaScript:

  ```bash
  yarn build
  ```

- **Test**: Run the test suite:

  ```bash
  yarn test
  ```

- **Start**: Run the built application in production mode:

  ```bash
  yarn start
  ```

---

### 📄 API Documentation

This project uses **Swagger UI** to provide interactive API documentation. Once the server is running, you can access the documentation at the following URL:

```
http://localhost:3000/api-docs
```

The documentation provides a complete overview of all available endpoints, including request and response schemas, allowing you to test the API directly from your browser.

## 🐳 Docker

The easiest way to run this application is with Docker and Docker Compose. This project provides separate Compose files for development and production environments.

### Development Environment

For development, use the `docker-compose-dev.yml` file. This setup will include the database service and mount your local source code, allowing for live reloading with Nodemon.

1.  **Build and run the containers**:

    ```bash
    docker-compose -f docker-compose-dev.yml up --build
    ```

2.  **Access the application**:
    The API will be available at `http://localhost:3000`.

### Production Environment

For production, use the `docker-compose.yml` file. This setup is optimized for production, building a lean image without development dependencies and live reloading.

1.  **Build and run the containers**:

    ```bash
    docker-compose up --build
    ```

2.  **Access the application**:
    The API will be available at `http://localhost:3000`.

### Stopping the Containers

To stop the services, use the following command, specifying the correct Compose file if you're in a development environment:

```bash
docker-compose -f docker-compose-dev.yml down
```

or

```bash
docker-compose down
```
