import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.svg";

interface Props {
  weatherUnits: {
    temperature: string;
    wind: string;
    precipitation: string;
  };
  onChange: (newUnits: {
    temperature: string;
    wind: string;
    precipitation: string;
  }) => void;
}

export default function Header({ onChange, weatherUnits }: Props) {
  const [units, setUnits] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState(weatherUnits);
  const [focus, setFocus] = useState<boolean>(false);
  const [rotated, setRotated] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(weatherUnits);
  }, [weatherUnits]);

  useEffect(() => {
    // Обработчик клика вне области поиска
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setUnits(false);
        setRotated(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //Функция изменения инпута
  const handleUnitsUpdate = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    const newUnits = {
      ...inputValue,
      [name]: value,
    };

    setInputValue(newUnits);

    if (onChange) {
      onChange(newUnits);
    }
  };

  const handleButtonFocus = (): void => {
    setFocus(true);
  };

  function ShowUnits(): void {
    setUnits(!units);
  }

  const handleButtonClick = (): void => {
    const newUnitsState = !units;
    setUnits(newUnitsState);
    setRotated(newUnitsState); // Поворачиваем стрелку при открытии
  };

  return (
    <header>
      <div className="container">
        <div className="header__inner">
          <img className="header__logo" src={logo} alt="Логотип" />
          <div className="header__units" ref={buttonRef}>
            <button
              className={`button header__button ${rotated ? 'rotated' : ''}`}
              onClick={handleButtonClick}
              onFocus={handleButtonFocus}
            >
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
                        checked={inputValue.temperature === "celsius"}
                        onChange={handleUnitsUpdate}
                      />
                      <span className="units__dropdown__option__text">
                        Celsius (°C)
                      </span>
                    </label>
                    <label className="units__dropdown__option">
                      <input
                        type="radio"
                        name="temperature"
                        value="fahrenheit"
                        checked={inputValue.temperature === "fahrenheit"}
                        onChange={handleUnitsUpdate}
                      />
                      <span className="units__dropdown__option__text">
                        Fahrenheit (°F)
                      </span>
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
                        checked={inputValue.wind === "km/h"}
                        onChange={handleUnitsUpdate}
                      />
                      <span className="units__dropdown__option__text">
                        km/h
                      </span>
                    </label>
                    <label className="units__dropdown__option">
                      <input
                        type="radio"
                        name="wind"
                        value="mp/h"
                        checked={inputValue.wind === "mp/h"}
                        onChange={handleUnitsUpdate}
                      />
                      <span className="units__dropdown__option__text">
                        mp/h
                      </span>
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
                        checked={inputValue.precipitation === "mm"}
                        onChange={handleUnitsUpdate}
                      />
                      <span className="units__dropdown__option__text">
                        Millimeters (mm)
                      </span>
                    </label>
                    <label className="units__dropdown__option">
                      <input
                        type="radio"
                        name="precipitation"
                        value="in"
                        checked={inputValue.precipitation === "in"}
                        onChange={handleUnitsUpdate}
                      />
                      <span className="units__dropdown__option__text">
                        Inches (in)
                      </span>
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
