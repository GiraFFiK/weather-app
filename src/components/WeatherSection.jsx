import HourlyForecast from "./HourlyForecast";
import { weatherIcons } from "../weatherIcons";

export default function WeatherSection({ current, daily, hourly, city, country, weatherUnits }) {

    //разобраться с этим
    const temp = current.temperature;
    const feelsLike = Math.round(current.feelsLike);
    const hum = Math.round(current.humidity);
    const wind = current.windSpeed;
    const prec = current.precipitation;
    const wcode = current.weatherCode;

    const getWeatherIcon = (code) => {
        return weatherIcons[code];
    }

    function formatTemp(tempC, unit) {
        if (unit === 'fahrenheit') {
            return Math.round(tempC * 9 / 5 + 32);
        }
        return Math.round(tempC);
    }

    function formatWind(speedMs, unit) {
        if (unit === 'mp/h') {
            return Math.round(speedMs * 2.237);
        }
        return Math.round(speedMs);
    }

    function formatPrecipitation(mm, unit) {
        if (unit === 'inches') {
            return Math.round((mm / 25.4) * 10) / 10;
        }
        return Math.round(mm);
    }



    let currentDate = new Date();
    let weekDay = new Intl.DateTimeFormat('en-EN', { weekday: 'long' }).format(currentDate);
    let month = new Intl.DateTimeFormat('en-EN', { month: 'short' }).format(currentDate);
    let day = currentDate.getDate();
    let year = currentDate.getFullYear();

    return (
        <div className="container">
            <div className="weather__inner">
                <div className="weather__main">
                    <div className="weather__main__info">
                        <div className="weather__main__info__citydata">{city + ', ' + country}<br />
                            <span className="weather__data">{weekDay}, {month} {day}, {year}</span>
                        </div>
                        <div className="weather__main__info__temperature">
                            <img className="weather__icon" src={getWeatherIcon(wcode)} alt="" />{temp ? formatTemp(Math.round(temp), weatherUnits.temperature) : '—'}°
                        </div>
                    </div>
                    <div className="weather__main__forecast">
                        <ul className="forecast__list">
                            <li className="forecast__item">
                                <div className="item__feel">Feels Like</div>
                                <div className="item__feel__value">{feelsLike ? formatTemp(feelsLike, weatherUnits.temperature) : '—'}°</div>
                            </li>
                            <li className="forecast__item">
                                <div className="item__humidity">Humidity</div>
                                <div className="item__humidity__value">{hum ? hum : '—'}%</div>
                            </li>
                            <li className="forecast__item">
                                <div className="item__wind">Wind</div>
                                <div className="item__wind__value">{wind >= 0 ? formatWind(Math.round(wind), weatherUnits.wind) : '—'} {weatherUnits.wind}</div>
                            </li>
                            <li className="forecast__item">
                                <div className="item__precipitation">Precipitation</div>
                                <div className="item__precipitation__value">{prec >= 0 ? formatPrecipitation(prec, weatherUnits.precipitation) : '—'} {weatherUnits.precipitation}</div>
                            </li>
                        </ul>
                    </div>
                    <span className="daily__forecast__text">Daily forecast</span>
                    <ul className="weather__daily__forecast">
                        {daily.map((day, index) => (
                            <li key={index} className="daily__forecast__item">
                                <div>
                                    <div key={day.day} className="daily__forecast__day">{day.dayOfWeek}</div>
                                    <img className="daily__forecast__icon" src={getWeatherIcon(day.weatherCode)} alt="" />
                                    <div className="daily__forecast__temp">
                                        <span className="temp__high">{formatTemp(Math.round(day.tempMax), weatherUnits.temperature)}°</span>
                                        <span className="temp__low">{formatTemp(Math.round(day.tempMin), weatherUnits.temperature)}°</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="weather__hour">
                    <HourlyForecast hourly={hourly} current={current} weatherUnits={weatherUnits} />
                </div>
            </div>
        </div>
    );
}
