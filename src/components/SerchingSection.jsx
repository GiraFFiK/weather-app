import { useState, useEffect, useRef } from "react";

export default function SearchingSection({ onSearch, searchSuccess, searchError, loading }) {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');
    const [recentCities, setRecentCities] = useState([]);
    const [showRecent, setShowRecent] = useState(false);
    const searchRef = useRef(null);
    const inputRef = useRef(null);

    const formatCityName = (city) => {
        if (!city || typeof city !== 'string') return '';
        return city
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    // Сбрасываем локальную ошибку при успешном поиске
    useEffect(() => {
        if (searchSuccess) {
            setError('');
        }
    }, [searchSuccess]);

    // Показываем ошибку, если поиск не удался
    useEffect(() => {
        if (searchError) {
            setError('City not found. Please check the spelling.');
        }
    }, [searchError]);

    useEffect(() => {
        loadRecentCities();

        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowRecent(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const loadRecentCities = () => {
        const savedCities = localStorage.getItem('recentCities');
        if (savedCities) {
            try {
                const parsedCities = JSON.parse(savedCities);
                if (Array.isArray(parsedCities)) {
                    setRecentCities(parsedCities);
                }
            } catch (error) {
                console.error('Error parsing recent cities:', error);
                localStorage.removeItem('recentCities');
            }
        }
    };

    // Общая функция для снятия фокуса
    const blurInput = () => {
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };

    // Функция изменения инпута
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setError('');
    }

    // Функция появления списка
    const handleInputFocus = () => {
        setShowRecent(true);
    }

    // Функция выбора города
    const handleCitySelect = async (city) => {
        const formattedCity = formatCityName(city);
        setInputValue(formattedCity);
        setError(''); 
        const result = await onSearch(formattedCity);
        setShowRecent(false);
        setInputValue('');
        blurInput();
    }

    // Функция обновления списка городов (только для успешных поисков)
    const updateRecentCities = (city) => {
        const formattedCity = formatCityName(city);
        if (!formattedCity.trim()) {
            return;
        }

        const savedCities = localStorage.getItem('recentCities');
        let currentCities = [];

        if (savedCities) {
            try {
                currentCities = JSON.parse(savedCities);
            } catch (error) {
                console.error('Error parsing recent cities:', error);
                currentCities = [];
            }
        }

        if (currentCities.length > 0 && currentCities[0] === formattedCity) {
            return;
        }

        const filteredCities = currentCities.filter(item => item !== formattedCity);
        const newRecentCities = [formattedCity, ...filteredCities].slice(0, 4);
        setRecentCities(newRecentCities);
        localStorage.setItem('recentCities', JSON.stringify(newRecentCities));
    }

    // Основная функция отправки
    const performSearch = async () => {
        if (!inputValue.trim()) {
            setError('Please enter a city name');
            return;
        }

        const formattedCity = formatCityName(inputValue);
        setError(''); 

        // Выполняем поиск и получаем результат
        const result = await onSearch(formattedCity);

        // Проверяем успешность поиска
        if (result && result.success) {
            // Только если поиск успешен, добавляем город в историю
            updateRecentCities(formattedCity);
        } else {
            // Если поиск неуспешен, показываем ошибку и НЕ добавляем в историю
            setError('City not found. Please check the spelling.');
        }

        setInputValue('');
        setShowRecent(false);
        blurInput();
    };

    // Функция нажатия кнопки
    const handleSubmit = async (e) => {
        e.preventDefault();
        await performSearch();
    }

    // Отправка с помощью Enter
    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
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
                        />
                        {showRecent && recentCities.length > 0 && (
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
                    </div>

                    <button type="submit" className="searching__button" onClick={handleSubmit}>Search</button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
}