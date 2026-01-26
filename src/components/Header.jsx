import { useState, useEffect, useRef } from "react";
import logo from '/logo.svg';

export default function Header({ onChange, weatherUnits }) {

    const [units, setUnits] = useState(false);
    const [inputValue, setInputValue] = useState(weatherUnits);
    const [focus, setFocus] = useState(false);
    const buttonRef = useRef(null);

    useEffect(() => {
    setInputValue(weatherUnits);
  }, [weatherUnits]);

    useEffect(() => {

        // Обработчик клика вне области поиска
        const handleClickOutside = (event) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target)) {
                setUnits(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        };
    }, []);

    //Функция изменения инпута
    const handleUnitsUpdate = (e) => {
        const { name, value } = e.target;

        const newUnits = {
            ...inputValue,
            [name]: value
        }

        setInputValue(newUnits);

        if (onChange) {
            onChange(newUnits);
        }
    }

    const handleButtonFocus = () => {
        setFocus(true);
    }

    function ShowUnits() {
        setUnits(!units);
    }

    return (
        <header>
            <div className='container'>
                <div className='header__inner'>
                    <img className='header__logo' src={logo} alt="Логотип" />
                    <div className="header__units" ref={buttonRef}>
                        <button className='button header__button' onClick={ShowUnits} onFocus={handleButtonFocus}>
                            Units
                        </button>

                        {units ? (
                            <div className="units__dropdown">
                                <div className="units__dropdown__header">
                                    Switch to Imperial
                                </div>
                                <div className="units__dropdown__section">
                                    <div className="units__dropdown__title">Temperature</div>
                                    <div className="units__dropdown__options">
                                        <label className="units__dropdown__option">
                                            <input
                                                type="radio"
                                                name="temperature"
                                                value="celsius"
                                                checked={inputValue.temperature === 'celsius'}
                                                onChange={handleUnitsUpdate}
                                            />
                                            <span className="units__dropdown__option__text">Celsius (°C)</span>
                                        </label>
                                        <label className="units__dropdown__option">
                                            <input
                                                type="radio"
                                                name="temperature"
                                                value="fahrenheit"
                                                checked={inputValue.temperature === 'fahrenheit'}
                                                onChange={handleUnitsUpdate}
                                            />
                                            <span className="units__dropdown__option__text">Fahrenheit (°F)</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="units__dropdown__section">
                                    <div className="units__dropdown__title">Wind Speed</div>
                                    <div className="units__dropdown__options">
                                        <label className="units__dropdown__option">
                                            <input
                                                type="radio"
                                                name="wind"
                                                value="km/h"
                                                checked={inputValue.wind === 'km/h'}
                                                onChange={handleUnitsUpdate}
                                            />
                                            <span className="units__dropdown__option__text">km/h</span>
                                        </label>
                                        <label className="units__dropdown__option">
                                            <input
                                                type="radio"
                                                name="wind"
                                                value="mp/h"
                                                checked={inputValue.wind === 'mp/h'}
                                                onChange={handleUnitsUpdate}
                                            />
                                            <span className="units__dropdown__option__text">mp/h</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="units__dropdown__section">
                                    <div className="units__dropdown__title">Precipitation</div>
                                    <div className="units__dropdown__options">
                                        <label className="units__dropdown__option">
                                            <input
                                                type="radio"
                                                name="precipitation"
                                                value="mm"
                                                checked={inputValue.precipitation === 'mm'}
                                                onChange={handleUnitsUpdate}
                                            />
                                            <span className="units__dropdown__option__text">Millimeters (mm)</span>
                                        </label>
                                        <label className="units__dropdown__option">
                                            <input
                                                type="radio"
                                                name="precipitation"
                                                value="in"
                                                checked={inputValue.precipitation === 'in'}
                                                onChange={handleUnitsUpdate}
                                            />
                                            <span className="units__dropdown__option__text">Inches (in)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ) : null}


                    </div>
                </div>
            </div>
        </header>
    );
}