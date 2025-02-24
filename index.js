const container = document.querySelector(".container");
const search = document.querySelector(".search-box button");
const searchInput = document.querySelector(".search-box input");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

const weatherImages = {
	Clear: "images/clear.png",
	Rain: "images/rain.png",
	Snow: "images/snow.png",
	Clouds: "images/cloud.png",
	Mist: "images/wind.png",
};

const convertKelvinToCelsius = (k) => Math.round(k - 273.15);

const displayWeatherData = (weatherData) => {
	console.log(weatherData);
	const image = document.querySelector(".weather-box img");
	const temperature = document.querySelector(".weather-box .temperature");
	const description = document.querySelector(".weather-box .description");
	const humidity = document.querySelector(".weather-details .humidity span");
	const wind = document.querySelector(".weather-details .wind span");

	image.src = weatherImages[weatherData.weather[0].main] || "";
	image.alt = weatherData.weather[0].description;

	temperature.innerHTML = `${convertKelvinToCelsius(
		weatherData.main.temp
	)}<span>°C</span>`;
	description.innerHTML = weatherData.weather[0].description;
	humidity.innerHTML = `${weatherData.main.humidity}%`;
	wind.innerHTML = `${parseInt(weatherData.wind.speed)}Km/h`;

	weatherBox.style.display = "";
	weatherDetails.style.display = "";
	weatherBox.classList.add("fade-in");
	weatherDetails.classList.add("fade-in");
	container.style.height = "500px";
};

const DisplayError = () => {
	container.style.height = "400px";
	weatherBox.style.display = "none";
	weatherDetails.style.display = "none";
	error404.style.display = "block";
	error404.classList.add("fade-in");
};

async function translate(place) {
	const api = "AIzaSyAROxfODwHOLINsx3YF6cPe5_xsTxWIOB4";
	const url = `https://translation.googleapis.com/language/translate/v2?key=${api}`;
	console.log("translate url : ", url);
	const response = await fetch(url, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			q: place,
			source: "zh-TW",
			target: "en",
			format: "text",
		}),
	});

	const data = await response.json();
	return data.data.translations[0].translatedText;
}

const fetchWeatherData = async (city) => {
	try {
		if (!city) return;

		let translatedCity;
		try {
			translatedCity = await translate(city);
		} catch (error) {
			translatedCity = city;
		}

		const APIKey = "2c75039348d401010420162c8e236a54";
		const url = `https://api.openweathermap.org/data/2.5/weather?appid=${APIKey}&q=${translate(
			city
		)}`;
		const response = await fetch(url);
		const data = await response.json();

		if (data.cod === "404") {
			DisplayError();
			return;
		}

		error404.style.display = "none";
		error404.classList.remove("fade-in");
		displayWeatherData(data);
	} catch (error) {
		console.error("Error fetching weather data : ", error);
		DisplayError();
	}
};

search.addEventListener("click", () => {
	fetchWeatherData(searchInput.value);
});
searchInput.addEventListener("keypress", (e) => {
	if (e.key === "Enter") {
		fetchWeatherData(searchInput.value);
	}
});
