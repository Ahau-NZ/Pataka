# Web Registration Form (development)

In development, we assume web-registration is run by the dev-server (see `ssb-pataka`). This is a guide to set up a dev pātaka and a web registration form from this repo instead, NOT using the dev-server in dev mode.

I found this method useful to be able to send submissions from a web registration to Āhau in a local development set up.

## Config

You will need to add config to enable the web registration form. You will need to find the config
file, for the dev pataka this is usually located at `~/.ahau-pataka-dev/config` in your users home directory.

```javascript
{
  port: 8088,
  pataka: {
    host: 'localhost',
    log: false,
    webRegistration: {
      // port the web registration form is served from
      port: 8000,

      // limit the tribes in the form to particular ones
      // or leave out to show a list of all tribes
      tribes: [
        "%2Sn8sdDl5+cJqrxo2JdVACReYudCbYQAkB0sRHEZARU=.cloaked"
      ]
    },
    allowedOrigins: [
      // the origin of the web registration form
      "http://localhost:8000" // must match config.pataka.host and pataka.webRegistration.port
    ]
  },
  
  // NOTE: the compiled UI from `ssb-pataka` will be expecting to communicate with a production
  // pataka, which hosts graphql on port 18088 
  graphql: {
    port: 18088
  }
}
```

## Steps

1. Install node_modules in the root directory of this repo

    ```zsh
    npm install
    ```

2. Set up the `config`, similar to the example above.
3. Specify the tribes you wish to show, or remove the `tribes` field if you want to show all.
4. Important: you'll need to comment out this line (`line 25`) in `node_modules/ssb-pataka/plugins/web-registration.js` as it will prevent you from starting the web registration form from this repo.

    ```javascript
    if (Env().isDevelopment) return
    ```

5. Set the `GRAPHQL_PORT` env variable to `18088`, this is used in a few places and the pataka and form wont work properly (from here) without it. Heres a quick start way to do this. You'll need to do this each time you start this dev pataka:

    ```zsh
    GRAPHQL_PORT=18088 npm run dev
    ```

6. You should be able to access the web registration form at:

    ```zsh
    http://localhost:8000
    ```

7. Pātaka UI: to get the Pātaka UI working, you have to set the `VUE_APP_GRAPHQL_HTTP` env variable in `ui/.env`

    ```bash
    VUE_APP_GRAPHQL_HTTP=http://localhost:18088/graphql
    ```

8. Then to run the Pātaka UI, from the root directory of this repo run:

    ```bash
    cd ui
    npm run dev
    ```
