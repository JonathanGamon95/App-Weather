import { useState, useEffect } from "react";

const iconos = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌦️",
    55: "🌧️",
    56: "🌧️",
    57: "🌧️",
    61: "🌦️",
    63: "🌧️",
    65: "🌧️",
    66: "🌧️",
    67: "🌧️",
    71: "🌨️",
    73: "🌨️",
    75: "❄️",
    77: "🌨️",
    80: "🌦️",
    81: "🌧️",
    82: "⛈️",
    85: "🌨️",
    86: "❄️",
    95: "⛈️",
    96: "⛈️",
    99: "⛈️"
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
};

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

    // Pronóstico actual
    async function apiCurrent() {
        const url =
            "https://api.open-meteo.com/v1/forecast?latitude=-34.6131&longitude=-58.3772&hourly=precipitation_probability&current=temperature_2m,weather_code,relative_humidity_2m&timezone=auto";

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            const times = data.hourly.time;
            const precipitation = data.hourly.precipitation_probability;

            const currentTimeRaw = data.current.time;
            const currentTime = currentTimeRaw.slice(0, 13) + ":00";

            let contador = 0;

            for (let i = 0; i < precipitation.length; i++) {
                if (times[i] === currentTime) {
                    contador = i;
                    break;
                }
            }

            setWeather(prev => ({
                ...prev,
                currentIcon: iconos[data.current.weather_code],
                currentTemperature:
                    parseInt(data.current.temperature_2m) + "°",
                currentDescription:
                    espesificacion[data.current.weather_code],
                currentPrain:
                    data.hourly.precipitation_probability[contador] + "%",
                Humadity:
                    data.current.relative_humidity_2m + "%"
            }));

            console.log("API pronóstico actual cargada correctamente");

        } catch (error) {
            console.error("❌ Error en fetch:", error);
            alert("❌ Error al obtener datos del clima");
        }
    }

    // Pronóstico días
    async function daysApi() {
        const weather_Days =
            "https://api.open-meteo.com/v1/forecast?latitude=-34.6131&longitude=-58.3772&daily=weather_code,temperature_2m_max,temperature_2m_min";

        try {
            const response = await fetch(weather_Days);

            if (!response.ok) {
                throw new Error(
                    `❌ Error al acceder a la API. Código: ${response.status}`
                );
            }

            const data = await response.json();

            setWeather(prev => ({
                ...prev,

                todayIcon0: iconos[data.daily.weather_code[0]],
                todayMin0:
                    parseInt(data.daily.temperature_2m_min[0]) + "°",
                todayMax0:
                    parseInt(data.daily.temperature_2m_max[0]) + "°",

                todayIcon1: iconos[data.daily.weather_code[1]],
                todayMin1:
                    parseInt(data.daily.temperature_2m_min[1]) + "°",
                todayMax1:
                    parseInt(data.daily.temperature_2m_max[1]) + "°",

                todayIcon2: iconos[data.daily.weather_code[2]],
                todayMin2:
                    parseInt(data.daily.temperature_2m_min[2]) + "°",
                todayMax2:
                    parseInt(data.daily.temperature_2m_max[2]) + "°",

                todayIcon3: iconos[data.daily.weather_code[3]],
                todayMin3:
                    parseInt(data.daily.temperature_2m_min[3]) + "°",
                todayMax3:
                    parseInt(data.daily.temperature_2m_max[3]) + "°",

                todayIcon4: iconos[data.daily.weather_code[4]],
                todayMin4:
                    parseInt(data.daily.temperature_2m_min[4]) + "°",
                todayMax4:
                    parseInt(data.daily.temperature_2m_max[4]) + "°"
            }));

            console.log("API pronóstico días cargada correctamente");

        } catch (error) {
            console.error(
                "❌ Error al obtener los datos del clima:",
                error.message
            );
        }
    }

    // Ejecutar UNA sola vez al cargar el componente
    useEffect(() => {
        apiCurrent();
        daysApi();
    }, []);

    // Valores pronósticos de días
    const dayLabels = ["Mañ", "P.Mañ", "T.P.Mañ", "Ul.Dia"];

    const dayData = dayLabels.map((label, index) => ({
        label,
        icon: weather[`todayIcon${index + 1}`],
        min: weather[`todayMin${index + 1}`],
        max: weather[`todayMax${index + 1}`]
    }));

    return (
        <>
            <div
                className="
                weather-icon-container
                relative
                flex justify-center items-center
                h-[150px] sm:h-[200px]"
            >
                <span
                    className="
                    weather-icon
                    text-9xl"
                >
                    {weather.currentIcon}
                </span>

                <button
                    onClick={() => {
                        apiCurrent();
                        daysApi();
                    }}
                    className="
                    button-recet
                    cursor-pointer
                    absolute bottom-2 right-10 text-4xl"
                >
                    <i className="bi bi-repeat"></i>
                </button>
            </div>

            <div className="temperature-current-container flex gap-4">
                <h1 className="text-8xl">
                    {weather.currentTemperature}
                </h1>

                <div className="data-day flex flex-col justify-end">
                    <p>{weather.currentDescription}</p>

                    <p>
                        Prob. lluvia{" "}
                        <span>{weather.currentPrain}</span>
                    </p>

                    <p>
                        Humedad <span>{weather.Humadity}</span>
                    </p>
                </div>
            </div>

            <br />
            <br />

            <section
                className="
                grid grid-cols-5 grid-rows-1 gap-2
                h-[100px]"
            >
                <div
                    className="
                    temperature-min-max-container
                    flex flex-col items-center justify-center
                    bg-[aliceblue] rounded-2xl"
                >
                    <h2>Hoy</h2>

                    <span className="text-4xl">
                        {weather.todayIcon0}
                    </span>

                    <p>
                        <span id="temperature_min">
                            {weather.todayMin0}
                        </span>

                        |

                        <span id="temperature_max">
                            {weather.todayMax0}
                        </span>
                    </p>
                </div>

                <div
                    className="
                    temperature-min-max-days
                    col-span-4 col-start-2
                    grid grid-cols-4 grid-rows-1 gap-2
                    bg-[aliceblue] rounded-2xl"
                >
                    {dayData.map((item, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center justify-center"
                        >
                            <h2>{item.label}</h2>

                            <span className="text-4xl">
                                {item.icon}
                            </span>

                            <p>
                                <span>{item.min}</span> |{" "}
                                <span>{item.max}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

export default CurrentWeather;