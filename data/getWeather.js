const fetch = require('node-fetch');
const Place = require('../api/models/place');

const cities = [
    { name:'Bishkek', url: "bishkek-city" },
    { name:'Osh', url: "osh-city" },
    { name:'Jalal-Abad', url: "jalal-abad-city" },
    { name:'Karakol', url: "karakol-city" },
    { name:'Cholpon-Ata', url: "cholpon-ata-town" },
    { name:'Naryn', url: "naryn-town" },
    { name:'Talas', url: "talas-town" },
    { name:'Batken', url: "batken-town" },
]

const appid = '12203a39a3f20b2e3d59ff3a6f23714b'

async function fetchData(params, cityUrl) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${params}&appid=${appid}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();
        await Place.findOneAndUpdate(
            { url: cityUrl },
            {
                'weather.temp': data.main.temp,
                'weather.main': data.weather[0].main,
                'weather.description': data.weather[0].description,
                'weather.icon': data.weather[0].icon,
                'weather.updated': new Date()
            }
        );
        console.log(`${data.weather[0].description}: ${data.weather[0].main}: ${data.weather[0].icon}: ${data.main.temp}: ${new Date}`);
        // return data;
    } catch (error) {
        console.error('Error fetching or updating weather data:', error);
    }
}


// Call fetchData for each city in the cities array
cities.forEach(city => {
    fetchData(city.name, city.url);
});

const interval = 30 * 60 * 1000; // 30 minutes in milliseconds
setInterval(() => {
    cities.forEach(city => {
        fetchData(city.name, city.url);
    });
}, interval);
