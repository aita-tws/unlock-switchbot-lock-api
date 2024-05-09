FROM node:20.6.0
WORKDIR /app

RUN apk add --no-cache tini

COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile

COPY --chown=node:node . .

ENTRYPOINT ["/sbin/tini", "--"]
CMD [ "yarn", "start" ]
