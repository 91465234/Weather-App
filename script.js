const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const weatherInfoSection = document.querySelector('.weather-info')
//Taking every element of Weather Data
const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const conditionTxt = document.querySelector('.condition-txt')
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')
const forcastItemsContainer = document.querySelector('.forcast-items-container')

const apiKey = 'af4e26062784f37f5e9cdbb8bd3493de'

searchBtn.addEventListener('click', () => {
    weatherInfo()   
})

// Pressing Enter in the keyboard 
cityInput.addEventListener('keydown', (e) => {
    if(e.key == "Enter"){
        weatherInfo()
    } 
    // console.log(e)
})

// Putting the conditions of search icon in a function so that we can call it anywhere
function weatherInfo (){
    // Using trim to remove leading and trailing whitespaces
    if(cityInput && cityInput.value.trim() !== ""){
        // using .replace(/\s+/g, ' ') will remove extra spaces in between the words and display on single space
        const formattedCity = cityInput.value.trim().replace(/\s+/g, ' ')
            // console.log(formattedCity)
        // after pressing search icon the content will be removed from the input field
            updateWeatherInfo(cityInput.value)
            cityInput.value = ''
            cityInput.blur()
    }   
}

async function getFetchData(endPoint, city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)
    return response.json()
}

// Specify the Icon with ID

function getWeatherIcon (id){
   if (id <=232) return 'thunderstorm.svg'
   if (id <=321) return 'drizzle.svg'
   if (id <=531) return 'rain.svg'
   if (id <=321) return 'drizzle.svg'
   if (id <=622) return 'snow.svg'
   if (id <=781) return 'atmosphere.svg'
   if (id <=800) return 'clear.svg'
   else return 'clouds.svg'
}
// Curent Date function 
function getCurrentDate(){
    const currentDate = new Date()
    const options ={
        weekday : 'short',
        day:'2-digit',
        month:'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}
async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city)
   if(weatherData.cod != 200){
    showDisplaySection(notFoundSection)
    return
   }
//    console.log(weatherData)
   // Take each important value and store into a variable
   const {
    name:country,
    main: {temp, humidity},
    weather: [{id,main}],
    wind: {speed}
   } = weatherData

   //Match the value with API Data
   countryTxt.textContent = country;
   tempTxt.textContent = Math.round(temp) + '°C'
   conditionTxt.textContent = main
   humidityValueTxt.textContent = humidity + '%'
   windValueTxt.textContent = speed + 'M/S'
   currentDateTxt.textContent = getCurrentDate()
   weatherSummaryImg.src = `weather/${getWeatherIcon(id)}`

   await updateForecastInfo(city)
   showDisplaySection(weatherInfoSection)
   
}

async function updateForecastInfo(city){
    const forecastData = await getFetchData('forecast', city)
    const timeTaken = "12:00:00"
    const todayDate = new Date().toISOString().split('T')[0]
    forcastItemsContainer.innerHTML = ""
    forecastData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastItems(forecastWeather)
        }       
    } )  
}

function updateForecastItems(weatherData){
    console.log(weatherData)
    const {
        dt_txt:date,
        weather:[{ id }],
        main : {temp}
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day:'2-digit',
        month : 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-Us', dateOption)
    const forecastItem = `
    <div class="forcast-item">
                    <h5 class="forcast-item-date regular-txt">${dateResult}</h5>
                    <img src="weather/${getWeatherIcon(id)}"  class="forcast-item-img">
                    <h5 class="forcast-item-temp">${Math.round(temp)}°C</h5>
                </div>
    `
    forcastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}



function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundSection]
    .forEach(section => section.style.display = "none")
    section.style.display = 'flex'
}
