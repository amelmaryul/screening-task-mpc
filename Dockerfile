FROM node:22

WORKDIR /screening-task-mpc

COPY package-lock.json .
COPY package.json .
COPY src/ ./src
COPY sql/ ./sql
COPY scripts/ ./scripts

RUN npm install

CMD ["npm", "run", "start"]