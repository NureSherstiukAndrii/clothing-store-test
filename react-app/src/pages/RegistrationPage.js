import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Registration.css';

const RegistrationPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/registration', {
                name: name,
                mail: email,
                password: password
            });

            const data = response.data;

            if (data.success) {
                alert('Пользователь зарегистрирован!');
                navigate('/login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Ошибка при регистрации');
        }
    };

    return (
        <div className="main">
            <div className="registration">
                <div className="title">
                    <h1>
                        Реєстрація
                    </h1>
                </div>
                <div className="registration-form">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            id="name"
                            className="reg-input"
                            name="name"
                            placeholder="Ім'я"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="email"
                            id="email"
                            className="reg-input"
                            name="email"
                            placeholder="Електронна пошта"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            id="password"
                            className="reg-input"
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
                            value="Зареєструватися"
                            className="reg"
                            id="addUser"
                        />
                    </form>
                </div>
                {/*<div className="login">
                    <a href="/login" className="registration-link" >Авторизація</a>
                </div>*/}
            </div>
        </div>
    );
};

export default RegistrationPage;
