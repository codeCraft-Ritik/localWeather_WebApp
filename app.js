window.addEventListener('load', () => {
    let long;
    let lat;
    
    // Select DOM elements
    const temperatureDescription = document.querySelector('.temperature-description');
    const temperatureDegree = document.querySelector('.temperature-degree');
    const locationTimezone = document.querySelector('.location-timezone');
    const locationIcon = document.querySelector('.weather-icon');
    const degreeSection = document.querySelector('.degree-section');
    const degreeSpan = document.querySelector('.degree-section span');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            // Using a proxy to avoid CORS issues
            const proxy = `https://cors-anywhere.herokuapp.com/`;
            const api = `${proxy}https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=b86fd8f7708187a762619d1377a88ec7`;

            fetch(api)
                .then(response => {
                    if (!response.ok) throw new Error("Network response was not ok");
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    const { temp } = data.main; // Using main temp
                    const { description, icon } = data.weather[0];

                    // Set DOM elements from the API
                    temperatureDegree.textContent = Math.floor(temp);
                    temperatureDescription.textContent = description.toUpperCase();
                    locationTimezone.textContent = data.name;
                    
                    // Set Icon
                    locationIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png">`;

                    // Formula for Fahrenheit
                    let fahrenheit = (temp * 9 / 5) + 32;

                    // Change temperature to Celsius/Fahrenheit
                    degreeSection.addEventListener('click', () => {
                        if (degreeSpan.textContent === "°C") {
                            degreeSpan.textContent = "°F";
                            temperatureDegree.textContent = Math.floor(fahrenheit);
                        } else {
                            degreeSpan.textContent = "°C";
                            temperatureDegree.textContent = Math.floor(temp);
                        }
                    });
                })
                .catch(err => {
                    locationTimezone.textContent = "Error fetching weather data";
                    console.error(err);
                });
        });
    } else {
        locationTimezone.textContent = "Please enable location services";
    }
});