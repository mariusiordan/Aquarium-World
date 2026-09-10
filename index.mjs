import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialiseDatabase,
  getAllZones,
  getZoneBySlug,
  getExperiencesByZoneId,
  getAllExperiences,
  getFaqsByCategory,
  saveEnquiry,
  searchExperiences
} from './db/database.mjs';

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

app.get('/zones', async (req, res, next) => {
  try {
    const zones = await getAllZones();
    res.render('pages/zones', {
      pageTitle: 'Zones',
      pageDescription: 'Four themed marine zones at Blue Harbour Aquarium, from a sunlit coral reef to a deep sea trench.',
      zones
    });
  } catch (err) {
    next(err);
  }
});

app.get('/zones/:slug', async (req, res, next) => {
  try {
    const zone = await getZoneBySlug(req.params.slug);

    if (!zone) return next();

    const experiences = await getExperiencesByZoneId(zone.id);

    res.render('pages/zone', {
      pageTitle: zone.name,
      pageDescription: zone.tagline,
      zone,
      experiences
    });
  } catch (err) {
    next(err);
  }
});

app.get('/experiences', async (req, res, next) => {
  try {
    const experiences = await getAllExperiences();
    const byZone = experiences.reduce((groups, item) => {
      (groups[item.zone_name] ||= { slug: item.zone_slug, items: [] }).items.push(item);
      return groups;
    }, {});

    res.render('pages/experiences', {
      pageTitle: 'Experiences',
      pageDescription: 'Tank exhibits, hands-on activities and daily talks across all four zones at Blue Harbour Aquarium.',
      byZone
    });
  } catch (err) {
    next(err);
  }
});

app.get('/faq', async (req, res, next) => {
  try {
    const faqs = await getFaqsByCategory();
    res.render('pages/faq', {
      pageTitle: 'Frequently asked questions',
      pageDescription: 'Opening times, accessibility, animal care and facilities at Blue Harbour Aquarium.',
      faqs
    });
  } catch (err) {
    next(err);
  }
});

function validateEnquiry(body) {
  const errors = {};

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const subject = (body.subject || '').trim();
  const message = (body.message || '').trim();

  if (name.length === 0) {
    errors.name = 'Enter your name.';
  } else if (name.length > 100) {
    errors.name = 'Your name must be 100 characters or fewer.';
  }

  if (email.length === 0) {
    errors.email = 'Enter your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter an email address in the correct format, like name@example.com';
  } else if (email.length > 254) {
    errors.email = 'Your email address is too long.';
  }

  const allowedSubjects = ['General enquiry', 'Accessibility', 'School visit', 'Animal care', 'Feedback'];
  if (!allowedSubjects.includes(subject)) {
    errors.subject = 'Choose a subject from the list.';
  }

  if (message.length === 0) {
    errors.message = 'Enter your message.';
  } else if (message.length < 10) {
    errors.message = 'Your message must be at least 10 characters.';
  } else if (message.length > 2000) {
    errors.message = 'Your message must be 2000 characters or fewer.';
  }

  return { errors, values: { name, email, subject, message } };
}

app.get('/contact', (req, res) => {
  res.render('pages/contact', {
    pageTitle: 'Contact us',
    pageDescription: 'Get in touch with Blue Harbour Aquarium about access requirements, school visits or general enquiries.',
    errors: {},
    values: { name: '', email: '', subject: '', message: '' },
    submitted: false
  });
});

app.post('/contact', async (req, res, next) => {
  try {
  
    if (req.body.website) {
      return res.render('pages/contact', {
        pageTitle: 'Message sent',
        pageDescription: 'Thank you for contacting Blue Harbour Aquarium.',
        errors: {},
        values: { name: '', email: '', subject: '', message: '' },
        submitted: true
      });
    }

    const { errors, values } = validateEnquiry(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).render('pages/contact', {
        pageTitle: 'Contact us',
        pageDescription: 'Get in touch with Blue Harbour Aquarium.',
        errors,
        values,
        submitted: false
      });
    }

    await saveEnquiry(values);

    res.render('pages/contact', {
      pageTitle: 'Message sent',
      pageDescription: 'Thank you for contacting Blue Harbour Aquarium.',
      errors: {},
      values: { name: '', email: '', subject: '', message: '' },
      submitted: true
    });
  } catch (err) {
    next(err);
  }
});

app.get('/credits', async (req, res, next) => {
  try {
    const zones = await getAllZones();
    res.render('pages/credits', {
      pageTitle: 'Image credits',
      pageDescription: 'Photography credits and licensing information for images used on this website.',
      zones
    });
  } catch (err) {
    next(err);
  }
});

app.get('/rockpool-explorer', (req, res) => {
  res.render('pages/rockpool-explorer', {
    pageTitle: 'Rockpool Explorer',
    pageDescription: 'Lift the rocks and discover which creatures shelter in a British rockpool at low tide.'
  });
});

app.get('/api/experiences', async (req, res, next) => {
  try {
    const term = (req.query.q || '').trim().slice(0, 100);
    const type = (req.query.type || 'all').trim();
    const zone = (req.query.zone || 'all').trim();

    const results = await searchExperiences(term, type, zone);

    res.json({
      count: results.length,
      results: results.map(item => ({
        name: item.name,
        type: item.type,
        description: item.description,
        duration: item.duration,
        accessibility: item.accessibility,
        sensory_note: item.sensory_note,
        zone_name: item.zone_name,
        zone_slug: item.zone_slug
      }))
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