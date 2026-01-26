import sun from '../public/icon-sunny.webp';
import storm from '../public/icon-storm.webp';
import fog from '../public/icon-fog.webp';
import rain from '../public/icon-rain.webp';
import snow from '../public/icon-snow.webp';
import overcast from '../public/icon-overcast.webp';
import partlyCloudy from '../public/icon-partly-cloudy.webp';
import drizzle from '../public/icon-drizzle.webp';

export const weatherIcons = {
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
}