import React, { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:5000"; // เปลี่ยนตาม URL server ของคุณ

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const userId = "j3V4A8rBoIcqnkLI3uuZZvgI0bA2"; // ✅ เปลี่ยนเป็น uid จริงจาก login

  // 🔁 โหลดสินค้าทั้งหมด
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      alert("โหลดสินค้าไม่สำเร็จ");
    }
  };

  // ✅ โหลดสินค้าจาก Back-end ทันทีเมื่อเปิดหน้านี้
  useEffect(() => {
    fetch(`${BACKEND_URL}/products`)
      .then(res => res.json())
      .then(data => {
        console.log("สินค้า:", data);
        setProducts(data);
      })
      .catch(err => {
        console.error("โหลดสินค้า error:", err);
      });
  }, []);

  // ➕ เพิ่มสินค้า
  const addProduct = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId }),
      });

      if (!res.ok) throw new Error("เพิ่มสินค้าไม่สำเร็จ");

      const result = await res.json();
      setProducts([{ id: result.id, ...form }, ...products]);
      setForm({ name: "", price: "", description: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  // 📝 แก้ไขสินค้า
  const editProduct = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId }),
      });

      if (!res.ok) throw new Error("แก้ไขสินค้าไม่สำเร็จ");

      setProducts(products.map(p => p.id === editingId ? { ...p, ...form } : p));
      setForm({ name: "", price: "", description: "" });
      setEditingId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  // ❌ ลบสินค้า
  const deleteProduct = async (id) => {
    if (!window.confirm("ต้องการลบสินค้านี้จริงหรือไม่?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/products/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) throw new Error("ลบสินค้าไม่สำเร็จ");

      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editingId ? editProduct() : addProduct();
  };

  const handleEditClick = (product) => {
    setForm({ name: product.name, price: product.price, description: product.description });
    setEditingId(product.id);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="ชื่อสินค้า"
          value={form.name}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="ราคา"
          value={form.price}
          required
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="คำอธิบาย"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">
          {editingId ? "ยืนยันการแก้ไข" : "เพิ่มสินค้า"}
        </button>
        {editingId && (
          <button type="button" onClick={() => {
            setForm({ name: "", price: "", description: "" });
            setEditingId(null);
          }}>
            ยกเลิก
          </button>
        )}
      </form>

      <h3>รายการสินค้า</h3>
      {products.length === 0 ? (
        <p>ยังไม่มีสินค้า</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ชื่อสินค้า</th>
              <th>ราคา</th>
              <th>คำอธิบาย</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.description}</td>
                <td>
                  <button onClick={() => handleEditClick(p)}>แก้ไข</button>
                  <button onClick={() => deleteProduct(p.id)}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductManager;
