import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/OrderPage.css';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userId = localStorage.getItem('id');
                const response = await axios.get(`http://localhost:3000/orders/${userId}`);
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    // Функция для форматирования даты в короткий формат DD-MM-YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="order-container">
            <h1>Мої замовлення</h1>
            {orders.length === 0 ? (
                <p>Немає замовлень</p>
            ) : (
                <div className="order-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-item">
                            <p>Номер замовлення: {order.num}</p>
                            <p>Дата: {formatDate(order.date)}</p>
                            <p>Статус: {order.status}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderPage;
