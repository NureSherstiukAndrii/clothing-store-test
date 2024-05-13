import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProductPage.css';

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await axios.get(`http://localhost:3000/product/${id}`);
                setProduct(productResponse.data.data[0]);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchData();
    }, [id]);

    const addToCart = async () => {
        try {
            const userId = localStorage.getItem('id');

            if (!userId) {
                console.error('UserID не найден в localStorage');
                return;
            }

            const response = await axios.post('http://localhost:3000/insertIntoCart_Fav', {
                userId: userId,
                productId: id,
                is_cart: 1
            });
            console.log(response.data);
            alert("Товар додано до кошика")
        } catch (error) {
            console.error('Ошибка при добавлении товара в корзину:', error);
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div id="product">
            <div className="main">
                <div className="product-info">
                    <div className="left">
                        <div className="title">
                            <a href="/" className="title-link">Home</a> / {product.type_of_product}
                        </div>
                        <div className="clothes-photo">
                            <img className="photo" src={`../resources/${product.images[0]}`} alt="" />
                        </div>
                    </div>
                    <div className="right">
                        <div className="clothes-name">
                            <h2 id="product_name">{product.Name}</h2>
                            <p id="productId">Код товару: {product.Id}</p>
                        </div>
                        <div className="form">
                            <p>{product.price} грн</p>
                            <form onSubmit={(e) => { e.preventDefault(); addToCart(); }}>
                                Розмір <br />
                                <div className="size-fav">
                                    <select id="size" name="size">
                                        <option value={product.size}>{product.size}</option>
                                    </select>
                                </div>
                                <br /><br />
                                <input type="submit" value="Додати до кошика" id="addToCart" />
                            </form>
                        </div>
                        <div className="description">
                            <h2>Опис товару</h2>
                            <p id="product-description">{product.description}</p>
                            <br /><br />
                            <div id="season">
                                Рекомендована пора року: {product.season}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
