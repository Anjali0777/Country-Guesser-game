// Extended Array of locations with latitude, longitude, name, and hints
const locations = [
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522, hint: 'It is known as the City of Lights.' },
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060, hint: 'It has a famous statue of liberty.' },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, hint: 'This city hosts the world’s busiest intersection.' },
    { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, hint: 'It has a famous Opera House.' },
    { name: 'Rio de Janeiro, Brazil', lat: -22.9068, lng: -43.1729, hint: 'It has a giant statue of Christ the Redeemer.' },
    { name: 'Cape Town, South Africa', lat: -33.9249, lng: 18.4241, hint: 'It is near the Cape of Good Hope.' },
    { name: 'Moscow, Russia', lat: 55.7558, lng: 37.6173, hint: 'It has the famous Red Square.' },
    { name: 'Cairo, Egypt', lat: 30.0444, lng: 31.2357, hint: 'It is near the Great Pyramids of Giza.' },
    { name: 'Berlin, Germany', lat: 52.5200, lng: 13.4050, hint: 'It was once divided by a wall.' },
    { name: 'Beijing, China', lat: 39.9042, lng: 116.4074, hint: 'It is home to the Forbidden City.' },
    { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964, hint: 'It is home to the Colosseum and Vatican City.' },
    { name: 'Buenos Aires, Argentina', lat: -34.6037, lng: -58.3816, hint: 'This city is famous for its tango and vibrant culture.' },
    { name: 'Lagos, Nigeria', lat: 6.5244, lng: 3.3792, hint: 'It is one of the fastest-growing cities in Africa.' },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278, hint: 'It is home to Big Ben and the Thames River.' },
    { name: 'Mexico City, Mexico', lat: 19.4326, lng: -99.1332, hint: 'It was built on the ruins of Tenochtitlán.' },
    { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018, hint: 'It is known for its ornate shrines and vibrant street life.' },
    { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, hint: 'It has the world’s tallest building.' },
    { name: 'Delhi, India', lat: 28.7041, lng: 77.1025, hint: 'It is known for the Red Fort and India Gate.' },
    { name: 'Toronto, Canada', lat: 43.651070, lng: -79.347015, hint: 'It has a famous tower called the CN Tower.' },
    { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784, hint: 'It straddles two continents, Europe and Asia.' },
    { name: 'Havana, Cuba', lat: 23.1136, lng: -82.3666, hint: 'It is famous for classic cars and cigars.' },
    { name: 'Athens, Greece', lat: 37.9838, lng: 23.7275, hint: 'It is the cradle of Western civilization and home to the Parthenon.' },
    { name: 'Reykjavik, Iceland', lat: 64.1466, lng: -21.9426, hint: 'It is the northernmost capital in the world.' },
    { name: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393, hint: 'It is famous for its historic trams and pastel de nata.' },
    { name: 'Seoul, South Korea', lat: 37.5665, lng: 126.9780, hint: 'It is known for its high-tech culture and the Gyeongbokgung Palace.' },
    { name: 'Stockholm, Sweden', lat: 59.3293, lng: 18.0686, hint: 'It is known for its archipelago and Nobel Prize ceremonies.' },
    { name: 'Helsinki, Finland', lat: 60.1695, lng: 24.9354, hint: 'It has a famous island fortress called Suomenlinna.' }
];

const washingtonDC = { lat: 38.9072, lng: -77.0369 }; // Coordinates for Washington, D.C.

let targetLocation;
let guessMarker;
let line;
let hintCounter = 0;
let guessCounter = 0; // Counter for the number of guesses
const maxGuesses = 6; // Maximum number of allowed guesses

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1Y2VjMTQ3ZC1hOWFmLTQzOTEtYTVjZC0wODVhZWUzZjhkMjUiLCJpZCI6MjQ1MzgwLCJpYXQiOjE3Mjc4MTEzNDB9.59dsNiFREiVf0pHpoCxVzdOx4JKrXuvcS2tB0Y8aKws';

const viewer = new Cesium.Viewer('cesiumContainer', {
    imageryProvider: Cesium.createWorldImagery({
        style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
    }),
    terrainProvider: Cesium.createWorldTerrain(),
    baseLayerPicker: false,
    timeline: false,
    animation: false
});

// Function to get a random location
function getRandomLocation() {
    const randomIndex = Math.floor(Math.random() * locations.length);
    return locations[randomIndex];
}

// Function to calculate the distance between two points using Cesium's EllipsoidGeodesic
function calculateDistance(lat1, lng1, lat2, lng2) {
    const startCartographic = Cesium.Cartographic.fromDegrees(lng1, lat1);
    const endCartographic = Cesium.Cartographic.fromDegrees(lng2, lat2);
    const geodesic = new Cesium.EllipsoidGeodesic(startCartographic, endCartographic);
    return geodesic.surfaceDistance / 1000; // Return distance in kilometers
}

// Function to set proximity color based on distance
function getProximityColor(distance) {
    if (distance < 1500) return Cesium.Color.GREEN;
    else if (distance < 2000) return Cesium.Color.YELLOW;
    else return Cesium.Color.RED;
}

// Function to reset the game
function resetGame() {
    if (guessMarker) viewer.entities.remove(guessMarker);
    if (line) viewer.entities.remove(line);
    targetLocation = getRandomLocation();
    document.getElementById('distance').innerHTML = 'Distance: ';
    document.getElementById('hint').innerHTML = 'Hint: ';
    hintCounter = 0;
    guessCounter = 0; // Reset the guess counter
    console.log(`Target Location: ${targetLocation.name}`); // For testing
}

// Function to give hints
function giveHint() {
    if (hintCounter === 0) {
        document.getElementById('hint').innerHTML = `Hint: ${targetLocation.hint}`;
        hintCounter++;
    } else {
        document.getElementById('hint').innerHTML = 'No more hints available!';
    }
}

function flyToTarget() {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(targetLocation.lng, targetLocation.lat, 150000), // Adjust the altitude (last parameter) for zoom level
        orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-90), // Looking straight down
            roll: 0.0
        },
        duration: 2, // Time in seconds to complete the flight
    });
}

// Handle player guesses
viewer.screenSpaceEventHandler.setInputAction(function(click) {
    const cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
    if (cartesian) {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        const guessLat = Cesium.Math.toDegrees(cartographic.latitude);
        const guessLng = Cesium.Math.toDegrees(cartographic.longitude);

        // Remove previous guess marker
        if (guessMarker) viewer.entities.remove(guessMarker);
        // Remove previous line (only keep the updated one)
        if (line) viewer.entities.remove(line);

        // Add a marker for the guessed location
        guessMarker = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(guessLng, guessLat),
            point: {
                pixelSize: 10,
                color: Cesium.Color.BLUE
            }
        });

        // Calculate the distance between the guessed location and the target location
        const distanceFromGuessToTarget = calculateDistance(guessLat, guessLng, targetLocation.lat, targetLocation.lng);

        // Display the distance between the guessed location and the target location
        document.getElementById('distance').innerHTML = `Distance: ${distanceFromGuessToTarget.toFixed(2)} km`;

        // Draw a line between Washington, D.C. and the guessed location
        line = viewer.entities.add({
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArray([washingtonDC.lng, washingtonDC.lat, guessLng, guessLat]),
                width: 3,
                material: getProximityColor(distanceFromGuessToTarget)  // Color based on proximity of guess to target
            }
        });

        // Increment the guess counter
        guessCounter++;

        // Check if the guess is correct (within 50 km of the target)
        const correctDistance = calculateDistance(guessLat, guessLng, targetLocation.lat, targetLocation.lng);
        if (correctDistance < 100) {
            alert(`Congratulations! You found ${targetLocation.name}.`);
            resetGame();
        } else if (guessCounter >= maxGuesses) {
            alert(`Sorry, you've run out of guesses! The correct location was ${targetLocation.name}.`);
            
            // Fly to the correct location before resetting the game
            flyToTarget();
            
            // Use a timeout to reset the game after flying to the location
            setTimeout(resetGame, 3000);  // Wait 3 seconds before resetting
        }
    }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// Add event listener for reset button
document.getElementById('reset').addEventListener('click', resetGame);

// Add event listener for hint button
document.getElementById('getHint').addEventListener('click', giveHint);

// Start the game by resetting it
resetGame();

