# NOBI Investment Backend Service

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

- node js
- npm
- git
- docker
- docker-compose
- postmant

## Settings

### Configuring

#### app config

The default path for config file is `./configs/config.api.ENVIRONTMENT.ini`, you can explicitly add config file in `--config` or `-c` argument.

```ini
[app]
host	= 0.0.0.0
port	= 2021

; log Configuration
[log]
path                    = var/log/
level                   = debug
filename                = api-service
type                    = console
errorSufix              = -error

; NAB Configuration
[nab]
default = 1
```

[NAB] CONFIG

    `nab.default` is a weight, this config is used to main transactions.
    you can change `nab.default` to any number depends on the company accuration's rate
    if you let it `1`, the rate exchages for transaction's rate will not be seen in a couple of months

    `NAB's formula` is  `TotalBalance/TotalUnit`
    `Unit's formula` is `Balance/NAB `

    by this formula, any number `devided` to `1` wont change. so choose the best `weight` to see the rate changes.
    example : `1.4000`

[LOGGING]

    there is 2 type of this logging, `console` and `file`
    `file` will log any request in a file that has put in `var/log/filename`
    `console` will log any request in command line \ bash \ etc that you used

    there is also `level` logging. there are variables you can use that you can find in `/libs/logging.js`
    used it depends on your Environment

[DATABASE]

    Database configuration in `/configs/config.json`,
    by this config, you can use multiple database in on service.
    If you wanna add new database , follow the format models in `/models/yourDatabase`

    the schema database put in `schema_database.png` and dump file in `nobi.sql`

### Dockerfile

```sh
FROM node:12-alpine
MAINTAINER mrbontor@gmail.com

# Replace shell with bash so we can source files
RUN ln -s /bin/sh /bin/bash

RUN apk update; apk add tzdata

# create app directory
WORKDIR /app

COPY package.json ./

RUN npm install --save

# Bundle app source
COPY . .

# Environment
ENV NODE_ENV development

# Run the command on container startup
ENTRYPOINT ["npm", "start"]
```

or u can use docker-compose  

### docker-compose.yml

```yaml
version: '3'
services:
    app:
        build: .
        container_name: api-nobi
        restart: unless-stopped
        ports:
            - "2021:2021"
        networks:
            - host
networks:
    host:
        name: mynetwork
        external: true
```

Note :
    Change `mynetwork` to your docker Network

    `mynetwork` is my development network where has connection to MYSQL Server.

    if you have another docker for sql, check the network used and put it on your `network` configuration.

    Change `network_name` to the name of your docker network
    Also you can change `ports` to the port you like


### Deployment && Usage

This service build in windows, but you also can run this on linux

before you run, plase check the configuration

RUNNING SERVICE

[WINDOWS]

run this command on your command line
```sh
# start
$ npm install

$ npm start

# or you can use
$ node index

# for better development, you use should use

$ NODE_ENV=development node index.js

```

[LINUX]
like in windows os, you can run this service as in windows.
if you like to use Docker, you can run this service by command:

folder project: example : `nobi-service`

```sh
# build service
$ docker build -t nobi-service .

#check images:
$ docker images

# running the service:
$ docker run -d -p 2021:2021 --name `name_for_image_docker` nobi-service

# after the container created, u can log in into the container by command
$ docker exec -it `name_for_image_docker` sh

# now you can test the endpoint.
```

and if you like to use `docker-compose`, you can following below commands:

```sh
docker-compose up || docker-compose up --build

# after the container created, u can log in into the container by command
$ docker exec -it `name_for_image_docker` sh

# now you can test the endpoint.
```


usages command:

```sh
# start
$ docker-compose up -d

# stop
$ docker-compose down

# remove
$ docker-compose down -v
```

## API && endpoint

There is file called `NOBI.postman_collection.json`. You can import this file for details each endpoint

status code service:

```js
const SUCCESS           = 200
const BAD_REQUEST       = 400
const ACCESS_FORBIDDEN  = 403 //not used for now
const NOT_FOUND         = 404
const INTERNAL_ERROR    = 500
```

[RESPONSE]:

```json
{
    "status" : "Boolean",
    "message" : "String",
    "data": Array or Object
}
```

for endpoint list member, this uri use datatable function

example url:

    /api/v1/ib/member default size = 20

    /api/v1/ib/member?page=1&size=5

    /api/v1/ib/member?size=5: using default value for page

    /api/v1/ib/member?id=user_id_member&page=1&size=3: pagination & filter by id containing `user_id_member`
