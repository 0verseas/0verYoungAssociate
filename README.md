# 0verYoungAssociate
海外青年技術訓練班填報系統

## Deploy Local Develop Environment
### Install Dependencies
```
git clone https://github.com/0verseas/0verYoungAssociate.git
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
### Startup Preparation
if dev then
```
git clone https://github.com/0verseas/0verYoungAssociate.git ./0verYoungAssociate-dev/
cd ./0verYoungAssociate-dev/
git checkout dev
```
if official then
```
git clone https://github.com/0verseas/0verYoungAssociate.git
cd ./0verYoungAssociate/
```

```
npm install
cp ./src/env.js.example ./src/env.js
cp ./docker/.env.example ./docker/.env
```
#### Edit Config Files
modify baseUrl, isProduction, reCAPTCHA_site_key, year
```
vim ./src/env.js
```
modfiy NETWORKS, DOMAIN_NAME, ENTRYPOINTS
*If dev then modfiy COMPOSE_PROJECT_NAME and CONTAINER_NAME*
```
vim ./docker/.env
```
#### *If want Container Block Exclude IPs Other than Ours*
modify uncomment row 28
```
vim ./docker/docker-compose.yaml
```
### Build
```
sudo npm run docker-build
```
### StartUp
*at ./docker/ path*
```
sudo docker-compose up -d
```
### Stop
*at ./docker/ path*
```
sudo docker-compose down
```
### ✨Nonstop Container and Apply New Edit Docker-Compose Setting (Use Only Container is running)✨
The command will not effect on the running container if you have not edited any of the settings on docker-compose.yaml
*at ./docker/ path*
```
sudo docker-compose up --detach
```