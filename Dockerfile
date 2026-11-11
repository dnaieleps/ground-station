# this is the dockerfile, which mirrors the terminal commands that you would do when first starting up 
# your project, but containerized inside a docker container to allow for uniform code execution

# working with node version 22 as our base image
FROM node:22   

# sets working directory inside container to /app 
WORKDIR /app

# copies package.json and package-lock.json if available
COPY package*.json ./

# installs app dependencies 
RUN npm install

# copies the rest of our app into the container
COPY . . 

# set port environment variable 
ENV PORT=9000
# exposes the port so our computer can use it
EXPOSE 9000

# runs the app 
CMD ["npm", "start"]