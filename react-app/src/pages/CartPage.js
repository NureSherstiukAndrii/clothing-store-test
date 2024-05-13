import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CartPage.css';
import {NavLink} from "react-router-dom";

const CartPage = () => {
    const [cartData, setCartData] = useState(null);

    useEffect(() => {
        fetchCartData();
    }, []);

    const fetchCartData = async () => {
        try {
            const userId = localStorage.getItem('id');
            const response = await axios.get(`http://localhost:3000/getCart/${userId}`);
            setCartData(response.data);
            console.log(cartData.result);
        } catch (error) {
            console.error('Произошла ошибка при загрузке корзины:', error);
        }
    };

    const handleDeleteFromCart = async (productId) => {
        try {
            const userId = localStorage.getItem('id');
            await axios.delete(`http://localhost:3000/deleteFromCart_Fav?userId=${userId}&product_id=${productId}&is_cart=1`);
            fetchCartData();
        } catch (error) {
            console.error('Произошла ошибка при удалении товара из корзины:', error);
        }
    };

    const handleCheckout = async () => {
        try {
            const userId = localStorage.getItem('id');
            const response = await axios.post(`http://localhost:3000/orders`, { u_id: userId, total_price: cartData.total_price });
            const orderNum = response.data.orderId;
            await Promise.all(cartData.result.map(async ({ Id }) => {
                console.log(Id);
                await axios.post(`http://localhost:3000/orders/${orderNum}/items`, { p_id: Id });
                await axios.delete(`http://localhost:3000/deleteFromCart_Fav?userId=${userId}&product_id=${Id}&is_cart=1`);
            }));
            await fetchCartData();
            alert('Заказ успешно оформлен!');
        } catch (error) {
            console.error('Произошла ошибка при оформлении заказа:', error);
        }
    };

    return (
        <div className="cart-container">
            <div className="my-cart">
                <h2>Моя корзина</h2>
                <div id="myCartProducts">
                    {cartData ? (
                        cartData.result.length === 0 ? (
                            <h3>Кошик порожній</h3>
                        ) : (
                            cartData.result.map(({ Id, Name, price, size, images }) => (
                                <div className="cart-product" key={Id}>
                                    <div className="cart-product-info">
                                        <img className="product-img" src={`../resources/${images[0]}`} alt={`product ${Id}`} />
                                        <div>
                                            <h2 className="product-cart-name">{Name}</h2>
                                            <h3 className="size">Розмір: {size}</h3>
                                        </div>
                                    </div>
                                    <div className="delete-from-cart-block">
                                        <h3 className="price">$ {price}</h3>
                                        <img
                                            src="/resources/garbage.png"
                                            className="delete-from-cart-btn"
                                            alt="garbage"
                                            onClick={() => handleDeleteFromCart(Id)}
                                        />
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            </div>

            <div className="price-block">
                <h1>Загальна вартість</h1>
                <h2 id="myCartProductsPrice">{cartData ? `$ ${cartData.total_price}` : 'Загрузка...'}</h2>
                <button onClick={handleCheckout} className="pay-btn">Оформити замовлення</button>

                    <button className="pay-btn"><NavLink to="/orders" className="navBtn">Мої замовлення</NavLink></button>

            </div>
        </div>
    );
};

export default CartPage;
