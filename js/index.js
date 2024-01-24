// Dados para obter informações da API do openweather.
const api = {
    key: "64ed82577ced7f69cb1687f0ce536131",
    base: "https://api.openweathermap.org/data/2.5/",
    lang: "pt_br",
    units: "metric"
};

let temp_number = document.querySelector(".container_temp div");
let temp_unit = document.querySelector(".container_temp span");
const trick = document.querySelector(".trick");

/* Verifica se o botão de aviso foi clicado 
   armazenando a informação no localStorage. Caso
   já tenha sido clicado, o botão não será exibido
   novamente. */
const verify = localStorage.getItem("button")
if (verify === "accessed") {
    trick.style.display = "none"
} else {
    trick.style.display = "block"
}

// Função que exibe ou não o botão de aviso.
// Configurações da animação do botão.
function showBarInfo() {
    const text = document.querySelector(".txt");
    const question = document.querySelector(".fa-question");
    if (trick.style.width === "") {
        setTimeout(function () {
            trick.style.width = "200px";
            question.style.animation = "anim 0.5s linear";
        }, 1);
        setTimeout(function () {
            question.style.display = "none";
        }, 500);
        setTimeout(function () {
            text.style.animation = "anim2 1s linear";
            text.style.display = "block";
        }, 700);
    }
    window.addEventListener("click", () => {
        if (trick.style.width === "200px") {
            setTimeout(function () {
                localStorage.setItem("button", "accessed")
                question.style.display = "none";
                trick.style.transform = "translateX(-50px)";
                text.style.animation = "hide 0.2s linear";
                trick.style.width = "80px";
                trick.style.transform = "translateX(-50px)";
                trick.style.borderRadius = "100%";
                trick.style.backgroundColor = "#00cd31";
                trick.innerHTML = "<p>&#129299;</p>";
                text.style.display = "none";
            }, 10);
            setTimeout(function () {
                trick.style.width = "0";
                trick.style.transform = "translateX(0)";
            }, 1000);
        }
    });
}

// Obtem as informações demográficas do navegador.
window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    } else {
        alert("navegador não suporta geolozalicação!");
    }
    function setPosition(position) {
        console.log(position);
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        coordResults(lat, long);
    }
    function showError(error) {
        alert(`erro: ${error.message}`);
    }
});

/* Usa as informações demográficas do navegador 
   para consumir a API. */
function coordResults(lat, long) {
    fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`http error: status ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        alert(error.message);
    })
    .then(response => {
        displayResults(response);
    });
}

/* Adiciona evento no input de pesquisa de região,
   ao apertar o botão de confirmar, a buscar feita */
let search = document.querySelector(".search");
search.addEventListener("keypress", enter);
function enter(event) {
    key = event.keyCode;
    if (key === 13) {
        searchResults(search.value);
    }
}

// Aqui os dados são tratados ao confirmar no input.
function searchResults(city) {
    fetch(`${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`http error: status ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        alert(error.message);
    })
    .then(response => {
        displayResults(response);
    });
}

/* Trata os dados de dias da semana, dias do mês,
   mêses e anos. */
function dateBuilder(d) {
    let days = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado"
    ];
    let months = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julio",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    let day = days[d.getDay()]; //getDay: 0-6
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
}

/* Função responsável por requisitar e tratar os
   dados do clima. */
function displayResults(weather) {
    const card = document.querySelector(".card");
    const wind_v = document.querySelector(".wind");
    let therm_value = document.querySelector(".thermal_value");
    let clouds = document.querySelector(".clouds");
    let humidity = document.querySelector(".humidity");
    let low_high = document.querySelector(".low-high");
    let clima = document.querySelector(".weather");
    let date = document.querySelector(".date");
    let city = document.querySelector(".city");
    city.innerText = `${weather.name}`.toUpperCase();

    let now = new Date();
    date.innerText = dateBuilder(now);

    let iconName = weather.weather[0].icon;

    const contain_cloud = document.querySelector(".contain_cloud");
    contain_cloud.innerHTML = `<img class="cloud" src="./icons/${iconName}.png">`;

    let a = now.toLocaleString("pt-br", {
        hour: "numeric",
        hour12: true
    });
    let b = a.indexOf("PM") > -1;
    let num = parseInt(a);

    if (b === true) {
        if (num >= 0 && num <= 5) {
            card.style.backgroundImage = "url('/assets/afternoon.jpg')";
            card.style.color = "white";
        }
        if (num >= 6 && num <= 11) {
            card.style.backgroundImage = "url('/assets/night.jpg')";
            card.style.color = "white";
        }
    } else {
        if (num >= 0 && num <= 5) {
            card.style.backgroundImage = "url('/assets/morning.jpg')";
        }
        if (num >= 6 && num <= 11) {
            card.style.backgroundImage = "url('/assets/day.jpg')";
        }
    }

    let temperature = `${Math.round(weather.main.temp)}`;
    temp_number.innerHTML = temperature;
    temp_unit.innerHTML = `°c`;

    let weather_tempo = weather.weather[0].description;
    clima.innerText = capitalizeFirstLetter(weather_tempo);

    low_high.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
    
    let wind = weather.wind.speed;
    wind_v.innerText = wind + "km/h";

    let humid = weather.main.humidity;
    humidity.innerText = humid + "%";

    let clouds_value = weather.clouds.all;
    clouds.innerText = clouds_value + "%";

    let thermal_sensation = weather.main.feels_like;
    therm_value.innerText = thermal_sensation + "°";
}

// Muda a unidade de medida de temperatura.
let card_contain = document.querySelector(".container_temp");
card_contain.addEventListener("click", changeTemp);
function changeTemp() {
    temp_number_now = temp_number.innerHTML;

    if (temp_unit.innerHTML === "°c") {
        let f = temp_number_now * 1.8 + 32;
        temp_unit.innerHTML = "°f";
        temp_number.innerHTML = Math.round(f);
    } else {
        let c = (temp_number_now - 32) / 1.8;
        temp_unit.innerHTML = "°c";
        temp_number.innerHTML = Math.round(c);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
