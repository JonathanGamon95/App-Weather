import './App.css'
import CurrentWeather from './assets/componentes/currentWeather'

function App() {
  // cambia de temas
  const changeTheme = () => {document.documentElement.classList.toggle("tema-oscuro")}

  return (
    <>
      <div className="
            app-container
            w-full min-h-screen
            sm:w-[420px] sm:min-h-[800px] 
            p-[20px] sm:rounded-2xl">
        <br />
        <h1 className="text-center text-2xl font-bold">Buenos Aires</h1>
        <br />
        {/* pronostico */}
        <CurrentWeather />
        <br />
        <p className="author text-center text-xl">Jonathan Gamon - Wheater App 2025</p>
        <br />
        <div className="flex justify-center">
          <span onClick={changeTheme} className="theme-button cursor-pointer"><i
            className="bi bi-bullseye flex items-center text-5xl"></i></span>
        </div>
      </div>
    </>
  )
}

export default App
