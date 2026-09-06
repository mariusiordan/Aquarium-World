import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialiseDatabase, getAllZones } from './db/database.mjs';

// ES modules do not provide __dirname, so it is reconstructed from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Values made available to every template
app.use((req, res, next) => {
  res.locals.siteName = 'Blue Harbour Aquarium';
  res.locals.openingTimes = { open: '9:00am', close: '6:00pm', days: 'Every day' };
  res.locals.currentPath = req.path;
  next();
});

app.get('/', async (req, res, next) => {
  try {
    const zones = await getAllZones();
    res.render('pages/home', {
      pageTitle: 'Home',
      pageDescription: 'Explore four themed marine zones at Blue Harbour Aquarium, open every day from 9am to 6pm.',
      zones
    });
  } catch (err) {
    next(err);
  }
});

app.use((req, res) => {
  res.status(404).render('pages/404', {
    pageTitle: 'Page not found',
    pageDescription: 'The page you were looking for could not be found.'
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('pages/500', {
    pageTitle: 'Something went wrong',
    pageDescription: 'An unexpected error occurred.'
  });
});

await initialiseDatabase();

const server = app.listen(PORT, () => {
  console.log(`Blue Harbour Aquarium running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err.code, err.message);
});