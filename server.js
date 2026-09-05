const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.siteName = 'Blue Harbour Aquarium';
  res.locals.openingTimes = { open: '9:00am', close: '6:00pm', days: 'Every day' };
  res.locals.currentPath = req.path;
  next();
});

app.get('/', (req, res) => {
  res.render('pages/home', {
    pageTitle: 'Home',
    pageDescription: 'Discover four themed marine zones at Blue Harbour Aquarium, open every day from 9am to 6pm.'
  });
});

app.use((req, res) => {
  res.status(404).render('pages/404', {
    pageTitle: 'Page not found',
    pageDescription: 'The page you were looking for could not be found.'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});