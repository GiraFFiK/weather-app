import { weatherIcons } from "../weatherIcons";

interface Props {
  current: {
    time?: string;
    temperature?: number;
    feelsLike?: number;
    humidity?: number;
    windSpeed?: number;
    precipitation?: number;
    weatherCode?: number;
  };
  hourly: Array<{
    hourWeatherCode?: number;
    hourFormat?: string;
    hourTemp?: number;
  }>;

  weatherUnits: {
    temperature: string;
    wind: string;
    precipitation: string;
  };
}

export default function HourlyForecast({
  hourly,
  current,
  weatherUnits,
}: Props) {
  const getWeatherIcon = (code: string | number): string => {
    const codeStr = String(code);
    return (weatherIcons as Record<string, string>)[codeStr] || '';
  };

  let currentHour: string;

  if (!current.time) {
    currentHour = "";
  } else {
    currentHour = new Intl.DateTimeFormat("en-EN", {
      hour: "numeric",
      hour12: true,
    }).format(new Date(current.time));
  }

  function findTwelveHours(
    array: Array<{
      hourWeatherCode?: number;
      hourFormat?: string;
      hourTemp?: number;
    }>,
    targetValue: string,
  ) {
    const result: Array<{
      hourWeatherCode?: number;
      hourFormat?: string;
      hourTemp?: number;
    }> = []; 

    for (let i = 0; i < array.length; i++) {
      const obj = array[i];
      if (!obj) continue;

      const hasValue = Object.values(obj).some(
        (value) => value === targetValue,
      );

      if (hasValue) {
        result.push(obj);

        for (let j = 1; j <= 11; j++) {
          if (i + j < array.length && array[i + j]) {
            result.push(array[i + j]);
          }
        }
        break;
      }
    }

    return result;
  }

  let hourlyList = findTwelveHours(hourly, currentHour).slice(0, 12);

  function formatTemp(tempC: number, unit: string) {
    if (unit === "fahrenheit") {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC);
  }

  return (
    <div className="hourly__forecast__wrapper">
      <div className="hourly__forecast__header">
        <h2 className="hourly__forecast__title">Hourly forecast</h2>
      </div>
      <div className="hourly__forecast__scrollable">
        <div className="hourly__forecast__list">
          {hourlyList.map((hour, index) => (
            <div key={index} className="hourly__forecast__item">
              <div className="hourly__forecast__time__wrapper">
                <img
                  src={hour.hourWeatherCode !== undefined ? getWeatherIcon(hour.hourWeatherCode): ""}
                  alt="Weather icon"
                  className="hourly__forecast__icon"
                />
                <div className="hourly__forecast__time">{hour.hourFormat}</div>
              </div>
              <div className="hourly__forecast__temp">
                {hour.hourTemp !== undefined 
                  ? formatTemp(
                  Math.round(hour.hourTemp),
                  weatherUnits.temperature,
                ): ""}
                °
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
