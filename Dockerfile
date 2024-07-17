# Use the official Node.js image from the Docker Hub
FROM node:18.16.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package-prod.json package-lock.json ./

# Rename package-prod.json to package.json
RUN mv package-prod.json package.json

# Install dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]