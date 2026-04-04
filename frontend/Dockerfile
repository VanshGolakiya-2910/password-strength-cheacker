FROM node:20-bookworm-slim AS build

WORKDIR /app

ARG FRONTEND_API_BASE_URL=https://apilockscore.vkarma.net/api/v1
ARG FRONTEND_SOCKET_URL=https://lockscore.vkarma.net

COPY package*.json ./
RUN npm ci

COPY . .

RUN sed -i "s|__API_BASE_URL__|${FRONTEND_API_BASE_URL}|g" src/environments/environment.production.ts \
  && sed -i "s|__SOCKET_URL__|${FRONTEND_SOCKET_URL}|g" src/environments/environment.production.ts \
  && npm run build -- --configuration production

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/password-strength-checker/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
