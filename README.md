# 0verYoungAssociate
海青副學士

## Deploy Local Develop Environment
### Install Dependencies
```
git clone https://github.com/0verseas/0verYoungAssociategit
cd 0verYoungAssociate
npm install
```
### Setup
```
cp src/env.js.example src/env.js
```
edit the config file in `src/env.js`

### Testing
```
$ npm run serve
```

### Building
```
$ npm run build
```
## Deploy Docker Develop Environment
Just need to modify related documents(src/env.js, .env, docker-compose.yaml)

First of all, git clone https://github.com/0verseas/0verYoungAssociategit than switch folder to 0verYoungAssociate/, and do below
  - ``cd 0verYoungAssociate/``
    - switch git branch
      - ``sudo git checkout dev``
    - ``sudo cp src/env.js.example src/env.js``
    - edit src/env.js (modify baseUrl, reCAPTCHA_site_key)
    - docker build
      - ``sudo docker run -it --rm -v $PWD:/0verYoungAssociate -w /0verYoungAssociate node:14.16.0 sh -c 'npm install && npm run build'``

Secondly, switch folder to 0verStudent/docker/ and do below
- ``cd docker/``
  - ``sudo cp .env.example .env``
  - edit .env (modify NETWORKS)
  - edit docker-compose.yaml (modify the container's label which "traefik.http.routers.malaysia-spring.rule=Host(`` `input student's domain name here` ``) && PathPrefix(`` `/malaysia_spring` ``)")

Finally, did all the above mentioned it after that the last move is docker-compose up
- ``sudo docker-compose up -d``

If want to stop docker-compose
- ``sudo docker-compose down``
