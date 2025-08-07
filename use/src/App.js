import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [text, setText] = useState("");
  const [form, setForm] = useState({ name: "", price: "", image: "" });
  const [editId, setEditId] = useState(null);

  // {/*use of useeffect to prevent unnecessary api rendering */}

  // fetch(` http://localhost:8080/posts`)
  // .then((res)=>res.json)
  // .then((data)=>{
  //   setTodos(data)
  // })

  // useEffect(()=>{
  //   // inside as callback use
  //    fetch("http://localhost:8080/todos")
  //    .then((res)=>res.json)
  //   .then((data)=>{
  //   setTodos(data)
  // })
  // },[])
  const getData = async () => {
    const data = await fetch("http://localhost:8080/products").then(res =>
      res.json()
    );
    setProducts(data);
  };
  useEffect(() => {
    
    getData();
  }, []);

  const handleChange = e => {
    const data = e.target.value;
    const name = e.target.name;

    // here we first make the copy of previous form and name and value we use as key and value we used in object

    setForm({ ...form, [name]: data });
  };

  const handleAddOrUpdate = async () => {
    const payload = { ...form };

    if (editId) {
      // PUT (Update)
      await fetch(`http://localhost:8080/products/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setEditId(null);
    } else {
      // POST (Add)
      await fetch(`http://localhost:8080/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm({ name: "", price: "", image: "" });
    getData();
  };
  const handleDelete = async id => {
    await fetch(`http://localhost:8080/products/${id}`, {
      method: "DELETE",
    });
    getData();
  };

  const handleEdit = product => {
    setForm(product);
    setEditId(product.id);
  };

  return (
    <div
      className="App"
      style={{ maxWidth: "800px", margin: "auto", padding: "2rem" }}
    >
      <h1>🛍️ Ecommerce Product CRUD</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
        />
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <button onClick={handleAddOrUpdate}>{editId ? "Update" : "Add"}</button>
      </div>

      {/* Display products */}
      {products.map(product => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
          <div style={{ flex: 1 }}>
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
          </div>
          <button onClick={() => handleEdit(product)}>✏️ Edit</button>
          <button onClick={() => handleDelete(product.id)}>🗑️ Delete</button>
        </div>
      ))}
    </div>
  );
}
export default App;
