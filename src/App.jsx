import Header from "./components/Header"
import SearchingSection from "./components/SerchingSection";
import WeatherSection from "./components/WeatherSection";
import Empty from "./components/Empty";
import LoadingSpinner from "./components/LoadingSpinner";
import { useState, useEffect } from "react";

export default function App() {

  const loadLatitudeFromStorage = () => {
    try {
      const saved = localStorage.getItem('latitude');
      if (saved) {
        return saved;
      }
    } catch (error) {
      console.error('Ошибка при чтении из localStorage:', error);
    }
    // Если ничего нет в localStorage, возвращаем значения по умолчанию
    return '';
  };

  const loadLongitudeFromStorage = () => {
    try {
      const saved = localStorage.getItem('longitude');
      if (saved) {
        return saved;
      }
    } catch (error) {
      console.error('Ошибка при чтении из localStorage:', error);
    }
    // Если ничего нет в localStorage, возвращаем значения по умолчанию
    return '';
  };

  const loadCityFromStorage = () => {
    try {
      const saved = localStorage.getItem('city');
      if (saved) {
        return saved;
      }
    } catch (error) {
      console.error('Ошибка при чтении из localStorage:', error);
    }
    // Если ничего нет в localStorage, возвращаем значения по умолчанию
    return '';
  };

  const loadCountryFromStorage = () => {
    try {
      const saved = localStorage.getItem('country');
      if (saved) {
        return saved;
      }
    } catch (error) {
      console.error('Ошибка при чтении из localStorage:', error);
    }
    // Если ничего нет в localStorage, возвращаем значения по умолчанию
    return '';
  };

  const [latitude, setLatitude] = useState(loadLatitudeFromStorage);
  const [longitude, setLongitude] = useState(loadLongitudeFromStorage);
  const [city, setCity] = useState(loadCityFromStorage);
  const [country, setCountry] = useState(loadCountryFromStorage);
  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyWeather, setHourlyWeather] = useState([]);
  const [dailyWeather, setDailyWeather] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadUnitsFromStorage = () => {
    try {
      const saved = localStorage.getItem('units');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Проверяем, что структура правильная
        return {
          temperature: parsed.temperature || 'celsius',
          wind: parsed.wind || 'km/h',
          precipitation: parsed.precipitation || 'mm'
        };
      }
    } catch (error) {
      console.error('Ошибка при чтении из localStorage:', error);
    }
    // Если ничего нет в localStorage, возвращаем значения по умолчанию
    return {
      temperature: 'celsius',
      wind: 'km/h',
      precipitation: 'mm'
    };
  };

  const [units, setUnits] = useState(loadUnitsFromStorage);

  useEffect(() => {
    localStorage.setItem('units', JSON.stringify(units));
  }, [units]);

  const handleUnitsUpdate = (newUnits) => {
    setUnits(newUnits);
  }

  //Ассинхронная функция получения координат
  async function GetData(params) {
    const encodedCity = encodeURIComponent(params);
    const GeocodingAPI = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=1&language=ru&format=json`;
    try {
      const response = await fetch(GeocodingAPI);
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        setError(true);
        setSuccess(false);
        setLoading(true);
        return ({ success: false });
      }
      const city = data.results[0];

      setLatitude(city.latitude);
      setLongitude(city.longitude);
      setCity(city.name);
      setCountry(city.country);
      setSuccess(true);
      setError(false);
      setLoading(false);
      return ({ success: true });
    }
    catch (error) {
      console.error("Не удалось получить данные:", error);
      setError(true);
      setSuccess(false);
      setLoading(false);
      return { success: false };
    }
  }

  //Запись в localstorage
  useEffect(() => {
    localStorage.setItem('latitude', latitude);
    localStorage.setItem('longitude', longitude);
    localStorage.setItem('city', city);
    localStorage.setItem('country', country);
  }, [latitude, longitude, city, country]);

  const WeatherAPI = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=weather_code,temperature_2m&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation,relative_humidity_2m&timezone=auto`;


  //Ассинхронная функция получения погоды
  async function GetWeather() {
    try {
      const response = await fetch(WeatherAPI);
      const weather = await response.json();
      const current = weather.current;
      const daily = weather.daily;
      const hourly = weather.hourly;

      //Преобразуем из объекта массивов в массив объектов
      const dailyForecast = daily.time.map((dateString, index) => {
        return {
          date: dateString,
          tempMax: daily.temperature_2m_max[index],
          tempMin: daily.temperature_2m_min[index],
          weatherCode: daily.weather_code[index]
        };
      });

      //Преобразуем из объекта массивов в массив объектов
      const hourlyForecast = hourly.time.map((timeString, index) => {
        return {
          date: timeString,
          hourTemp: hourly.temperature_2m[index],
          hourWeatherCode: hourly.weather_code[index]
        };
      });

      //Форматирование даты/времени
      const dailyFormatter = new Intl.DateTimeFormat('en-EN', { weekday: "short" });
      const hourlyFormatter = new Intl.DateTimeFormat('en-EN', { hour: 'numeric', hour12: true });

      //Добавляем дни недели
      const updatedDates = dailyForecast.map(date => ({
        ...date,
        dayOfWeek: dailyFormatter.format(new Date(date.date))
      }));

      //Добавляем формат времени
      const updatedHours = hourlyForecast.map(hour => ({
        ...hour,
        hourFormat: hourlyFormatter.format(new Date(hour.date))
      }));

      setCurrentWeather({
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        precipitation: current.precipitation,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
        time: current.time
      })

      setDailyWeather(updatedDates);

      setHourlyWeather(updatedHours)

    }
    catch (error) {
      console.error("Не удалось получить данные:", error);
    }

  }


  //Добавление в state всех нужных данных
  useEffect(() => {

    if (!latitude || !longitude) {
      return;
    }
    GetWeather();

  }, [latitude, longitude]);


  //Автообновление ланных каждые 15 минут
  useEffect(() => {
    if (!latitude && !longitude) {
      return;
    }
    const intervalId = setInterval(() => {
      GetWeather()

    }, 15 * 60 * 1000);

    return () => {
      clearInterval(intervalId);
    }
  }, [latitude, longitude]);

  return (
    <div className='wrapper'>
      <Header onChange={handleUnitsUpdate} weatherUnits={units} />
      <main>
        <SearchingSection
          onSearch={GetData}
          searchSuccess={success}
          searchError={error}
          loading={loading}
        />
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="error-container">
          </div>
        ) : !latitude || !longitude || !city || !country ? (
          <Empty />
        ) : (
          <WeatherSection
            current={currentWeather}
            daily={dailyWeather}
            hourly={hourlyWeather}
            city={city}
            country={country}
            weatherUnits={units}
          />
        )}
      </main>
    </div>
  );
}