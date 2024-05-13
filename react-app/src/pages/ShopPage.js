import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/ShopPage.css';

const ShopPage = () => {
    const [topClothes, setTopClothes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Загрузка товаров для текущей страницы
                const response = await axios.get(`http://localhost:3000/getProducts/${currentPage}`);
                const data = response.data.data;

                setTopClothes(data);

                // Загрузка общего количества страниц
                const pageCountResponse = await axios.get("http://localhost:3000/productsCount");
                const pageCount = pageCountResponse.data.count;
                setTotalPages(Math.ceil(pageCount / 25));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [currentPage]);

    const showProduct = (Id) => {
        // Переход на страницу продукта при клике
        navigate(`/product/${Id}`);
    };

    return (
        <div>
            <div className="introduction">
                <div className="introduction-container">
                    <div className="introduction-phrase">
                        <h1>МАГАЗИН</h1>
                    </div>
                </div>
                <img src="/resources/intro-shop.jpg" alt="intro-about-us"/>
            </div>

            <div className="clothes">
                <div className="clothes-container">
                    {/* Render topClothes data here */}
                    {topClothes.map((item, index) => (
                        <div key={index} className='product' onClick={() => showProduct(item.Id)}>
                            <img src={`../resources/${item.images[0]}`} alt={`product ${item.Id}`} />
                            <h2>{item.Name}</h2>
                            <span>{item.price} грн</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination */}
            <div className="pagesCountBlock">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <NavLink
                        key={page}
                        className="pagesCountElement"
                        to={`/shop/${page}`}
                        onClick={() => {
                            console.log(`Clicked on page ${page}`);
                            setCurrentPage(page);
                        }}
                    >
                        {page}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default ShopPage;
