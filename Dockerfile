FROM node:18 as Builder

WORKDIR /usr/src/app

ARG NPM_TOKEN
RUN npm config set registry https://registry.npmjs.org/
RUN echo "https://registry.npmjs.org/:_authToken=$NPM_TOKEN" >> ~/.npmrc

COPY . .

RUN npm ci
RUN npm run build

FROM node:18-alpine

ARG NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/main"]