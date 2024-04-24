const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));
app.use('/img', express.static(path.join(__dirname, 'img')));
const powers = [
  { id: 1, name: 'flying' },
  { id: 2, name: 'teleporting' },
  { id: 3, name: 'super strength' },
  { id: 4, name: 'clairvoyance' },
  { id: 5, name: 'mind reading' }
];

const heroes = [
  {
    id: 1,
    type: 'spider-dog',
    displayName: 'Cooper',
    powers: [1, 4],
    img: 'cooper.jpg',
    busy: false
  },
  {
    id: 2,
    type: 'flying-dogs',
    displayName: 'Jack & Buddy',
    powers: [2, 5],
    img: 'jack_buddy.jpg',
    busy: false
  },
  {
    id: 3,
    type: 'dark-light-side',
    displayName: 'Max & Charlie',
    powers: [3, 2],
    img: 'max_charlie.jpg',
    busy: false
  },
  {
    id: 4,
    type: 'captain-dog',
    displayName: 'Rocky',
    powers: [1, 5],
    img: 'rocky.jpg',
    busy: false
  }
];

const threats = [
  {
    id: 1,
    displayName: 'Pisa tower is about to collapse.',
    necessaryPowers: ['flying'],
    img: 'tower.jpg',
    assignedHero: 0
  },
  {
    id: 2,
    displayName: 'Engineer is going to clean up server-room.',
    necessaryPowers: ['teleporting'],
    img: 'mess.jpg',
    assignedHero: 0
  },
  {
    id: 3,
    displayName: 'John will not understand the joke',
    necessaryPowers: ['clairvoyance'],
    img: 'joke.png',
    assignedHero: 0
  }
];

app.get('/heroes', (req, res) => {
  console.log('Returning heroes list');
  res.send(heroes);
});

app.get('/powers', (req, res) => {
  console.log('Returning powers list');
  res.send(powers);
});

app.post('/hero/:id', (req, res) => {
  const heroId = parseInt(req.params.id);
  const foundHero = heroes.find(subject => subject.id === heroId);

  if (foundHero) {
    for (let attribute in foundHero) {
      if (req.body[attribute]) {
        foundHero[attribute] = req.body[attribute];
        console.log(`Set ${attribute} to ${req.body[attribute]} in hero: ${heroId}`);
      }
    }
    res.status(202).header({ Location: `http://localhost:${port}/hero/${foundHero.id}` }).send(foundHero);
  } else {
    console.log(`Hero not found.`);
    res.status(404).send();
  }
});

app.get('/threats', (req, res) => {
  console.log('Returning threats list');
  res.send(threats);
});

app.post('/assignment', (req, res) => {
  request.post({
    headers: { 'content-type': 'application/json' },
    url: `http://localhost:${port}/hero/${req.body.heroId}`,
    body: `{
          "busy": true
      }`
  }, (err, heroResponse, body) => {
    if (!err) {
      const threatId = parseInt(req.body.threatId);
      const threat = threats.find(subject => subject.id === threatId);
      threat.assignedHero = req.body.heroId;
      res.status(202).send(threat);
    } else {
      res.status(400).send({ problem: `Hero Service responded with issue ${err}` });
    }
  });
});

// ... (código anterior)

app.use('/img', express.static(path.join(__dirname, 'img')));

console.log(`Monolith service listening on port ${port}`);
app.listen(port);

console.log('Static files served from:', path.join(__dirname, 'img'));

