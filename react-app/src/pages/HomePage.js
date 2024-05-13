import React from 'react';
import LastArrivals from '../components/LastArrivals';
import PopularClothes from '../components/PopularClothes';
import '../styles/HomePage.css';
import '../styles/ShopPage.css';

const HomePage = () => {
    return (
        <div>
            {/* Introduction */}
            <div className="introduction">
                <div className="introduction-container">
                    <div className="introduction-phrase">
                        <h1>Представляємо <br/>Ваш новий <br/> Гардероб</h1>
                        <a href="/shop">Почати Покупки</a>
                    </div>
                </div>
                <img src="/resources/file-_1_.gif" alt="gif" />
            </div>

            {/* Main Categories */}
            <div className="main-categories">
                <a href="/about" className="category-about">
                    <h1>Ми та наша історія</h1>
                </a>
                <a href="/shop" className="category-shop">
                    <h1>Переглянь нашу колекцію</h1>
                </a>
                <a href="/size" className="category-size">
                    <h1>Дізнайся свій розмір</h1>
                </a>
            </div>

            <PopularClothes />

            <LastArrivals />
        </div>
    );
};

export default HomePage;
