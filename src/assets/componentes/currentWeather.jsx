import { useState } from "react";

const iconos = {
    0: "☀️",    // Cielo despejado
    1: "🌤️",   // Mayormente despejado
    2: "⛅",    // Parcialmente nublado
    3: "☁️",    // Nublado
    45: "🌫️",  // Neblina
    48: "🌫️",  // Neblina con escarcha
    51: "🌦️",  // Llovizna ligera
    53: "🌦️",  // Llovizna moderada
    55: "🌧️",  // Llovizna densa
    56: "🌧️",  // Llovizna helada ligera
    57: "🌧️",  // Llovizna helada densa
    61: "🌦️",  // Lluvia ligera
    63: "🌧️",  // Lluvia moderada
    65: "🌧️",  // Lluvia intensa
    66: "🌧️",  // Lluvia helada ligera
    67: "🌧️",  // Lluvia helada intensa
    71: "🌨️",  // Nevadas ligeras
    73: "🌨️",  // Nevadas moderadas
    75: "❄️",   // Nevadas intensas
    77: "🌨️",  // Gránulos de nieve
    80: "🌦️",  // Chubascos ligeros
    81: "🌧️",  // Chubascos moderados
    82: "⛈️",  // Chubascos violentos
    85: "🌨️",  // Chubascos de nieve ligeros
    86: "❄️",   // Chubascos de nieve intensos
    95: "⛈️",  // Tormenta (ligera o moderada)
    96: "⛈️",  // Tormenta con granizo ligero
    99: "⛈️"   // Tormenta con granizo intenso
};

const espesificacion = {
    0: "Cielo despejado",
    1: "Mayormente despejado",
    2: "Parcialmente nublado",
    3: "Nublado",
    45: "Neblina",
    48: "Neblina con escarcha",
    51: "Llovizna ligera",
    53: "Llovizna moderada",
    55: "Llovizna densa",
    56: "Llovizna helada ligera",
    57: "Llovizna helada densa",
    61: "Lluvia ligera",
    63: "Lluvia moderada",
    65: "Lluvia intensa",
    66: "Lluvia helada ligera",
    67: "Lluvia helada intensa",
    71: "Nevadas ligeras",
    73: "Nevadas moderadas",
    75: "Nevadas intensas",
    77: "Gránulos de nieve",
    80: "Chubascos ligeros",
    81: "Chubascos moderados",
    82: "Chubascos violentos",
    85: "Chubascos de nieve ligeros",
    86: "Chubascos de nieve intensos",
    95: "Tormenta (ligera o moderada)",
    96: "Tormenta con granizo ligero",
    99: "Tormenta con granizo intenso"
}

function CurrentWeather() {
    const [weather, setWeather] = useState({
        currentIcon: "❓",
        currentTemperature: "0°",
        currentDescription: "Sin Datos",
        currentPrain: "0%",
        Humadity: "0%",

        todayIcon0: "❓",
        todayMin0: "0°",
        todayMax0: "0°",

        todayIcon1: "❓",
        todayMin1: "0°",
        todayMax1: "0°",

        todayIcon2: "❓",
        todayMin2: "0°",
        todayMax2: "0°",

        todayIcon3: "❓",
        todayMin3: "0°",
        todayMax3: "0°",

        todayIcon4: "❓",
        todayMin4: "0°",
        todayMax4: "0°"
    });


    // pronostico actual
    function apiCurrent() {
        const url = "https://api.open-meteo.com/v1/forecast?latitude=-34.6131&longitude=-58.3772&hourly=precipitation_probability&current=temperature_2m,weather_code,relative_humidity_2m&timezone=auto";

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`❌ Error al acceder a la API. Código: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {

                const times = data.hourly.time;
                const precipitation = data.hourly.precipitation_probability;

                // current.time = "2025-11-16T21:15"
                // Lo convertimos a "2025-11-16T21:00"
                const currentTimeRaw = data.current.time;
                const currentTime = currentTimeRaw.slice(0, 13) + ":00";

                // console.log("currentTime normalizado:", currentTime);

                let contador = 0;

                for (let i = 0; i < precipitation.length; i++) {

                    contador++;

                    if (times[i] === currentTime) {
                        // console.log("Coincidencia encontrada en el índice:", i);
                        // console.log("Valor de precipitation_probability:", precipitation[i]);
                        // console.log("Valor final de contador:", contador);
                        break;
                    }
                }

                setWeather(prev => ({
                    ...prev,
                    currentIcon: iconos[data.current.weather_code],
                    currentTemperature: parseInt(data.current.temperature_2m) + "°",
                    currentDescription: espesificacion[data.current.weather_code],
                    currentPrain: data.hourly.precipitation_probability[contador] + "%",
                    Humadity: data.current.relative_humidity_2m + "%"
                }));

                console.log("api pronostico actual cargado correctamente");
            })
            .catch(error => console.error("❌ Error en fetch:", error));
    }




    // pronostico dias
    function daysApi() {
        // aca va la api
        const weather_Days = "https://api.open-meteo.com/v1/forecast?latitude=-34.6131&longitude=-58.3772&daily=weather_code,temperature_2m_max,temperature_2m_min";

        fetch(weather_Days)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`❌ Error al acceder a la API. Código de estado: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setWeather(prev => ({
                    ...prev,

                    todayIcon0: iconos[data.daily.weather_code[0]],
                    todayMin0: parseInt(data.daily.temperature_2m_min[0]) + "°",
                    todayMax0: parseInt(data.daily.temperature_2m_max[0]) + "°",

                    todayIcon1: iconos[data.daily.weather_code[1]],
                    todayMin1: parseInt(data.daily.temperature_2m_min[1]) + "°",
                    todayMax1: parseInt(data.daily.temperature_2m_max[1]) + "°",

                    todayIcon2: iconos[data.daily.weather_code[2]],
                    todayMin2: parseInt(data.daily.temperature_2m_min[2]) + "°",
                    todayMax2: parseInt(data.daily.temperature_2m_max[2]) + "°",

                    todayIcon3: iconos[data.daily.weather_code[3]],
                    todayMin3: parseInt(data.daily.temperature_2m_min[3]) + "°",
                    todayMax3: parseInt(data.daily.temperature_2m_max[3]) + "°",

                    todayIcon4: iconos[data.daily.weather_code[4]],
                    todayMin4: parseInt(data.daily.temperature_2m_min[4]) + "°",
                    todayMax4: parseInt(data.daily.temperature_2m_max[4]) + "°"
                }));
                console.log("api pronostico dias cargado correctamente")
            })

            .catch(error => {
                console.error("❌ Error al obtener los datos del clima:", error.message);
            });
    }



    return (
        <>
            <div className="
            weather-icon-container
            relative
            flex justify-center items-center
            h-[150px] sm:h-[200px]">
                <span className="
                weather-icon
                text-9xl">{weather.currentIcon}</span>

                <button onClick={() => (apiCurrent(), daysApi())} className="
                button-recet
                cursor-pointer
                absolute bottom-2 right-10 text-4xl">
                    <i className="bi bi-repeat"></i>
                </button>
            </div>

            <div className="temperature-current-container flex gap-4">
                <h1 className="text-8xl">{weather.currentTemperature}</h1>

                <div className="data-day flex flex-col justify-end">
                    <p>{weather.currentDescription}</p>
                    <p>Prob. lluvia <span>{weather.currentPrain}</span></p>
                    <p>Humedad <span>{weather.Humadity}</span></p>
                </div>
            </div>
            <br />
            <br />
            <section className="
                grid grid-cols-5 grid-rows-1 gap-2
                h-[100px]">
                <div className="
                    temperature-min-max-container
                    flex flex-col items-center justify-center
                    bg-[aliceblue] rounded-2xl">
                    <h2>Hoy</h2>
                    <span className="text-4xl">{weather.todayIcon0}</span>
                    <p className="">
                        <span id="temperature_min">{weather.todayMin0}</span>
                        |
                        <span id="temperature_max">{weather.todayMax0}</span>
                    </p>
                </div>

                <div className="
                    temperature-min-max-days
                    col-span-4 col-start-2
                    grid grid-cols-4 grid-rows-1 gap-2
                    bg-[aliceblue] rounded-2xl">

                    <div className="
                        flex flex-col items-center justify-center">
                        <h2>Mañ</h2>
                        <span className="text-4xl">{weather.todayIcon1}</span>
                        <p className="">
                            <span id="temperature_min_1">{weather.todayMin1}</span>
                            |
                            <span id="temperature_max_1">{weather.todayMax1}</span>
                        </p>
                    </div>

                    <div className="
                        flex flex-col items-center justify-center">
                        <h2>P.Mañ</h2>
                        <span className="text-4xl">{weather.todayIcon2}</span>
                        <p className="">
                            <span id="temperature_min_1">{weather.todayMin2}</span>
                            |
                            <span id="temperature_max_1">{weather.todayMax2}</span>
                        </p>
                    </div>

                    <div className="
                        flex flex-col items-center justify-center">
                        <h2>T.P.Mañ</h2>
                        <span className="text-4xl">{weather.todayIcon3}</span>
                        <p className="">
                            <span id="temperature_min_1">{weather.todayMin3}</span>
                            |
                            <span id="temperature_max_1">{weather.todayMax3}</span>
                        </p>
                    </div>

                    <div className="
                        flex flex-col items-center justify-center">
                        <h2>Ul.Dia</h2>
                        <span className="text-4xl">{weather.todayIcon4}</span>
                        <p className="">
                            <span id="temperature_min_1">{weather.todayMin4}</span>
                            |
                            <span id="temperature_max_1">{weather.todayMax4}</span>
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default CurrentWeather;