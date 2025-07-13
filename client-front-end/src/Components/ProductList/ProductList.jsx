import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดสินค้า:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h1>รายการสินค้า</h1>
      {products.length === 0 ? (
        <p>ไม่มีสินค้าที่จะแสดง</p>
      ) : (
        <ul>
          {products.map(product => (
            <li key={product.id}>
              <strong>{product.name}</strong> - ราคา: {product.price} บาท
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductList;
