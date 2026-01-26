import { weatherIcons } from "../weatherIcons";

export default function HourlyForecast({ hourly, current, weatherUnits }) {

    const getWeatherIcon = (code) => {
        return weatherIcons[code];
    }

    let currentHour;

    if(!current.time){
        currentHour = 0;
    }else{
        currentHour = new Intl.DateTimeFormat('en-EN', { hour: 'numeric', hour12: true}).format(new Date(current.time));
    }

    
    
    function findTwelveHours(array, targetValue){
        const result = [];
        for(let i = 0; i < array.length; i++){
            const obj = array[i]
            const hasValue = Object.values(obj).some(value => value === targetValue);
            if(hasValue){
                result.push(obj);
                for(let j = 1; j <= 11; j++){
                    result.push(array[i + j]);
                }

                i += 11;
            }
        }

        return result;
    }

    let hourlyList = findTwelveHours(hourly, currentHour).slice(0, 12);

    function formatTemp(tempC, unit) {
        if (unit === 'fahrenheit') {
            return Math.round(tempC * 9 / 5 + 32);
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
                                    src={getWeatherIcon(hour.hourWeatherCode)}
                                    alt="Weather icon"
                                    className="hourly__forecast__icon"
                                />
                                <div className="hourly__forecast__time">{hour.hourFormat}</div>
                            </div>
                            <div className="hourly__forecast__temp">{formatTemp(Math.round(hour.hourTemp), weatherUnits.temperature)}°</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}