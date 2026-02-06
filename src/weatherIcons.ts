import sun from "./assets/icon-sunny.webp";
import storm from "./assets/icon-storm.webp";
import fog from "./assets/icon-fog.webp";
import rain from "./assets/icon-rain.webp";
import snow from "./assets/icon-snow.webp";
import overcast from "./assets/icon-overcast.webp";
import partlyCloudy from "./assets/icon-partly-cloudy.webp";
import drizzle from "./assets/icon-drizzle.webp";

export interface WeatherIcons {
  [key: string]: string; 
  0: string;
  1: string;
  2: string;
  3: string;
  45: string;
  48: string;
  51: string;
  53: string;
  55: string;
  56: string;
  57: string;
  61: string;
  63: string;
  65: string;
  66: string;
  67: string;
  71: string;
  73: string;
  75: string;
  77: string;
  80: string;
  81: string;
  82: string;
  85: string;
  86: string;
  95: string;
  96: string;
  99: string;
}

export const weatherIcons: WeatherIcons = {
  
  //sun
  0: sun,

  //party clody
  1: partlyCloudy,
  2: partlyCloudy,

  //overcast
  3: overcast,

  //fog
  45: fog,
  48: fog,

  //drizzle
  51: drizzle,
  53: drizzle,
  55: drizzle,

  //snow
  56: snow,
  57: snow,
  66: snow,
  67: snow,
  71: snow,
  73: snow,
  75: snow,
  77: snow,
  85: snow,
  86: snow,

  //rain
  61: rain,
  63: rain,
  65: rain,
  80: rain,
  81: rain,
  82: rain,

  //storm
  95: storm,
  96: storm,
  99: storm,
};
