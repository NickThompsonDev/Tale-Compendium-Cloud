# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Print environment variables (for debugging)
RUN printenv

# Build the application
RUN npm run build

# Expose the port (if required)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
