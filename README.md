# Aquarium World

A promotional website for a fictional aquarium, built with Node.js, Express, EJS and SQLite.

## Running the site

```
npm install
node index.mjs
```

Then open http://localhost:5000

## Note for markers

On macOS, AirPlay Receiver occupies port 5000 by default. It cannot be disabled
from the terminal while System Integrity Protection is enabled. If the page does
not load, either turn off AirPlay Receiver under
System Settings → General → AirDrop & Handoff, or start the server on a
different port:

```
PORT=5050 node index.mjs
```
## Live version

A deployed copy is available at https://aquarium-world-2l3g.onrender.com

The free hosting tier sleeps after inactivity, so the first request may take
around 30 seconds while the server starts. Contact form submissions are not
retained between restarts on the hosted copy, they are stored normally when
the site is run locally.