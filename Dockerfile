# Install dependencies
FROM node:20.12.2-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
ENV NODE_ENV=development
RUN npm config set registry https://registry.npmjs.org/
RUN npm install -g npm@latest
RUN npm install

# Build the app
FROM dependencies AS build
COPY . .
RUN npm run build

# Production image
FROM node:20.12.2-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "dist/main.js"]
