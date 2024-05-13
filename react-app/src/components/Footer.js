import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer>
            <img src="/resources/logo.png" alt="logo" />

            <div className="mail">
                <span>Свої питання пишить нам на пошту: </span>
                <a href="mailto:ourchop@gmail.com">ourchop@gmail.com</a>
            </div>

            <div className="social-media">
                <img src="/resources/instagram.png" alt="insta" />
                <img src="/resources/telegram.png" alt="tg" />
                <img src="/resources/tiktok.png" alt="tiktok" />
            </div>
        </footer>
    );
};

export default Footer;
