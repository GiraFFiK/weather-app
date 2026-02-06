import { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  onSearch: (city: string) => Promise<{ success: boolean }>;
  searchSuccess: boolean;
  searchError: boolean;
  loading: boolean;
}

export default function SearchingSection({
  onSearch,
  searchSuccess,
  searchError,
  loading,
}: Props) {
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [recentCities, setRecentCities] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [shouldShowSuggestions, setShouldShowSuggestions] = useState<boolean>(false);

  const formatCityName = (city: string) => {
    if (!city || typeof city !== "string") return "";
    return city
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Сбрасываем локальную ошибку при успешном поиске
  useEffect(() => {
    if (searchSuccess) {
      setError("");
    }
  }, [searchSuccess]);

  // Показываем ошибку, если поиск не удался
  useEffect(() => {
    if (searchError) {
      setError("City not found. Please check the spelling.");
    }
  }, [searchError]);

  useEffect(() => {
    loadRecentCities();

    const handleClickOutside = (event: MouseEvent): void => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowRecent(false);
        setShouldShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const loadRecentCities = () => {
    const savedCities = localStorage.getItem("recentCities");
    if (savedCities) {
      try {
        const parsedCities: string[] = JSON.parse(savedCities);
        if (Array.isArray(parsedCities)) {
          setRecentCities(parsedCities);
        }
      } catch (error: unknown) {
        console.error("Error parsing recent cities:", error);
        localStorage.removeItem("recentCities");
      }
    }
  };

  // Общая функция для снятия фокуса
  const blurInput = (): void => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const fetchCitySuggestions = async (query: string) => {
    if (!query.trim() || query.length < 1) {
      setSuggestions([]);
      setShouldShowSuggestions(false);
      return;
    }
    setFetching(true);
    setShouldShowSuggestions(true);

    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodedQuery}&count=10&language=ru&format=json`,
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        // Форматируем названия городов: "Город, Страна"
        const citySuggestions = data.results.map((city: any) => {
          const country = city.country || "";
          return country ? `${city.name}, ${country}` : city.name;
        });
        setSuggestions(citySuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setSuggestions([]);
    } finally {
      setFetching(false);
    }
  };

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFetchSuggestions = useCallback((query: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchCitySuggestions(query);
    }, 300); // Задержка 300мс
  }, []);

  const handleSuggestionSelect = async (suggestion: string) => {
    // Извлекаем только название города (убираем страну)
    const cityName = suggestion.split(",")[0].trim();
    setInputValue(cityName);
    setSuggestions([]);
    setShouldShowSuggestions(false);
    setError("");

    const result = await onSearch(cityName);

    if (result && result.success) {
      updateRecentCities(cityName);
    }

    setInputValue("");
    blurInput();
  };

  // Функция изменения инпута
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setInputValue(value);
    setError("");

    if (!value.trim()) {
      setShowRecent(true);
      setSuggestions([]);
      setFetching(false);
      return;
    }

    if (value.trim().length < 1) {
      setShowRecent(false);
      setSuggestions([]);
      setFetching(false);
      setShouldShowSuggestions(false);
      return;
    }

    if (value.trim().length < 1) {
      setShowRecent(false);
      setSuggestions([]);
      setFetching(false);
      setShouldShowSuggestions(false);
      return;
    }

    setShowRecent(false);
    debouncedFetchSuggestions(value);
  };

  // Функция появления списка
  const handleInputFocus = (): void => {
    if (inputValue.trim() === "") {
      setShowRecent(true);
    }
  };

  // Функция выбора города
  const handleCitySelect = async (city: string) => {
    const formattedCity = formatCityName(city);
    setInputValue(formattedCity);
    setError("");
    setShowRecent(false);
    const result = await onSearch(formattedCity);
    setShowRecent(false);
    setInputValue("");
    blurInput();
  };

  // Функция обновления списка городов (только для успешных поисков)
  const updateRecentCities = (city: string) => {
    const formattedCity = formatCityName(city);
    if (!formattedCity.trim()) {
      return;
    }

    const savedCities = localStorage.getItem("recentCities");
    let currentCities: string[] = [];

    if (savedCities) {
      try {
        currentCities = JSON.parse(savedCities);
      } catch (error: unknown) {
        console.error("Error parsing recent cities:", error);
        currentCities = [];
      }
    }

    if (currentCities.length > 0 && currentCities[0] === formattedCity) {
      return;
    }

    const filteredCities = currentCities.filter(
      (item) => item !== formattedCity,
    );
    const newRecentCities = [formattedCity, ...filteredCities].slice(0, 4);
    setRecentCities(newRecentCities);
    localStorage.setItem("recentCities", JSON.stringify(newRecentCities));
  };

  // Основная функция отправки
  const performSearch = async () => {
    if (!inputValue.trim()) {
      setError("Please enter a city name");
      return;
    }

    const formattedCity = formatCityName(inputValue);
    setError("");
    setShowRecent(false);
    setShouldShowSuggestions(false);

    // Выполняем поиск и получаем результат
    const result = await onSearch(formattedCity);

    // Проверяем успешность поиска
    if (result && result.success) {
      // Только если поиск успешен, добавляем город в историю
      updateRecentCities(formattedCity);
    } else {
      // Если поиск неуспешен, показываем ошибку и НЕ добавляем в историю
      setError("City not found. Please check the spelling.");
    }

    setInputValue("");

    blurInput();
  };

  // Функция нажатия кнопки
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await performSearch();
  };

  // Отправка с помощью Enter
  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await performSearch();
    }
  };

  return (
    <div className="container">
      <div className="searching__inner">
        <h1 className="searching__header">How's the sky looking today?</h1>
        <div className="searching__field" ref={searchRef}>
          <div className="searching__wrapper">
            <input
              ref={inputRef}
              id="input"
              className="searching__input"
              placeholder="Search for a place..."
              type="text"
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              value={inputValue}
              disabled={loading}
              autoComplete="off"
            />
            {showRecent &&
              inputValue.trim() === "" &&
              recentCities.length > 0 && (
                <div className="recent-cities">
                  {recentCities.map((city, index) => (
                    <div
                      key={index}
                      className="recent-cities__item"
                      onClick={() => handleCitySelect(city)}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            {shouldShowSuggestions && inputValue.trim().length >= 1 && (
              <div className="suggestions">
                {fetching ? (
                  // Показываем загрузку
                  <div className="suggestions__item suggestions__loading">
                    Searching for cities...
                  </div>
                ) : suggestions.length > 0 ? (
                  // Показываем результаты
                  suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestions__item"
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))
                ) : (
                  // Показываем "нет результатов" ТОЛЬКО когда загрузка завершена
                  <div className="suggestions__item suggestions__empty">
                    No cities found
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="searching__button"
            onClick={handleSubmit}
          >
            Search
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
