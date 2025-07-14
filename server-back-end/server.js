const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require("./serviceAccountKey.json"); // 🔐 ไฟล์ที่ได้จาก Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 📦 สร้างสินค้า
app.post("/products", async (req, res) => {
  try {
    const { name, price, description, userId } = req.body;
    const newProductRef = await db.collection("products").add({
      name,
      price,
      description,
      createdAt: admin.firestore.Timestamp.now(),
    });

    // 📝 log
    await db.collection("product_logs").add({
      action: "add",
      productId: newProductRef.id,
      userId,
      timestamp: admin.firestore.Timestamp.now(),
      dataAfter: { name, price, description },
    });

    res.status(201).json({ id: newProductRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ แก้ไขสินค้า
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, userId } = req.body;

    const productRef = db.collection("products").doc(id);
    const productSnap = await productRef.get();
    if (!productSnap.exists) return res.status(404).send("Not found");

    const oldData = productSnap.data();
    await productRef.update({ name, price, description });

    // 📝 log
    await db.collection("product_logs").add({
      action: "edit",
      productId: id,
      userId,
      timestamp: admin.firestore.Timestamp.now(),
      dataBefore: oldData,
      dataAfter: { name, price, description },
    });

    res.send("Updated");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🗑 ลบสินค้า
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const productRef = db.collection("products").doc(id);
    const productSnap = await productRef.get();
    if (!productSnap.exists) return res.status(404).send("Not found");

    const oldData = productSnap.data();
    await productRef.delete();

    // 📝 log
    await db.collection("product_logs").add({
      action: "delete",
      productId: id,
      userId,
      timestamp: admin.firestore.Timestamp.now(),
      dataBefore: oldData,
    });

    res.send("Deleted");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📄 แสดงสินค้าทั้งหมด
app.get("/products", async (req, res) => {
  try {
    const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));