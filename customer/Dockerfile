# # CLIENT Docker File
# # install a node docker image
# FROM node:16.15.0 AS builder

# # set the working directory to /customer
# WORKDIR /customer

# # copy the package.json lock file into the container at /customer
# COPY package*.json /customer/

# # install the node dependencies
# RUN npm install

# # copy the current directory contents into the container at /customer
# COPY . /customer/

# # build the application
# RUN npm run build

# # pull nginx from docker hub
# FROM nginx:latest

# # copy the nginx configuration file into the container at /etc/nginx/conf.d/default.conf
# COPY ./nginx-build-server/default.conf /etc/nginx/conf.d/default.conf

# # copy contents of build into the serve location in the container
# COPY --from=builder /customer/build /usr/share/nginx/html/

############################### SERVE PREBUILD ###############################

# pull nginx from docker hub
FROM nginx:latest

# set the working directory to /customer
WORKDIR /customer

# copy the nginx configuration file into the container at /etc/nginx/conf.d/default.conf
COPY ./nginx-build-server/default.conf /etc/nginx/conf.d/default.conf

# copy contents of build into the serve location in the container
COPY ./build /usr/share/nginx/html/