# HTTPS

For the Web-registration form, you will need to provide a key and certificate
to enable https. Not enabling https is not an option.

For https keys/ certs we used [LetsEncrypt / Certbot](https://eff-certbot.readthedocs.io/en/latest/using.html#manual):
- install certbot
- run: 
  ```bash
  sudo certbot certonly --manual --preferred-challenges dns
  ```
- create DNS TXT records, check with tools then proceed

NOTE these only last for 90 days (manual for remote setup is hard, and also if your DNS provider doesn't have a nice certbot plugin it's hard)

TODO figure out a nice way to auto-update.

## Installing key + cert

We currently install keys directly into our ssb-config file.
This would be improved in the future.

Grab a copy of the key + cert:
```bash
sudo cp /etc/letsencrypt/live/pataka.protozoa.nz/fullchain.pem fullchain.pem
sudo cp /etc/letsencrypt/live/pataka.protozoa.nz/privkey.pem privkey.pem
```

Log out how these should be installed in your config:
```js
const fs = require('fs')

const fullchain = fs.readFileSync('fullchain.pem', 'utf-8')
const privkey = fs.readFileSync('privkey.pem', 'utf-8')

console.log(
  JSON.stringify({
    pataka: {
      allowedOrigins: [
        'https://pataka.protozoa.nz' // << EDIT THIS
      ],
      webRegistration: {
        httpsProxyPort: 7000,
        https: {
          fullchain,
          privkey
        }
      }
    }
  }, null, 2)
)
```
