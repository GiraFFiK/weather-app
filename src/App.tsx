import Header from "./components/Header";
import SearchingSection from "./components/SerchingSection";
import WeatherSection from "./components/WeatherSection";
import Empty from "./components/Empty";
import LoadingSpinner from "./components/LoadingSpinner";
import { useState, useEffect } from "react";

export default function App() {
  const loadLatitudeFromStorage = (): string => {
    try {
      const saved = localStorage.getItem("latitude");
      if (saved) {
        return saved;
      }
    } catch (error) {
      console.error("Ошибка при чтении из localStorage:", error);
    }
    // Если ничего нет в localStorage, возвращаем значения по умолчанию
    return "";
  };

  const loadLongitudeFromStorage = (): string => {
    try {
      const saved = localStorage.getItem("longitude");
      if (saved) {
        return saved;
      }
    } catch (error) {
      console.error("Ошибка при чтении из localStorage:", error);
    }
    // Если ничего нет в localStorage, возвращаем значения по умолчанию
    return "";
  };

  const loadCityFromStorage = (): string => {
    try {
      const saved = localStorage.getItem("city");
      if (saved) {
        return saved;
      }
    } catch (error) {
      console.error("Ошибка при чтении из localStorage:", error);
    }
    // Если ничего нет в localStorage, возвращаем значения по умолчанию
    return "";
  };

  const loadCountryFromStorage = (): string => {
    try {
      const saved = localStorage.getItem("country");
      if (saved) {
        return saved;
      }
    } catch (error) {
      console.error("Ошибка при чтении из localStorage:", error);
    }
    // Если ничего нет в localStorage, возвращаем значения по умолчанию
    return "";
  };

  interface CurrentWeather {
    time: string;
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    weatherCode: number;
  }

  interface daily {
    date: string;
    day?: string;
    dayOfWeek?: string;
    weatherCode: number;
    tempMin: number;
    tempMax: number;
  }

  interface hourly {
    date: string;
    hourWeatherCode: number;
    hourFormat: string;
    hourTemp: number;
  }

  interface OpenMeteoResponse {
    current: {
      temperature_2m: number;
      apparent_temperature: number;
      precipitation: number;
      relative_humidity_2m: number;
      wind_speed_10m: number;
      weather_code: number;
      time: string;
    };
    daily: {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      weather_code: number[];
    };
    hourly: {
      time: string[];
      temperature_2m: number[];
      weather_code: number[];
    };
  }

  const [latitude, setLatitude] = useState<string>(loadLatitudeFromStorage);
  const [longitude, setLongitude] = useState<string>(loadLongitudeFromStorage);
  const [city, setCity] = useState<string>(loadCityFromStorage);
  const [country, setCountry] = useState<string>(loadCountryFromStorage);
  const [currentWeather, setCurrentWeather] = useState<Partial<CurrentWeather>>(
    {},
  );
  const [hourlyWeather, setHourlyWeather] = useState<hourly[]>([]);
  const [dailyWeather, setDailyWeather] = useState<daily[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  interface LoadUnits {
    temperature: string;
    wind: string;
    precipitation: string;
  }

  const loadUnitsFromStorage = (): LoadUnits => {
    try {
      const saved = localStorage.getItem("units");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Проверяем, что структура правильная
        return {
          temperature: parsed.temperature || "celsius",
          wind: parsed.wind || "km/h",
          precipitation: parsed.precipitation || "mm",
        };
      }
    } catch (error) {
      console.error("Ошибка при чтении из localStorage:", error);
    }
    // Если ничего нет в localStorage, возвращаем значения по умолчанию
    return {
      temperature: "celsius",
      wind: "km/h",
      precipitation: "mm",
    };
  };

  const [units, setUnits] = useState<LoadUnits>(loadUnitsFromStorage);

  useEffect(() => {
    localStorage.setItem("units", JSON.stringify(units));
  }, [units]);

  const handleUnitsUpdate = (newUnits: LoadUnits): void => {
    setUnits(newUnits);
  };

  //Ассинхронная функция получения координат
  async function GetData(params: string) {
    const encodedCity = encodeURIComponent(params);
    const GeocodingAPI = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedCity}&count=10&language=ru&format=json`;
    try {
      setLoading(true);
      const response = await fetch(GeocodingAPI);
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        setError(true);
        setSuccess(false);
        setLoading(false);
        return { success: false };
      }
      const city = data.results[0];

      setLatitude(city.latitude.toString());
      setLongitude(city.longitude.toString());
      setCity(city.name);
      setCountry(city.country);
      setSuccess(true);
      setError(false);
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Не удалось получить данные:", error);
      setError(true);
      setSuccess(false);
      setLoading(false);
      return { success: false };
    }
  }

  //Запись в localstorage
  useEffect(() => {
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
    localStorage.setItem("city", city);
    localStorage.setItem("country", country);
  }, [latitude, longitude, city, country]);

  const WeatherAPI = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=weather_code,temperature_2m&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation,relative_humidity_2m&timezone=auto`;

  //Ассинхронная функция получения погоды
  async function GetWeather() {
    try {
      const response = await fetch(WeatherAPI);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const weather: OpenMeteoResponse = await response.json();
      const current = weather.current;
      const daily = weather.daily;
      const hourly = weather.hourly;

      //Преобразуем из объекта массивов в массив объектов
      const dailyForecast: daily[] = daily.time.map((dateString, index) => {
        const tempMax = daily.temperature_2m_max[index] ?? 0;
        const tempMin = daily.temperature_2m_min[index] ?? 0;
        const weatherCode = daily.weather_code[index] ?? 0;
        return {
          date: dateString,
          tempMax,
          tempMin,
          weatherCode,
          day: "",
          dayOfWeek: "",
        };
      });

      //Преобразуем из объекта массивов в массив объектов
      const hourlyForecast: hourly[] = hourly.time.map(
        (timeString: string, index: number) => {
          return {
            date: timeString,
            hourTemp: hourly.temperature_2m[index],
            hourWeatherCode: hourly.weather_code[index],
            hourFormat: "",
          };
        },
      );

      //Форматирование даты/времени
      const dailyFormatter = new Intl.DateTimeFormat("en-EN", {
        weekday: "short",
      });
      const hourlyFormatter = new Intl.DateTimeFormat("en-EN", {
        hour: "numeric",
        hour12: true,
      });

      //Добавляем дни недели
      const updatedDates: daily[] = dailyForecast.map((date) => ({
        ...date,
        dayOfWeek: dailyFormatter.format(new Date(date.date)),
      }));

      //Добавляем формат времени
      const updatedHours: hourly[] = hourlyForecast.map((hour) => ({
        ...hour,
        hourFormat: hourlyFormatter.format(new Date(hour.date)),
      }));

      setCurrentWeather({
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        precipitation: current.precipitation,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
        time: current.time,
      } as CurrentWeather);

      setDailyWeather(updatedDates);

      setHourlyWeather(updatedHours);
    } catch (error) {
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
    const intervalId = setInterval(
      () => {
        GetWeather();
      },
      15 * 60 * 1000,
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [latitude, longitude]);

  const isWeatherDataComplete = (): boolean => {
    return (
      currentWeather.temperature !== undefined &&
      currentWeather.feelsLike !== undefined &&
      currentWeather.humidity !== undefined &&
      currentWeather.windSpeed !== undefined &&
      currentWeather.precipitation !== undefined &&
      currentWeather.weatherCode !== undefined &&
      dailyWeather.length > 0 &&
      hourlyWeather.length > 0
    );
  };

  return (
    <div className="wrapper">
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
          <div className="error-container"></div>
        ) : !latitude || !longitude || !city || !country ? (
          <Empty />
        ) : !isWeatherDataComplete() ? (
          <LoadingSpinner />
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
