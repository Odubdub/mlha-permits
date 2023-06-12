# API Docker File
# install a node docker image
FROM node:16.15.0

# set the working directory as /api
WORKDIR /api

# copy the package.json and package lock file into the container at /api
COPY package*.json /api/

# install the node dependencies
RUN npm install

# copy the current api directory contents into the container at /api
COPY . /api/

# make the port 3000 (where the app will be running) available outside the container
EXPOSE 3000

# run the app when the container launches
CMD ["npm", "run", "start"]