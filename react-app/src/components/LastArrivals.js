import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Recomendations.css';

const LastArrivals = () => {
    const [topClothes, setTopClothes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/getRecentClothes");
                const data = response.data.data;
                console.log(data);

                setTopClothes(data);
            } catch (error) {
                console.error("Error fetching top clothes data:", error);
            }
        };

        fetchData();
    }, []);

    const showProduct = (Id) => {
        // Действия при клике на продукт
    };

    return (
        <div className="popular-clothes">
            <h1>Новинки</h1>
            <div className="popular-clothes-container">
                {/* Render topClothes data here */}
                {topClothes.map((item, index) => (
                    <div key={index} className='product' onClick={() => showProduct(item.Id)}>
                        <img src={`./resources/${item.images[0]}`} alt={`product ${item.Id}`} />
                        <h2>{item.Name}</h2>
                        <span>{item.price} грн</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LastArrivals;
