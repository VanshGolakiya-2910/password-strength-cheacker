FROM node:20-bookworm-slim

ENV NODE_ENV=production

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends tini \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "const http=require('http');http.get('http://127.0.0.1:5000/health',(res)=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1));"

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "server.js"]
