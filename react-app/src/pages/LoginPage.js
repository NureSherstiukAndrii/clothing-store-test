import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                mail: email,
                password: password
            });

            const data = response.data;

            if (data.accessToken) {


                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('id', data.user.id);

                navigate('/');
            } else {
                alert('Невірний логін або пароль!!!');
            }
        } catch (error) {
            console.error(error);
            alert('Помилка під час авторизації');
        }
    };

    return (
        <div className="main">
            <div className="login">
                <div className="title">
                    <h1>
                        Авторизація
                    </h1>
                    <p>
                        Авторизуйтеся на сайті, щоб почати покупки.
                    </p>
                </div>
                <div className="login-form">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            id="email"
                            className="auth-input"
                            name="email"
                            placeholder="Електронна пошта"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            id="password"
                            className="auth-input"
                            name="password"
                            placeholder="Пароль"
                            pattern=".{8,}"
                            title="Пароль має містити принаймні 8 символів"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="submit"
                            value="Авторизація"
                            className="auth"
                            id="enter"
                        />
                    </form>
                </div>
                {/*<div className="registration">
                    <a href="/registration" className="registration-link">Реєстрація</a>
                </div>*/}
            </div>
        </div>
    );
};

export default LoginPage;
