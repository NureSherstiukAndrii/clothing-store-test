import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';

const LoginPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        setIsLoggedIn(accessToken ? true : false);
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/api/logout');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('id');
            setIsLoggedIn(false);
            navigate('/login'); // Перенаправление на страницу входа после выхода
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error);
            // Обработка ошибок при выходе из системы
        }
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <NavLink to="/">
                        <img src="/resources/logo.png" alt="logo" />
                    </NavLink>
                    <span>Our logo</span>
                </div>

                <div className="navigation">
                    <div className="navigation-block">
                        <NavLink to="/about" className="navigation-block-btn">Про нас</NavLink>
                        <NavLink to="/shop/1" className="navigation-block-btn">Магазин</NavLink>
                        <NavLink to="/sizes" className="navigation-block-btn">Розмірна сітка</NavLink>
                        <NavLink to="/contacts" className="navigation-block-btn">Зв'язок з нами</NavLink>
                    </div>
                    <div className="navigation-account-links">
                        <div style={{ display: 'flex' }}>
                            <NavLink to="/profile">
                                <img src="/resources/account.png" alt="account" />
                            </NavLink>
                            {isLoggedIn ? (
                                <>
                                    <NavLink to="/login" id="exit-btn" onClick={handleLogout}>Вийти</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/login" id="enter-btn">Увійти</NavLink>
                                </>
                            )}
                            <NavLink to="/cart" id="open">
                                <img src="/resources/basket.png" alt="basket" />
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default LoginPage;
