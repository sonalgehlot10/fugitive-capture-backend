const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;

const cities = [
    { name: 'Yapkashnagar', distance: 60 },
    { name: 'Lihaspur', distance: 50 },
    { name: 'Narmis City', distance: 40 },
    { name: 'Shekharvati', distance: 30 },
    { name: 'Nuravgram', distance: 20 },
];

const vehicles = [
    { type: 'EV Bike', range: 60, count: 2 },
    { type: 'EV Car', range: 100, count: 1 },
    { type: 'EV SUV', range: 120, count: 1 },
];

let fugitiveLocation = cities[Math.floor(Math.random() * cities.length)].name;
console.log(`Fugitive is hiding in: ${fugitiveLocation}`);

let cops = [];
let selectedCities = new Set();

app.get('/api/cities', (req, res) => {
    res.json(cities);
});

app.get('/api/vehicles', (req, res) => {
    res.json(vehicles);
});

app.post('/api/cops', (req, res) => {
    const { cop, city, vehicle } = req.body;
    
    if (selectedCities.has(city)) {
        return res.status(400).json({ message: 'City already selected by another cop' });
    }

    selectedCities.add(city);
    cops.push({ cop, city, vehicle });
    console.log(`New cop added: ${cop}, City: ${city}, Vehicle: ${vehicle}`);
    res.json({ message: 'Selection saved', data: { cop, city, vehicle } });
});

app.get('/api/result', (req, res) => {
    console.log('Evaluating result...');
    let captured = false;
    let capturingCop = null;
    cops.forEach(c => {
        if (c.city === fugitiveLocation) {
            const vehicle = vehicles.find(v => v.type === c.vehicle);
            const city = cities.find(city => city.name === c.city);
            if (vehicle && city && vehicle.range >= 2 * city.distance) {
                captured = true;
                capturingCop = c.cop;
                console.log(`Captured by cop: ${c.cop} in city: ${c.city} using vehicle: ${c.vehicle}`);
            }
        }
    });
    if (!captured) {
        console.log('Fugitive escaped');
    }
    res.json({ captured, capturingCop });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



