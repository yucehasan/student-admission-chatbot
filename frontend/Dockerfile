FROM node:16 AS build

WORKDIR /app

RUN apt-get update && apt-get install -y bash curl

COPY package.json package-lock.json ./
RUN npm install

# ARG REACT_APP_API_URL
# ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY . .

RUN npm run build


# ---------- Production Stage ----------
FROM nginx:alpine

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build output to Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port (optional, for documentation purposes)
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
    
