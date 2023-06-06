# CLIENT Docker File
# install a node docker image
FROM node:16.13.2 as builder

# set the working directory to /client
WORKDIR /client

# copy the package.json lock file into the container at /client
COPY package*.json /client/

# install the node dependencies
RUN npm install

# copy the current directory contents into the container at /client
COPY . /client/

# build the application
RUN npm run build

# pull nginx from docker hub
FROM nginx:latest

# copy the nginx configuration file into the container at /etc/nginx/conf.d/default.conf
COPY ./nginx-build-server/default.conf /etc/nginx/conf.d/default.conf

# copy contents of build into the serve location in the container
COPY --from=builder /client/build /usr/share/nginx/html/

# # make the port 5005 available to the world outside the container
# EXPOSE 5005

# # run the app when the container launches
# CMD ["npm", "run", "start"]