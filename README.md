# hovercar-42-web

This is the gamemaster app for the cubes system utilizing MQTT communication to start, restart and configure the corresponding hovercube unity-app.

## Getting started
### Corresponding cube App
(https://github.com/jbg-1/hovercar-42)

### Install Base package
1. Pull base module (https://github.com/dasdigitalefoyer/cubes-basepackage-web-react)
2. build
3. link base package (https://docs.npmjs.com/cli/v10/commands/npm-link)
    ```
    # inside base package directoy
    npm link

    # inside app directory
    npm link @mirevi/puzzlecube-core
    ```

### Install Unity app
Install the corresponding Unity App on your system or a cube

### Build / Run dev server
```
npm run build

## OR

npm run dev
```

### Test
* run local MQTT broker (e.g. with docker), configure for __websocketport 9001__ (https://github.com/vvatelot/mosquitto-docker-compose)
* add .env.local with VALUES from .env fpor local MQTT broker
* run unity app on your system
* open in browser
* send messages

### Deploy
* upload on serer & build, modify .env/.env.local for MQTT broker as provided in deployment infrastructure
