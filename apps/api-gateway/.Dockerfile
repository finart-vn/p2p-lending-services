FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build 

# Expose the application port
EXPOSE 3005

# Command to run the application
CMD ["node", "dist/apps/api-gateway/main"]