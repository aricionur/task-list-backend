# Stage 1: Build the application
FROM node:20.17.0-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --production=false

# Copy the rest of the application source code
COPY . .

# Build the TypeScript code
RUN yarn build

# Stage 2: Run the application
FROM node:20.17.0-alpine

# Set the working directory
WORKDIR /app

# Copy built files and node modules from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

# Copy the OpenAPI spec file
COPY openapi.yaml .

# Expose the application port
EXPOSE 3000

# Set environment variables for the application
ENV PORT=3000

# The command to run the application
CMD ["yarn", "start"]