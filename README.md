# Āhau Pātaka

An application designed to be run as an always online peer.
Ideally this peer is set up with a static, public IP address, (or port forwarding from one).

This peer is not able to decrypt any messages (or file) that are private to groups,
but will replicate these messages (and files) to ensure they are accessible even when the creator
is offline, or so there is a backup.

## Development

Setup:

```$
$ npm i
```

Then in two different terminals:
1. start the webpack dev server
  ```bash
  $ cd ui && npm run dev
  ```
2. once that is started, start scuttlebutt + electron
  ```bash
  $ npm run dev
  ```

## Publishing

### Requirements

You need to make sure you have `electron-builder.env` with the following env set:
- **all platforms**
    - `GH_TOKEN` - required for publishing to github (including artefacts required for auto-updating)
        - each developer with publishing rights to `github.com/protozoa-nz/pataka` needs to make their own token, make one [here](https://github.com/settings/tokens/new), selecting "repo" permissions
- **MacOS**
    - `APPLE_ID` - email address of apple account with code signing license
    - `APPLE_ID_PASS` - password

- **Windows**
    - `CSC_LINK=build/win/csc.pfx` - location of the code signing cert. We have ours commited to repo here
    - `CSC_KEY_PASSWORD` - password to go with that cert

RESOURCES:
- See : https://www.electron.build/code-signing for useful links

### Making release

Steps:
1. **tag a new release**
    ```bash
    $ npm verion minor                # choose major|minor|patch
    ```
2. **push the tag up to repos**
    ```bash
    $ git push origin master --tags
    $ git push github master --tags   # the protozoa-nz/protozoa repo
    ```
3. **run release process**
    ```
    $ npm run release
    ```
4. **test the application runs**
    - find copy
       - `releases` folder
       - https://www.github.com/protozoa-nz/pataka/releases
    - open pataka, then after a minute close an re-open
       - auto-updater should have updated to latest version!

NOTES:
- you have a **2 hour window** when the release process will work for a particular tag, so make sure to coordinate releases across platforms with other devs
- if you publish a broken release, the auto-updater will roll this broken release to all users and may break auto-updating!
    - smoke-testing the application (step 4) is vital
    - fix it quick!
    - you can run the same release multiple times and it will over-write files on github

---

## Changes from Whakapapa-Ora desktop, ui and server

The setup was largely forked from Ahau (whakapapa-ora repo), with some changes:

### Unique parts

UI:
  - `ui/src/App.vue`
  - `ui/src/views/Dashboard.vue`
  - `ui/src/views/PortForwarding.vue`
  - `ui/src/components/Appbar.vue`
  - `ui/src/components/Meter.vue`

### Tweaked parts

Installers: 
  - `build/electron-builder.config.js`: changed appId and productName; included `'!ui/*'` and `'!server/*'` to files

Ahoy:
  - `index.js`: uses `ahau-pataka-server` instead of `ahau-server`
  - `ssb.config.js`: uses different ssb port and folders

UI:
  - `ui/package.json`: ui runs on port `8081`
  - `ui/public/index.html`: changed title and removed cordova parts
  - `ui/src/plugins/vue-apollo.js`: GraphQL server runs on 4001 and different `AUTH_TOKEN`
  - `ui/src/views/Login.vue`: removed Cordova logic
  - `ui/src/components/Avatar.vue`: changed path of imported components; removed gender logic
  - `ui/src/components/AvatarEditDialog.vue`: changed path of imported components
  - `ui/src/components/Dialog.vue`: changed path of imported components; removed all logic related to gender and dates
  - `ui/src/components/DialogTitleBanner.vue`: changed path of imported assets
  - `ui/src/components/ImagePicker.vue`: changed path of imported components
  - `ui/src/components/NewNodeDialog.vue`: changed paths of imported components; only use a name, description and avatar; removed all relationship related logic
  - `ui/src/components/ProfileForm.vue`: removed all relationship related logic; left only name, description and avatar fields;

Server:
  - `server/package.json`: uses different ssb-graphql plugins
  - `server/index.js`: uses different ssb-graphql plugins, runs on port 4001, removed Cordova parts and mocking

### Copied parts

Installers: 
  - `build/mac`, `build/win` and `build/build-icons.js`

UI:
  - `.storybook`, `.eslintrc.js`, `apollo.config.js`, `babel.config.js`, `postcss.config.js`, `vue.config.js`, `vuetify.config.js`
  - `plugins/vuetify.js`
  - `assets`

