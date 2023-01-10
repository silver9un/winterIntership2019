FROM keymetrics/pm2:latest-alpine

# Bundle APP files
WORKDIR /usr/src/app
COPY package*.json ./
COPY pm2.json ./
COPY ./dist/server.bundle.js ./
ADD ./src/json/*.json ./json

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
ENV NODE_ENV production
RUN npm install --production
RUN npm install -g pm2

# KEYMETRICS Monitoring Service Use
#ENV KEYMETRICS_PUBLIC 5uactl73k7igz09
#ENV KEYMETRICS_SECRET nuwzx5qnettb1xv 
#RUN pm2 install pm2-server-monit

# Show current folder structure in logs
RUN ls -al -R

# port configuration
EXPOSE 8080

CMD [ "pm2-runtime", "start", "pm2.json"]