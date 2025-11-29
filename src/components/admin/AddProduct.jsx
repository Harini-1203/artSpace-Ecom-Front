import { useState } from "react";
import axios from "axios";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: 0,
    rating: 0,
    colors: [],
    sizes: [],
    attributes: {},
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newAttrKey, setNewAttrKey] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const addColor = () => {
    if (newColor.trim()) {
      setFormData((prev) => ({ ...prev, colors: [...prev.colors, newColor] }));
      setNewColor("");
    }
  };

  const addSize = () => {
    if (newSize.trim()) {
      setFormData((prev) => ({ ...prev, sizes: [...prev.sizes, newSize] }));
      setNewSize("");
    }
  };

  const addAttribute = () => {
    if (newAttrKey.trim() && newAttrValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, [newAttrKey]: newAttrValue },
      }));
      setNewAttrKey("");
      setNewAttrValue("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "attributes") {
        data.append("attributes", JSON.stringify(formData.attributes));
      } else if (Array.isArray(formData[key])) {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    });

    images.forEach((img) => data.append("images", img));

    try {
      await axios.post("http://localhost:5000/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added successfully!");
      setFormData({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: 0,
        rating: 0,
        colors: [],
        sizes: [],
        attributes: {},
      });
      setImages([]);
      setImagePreviews([]);
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded" required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} className="w-full border p-2 rounded" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded" />
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} className="w-full border p-2 rounded" required />
        {/* Sizes */}
        <div>
          <div className="flex gap-2">
            <input type="text" placeholder="Add Size" value={newSize} onChange={(e) => setNewSize(e.target.value)} className="border p-2 rounded w-full" />
            <button type="button" onClick={addSize} className="bg-green-500 text-white px-3 rounded">Add</button>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {formData.sizes.map((size, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-200 rounded">{size}</span>
            ))}
          </div>
        </div>

        {/* Attributes */}
        <div>
          <div className="flex gap-2">
            <input type="text" placeholder="Attribute Key (e.g., Material)" value={newAttrKey} onChange={(e) => setNewAttrKey(e.target.value)} className="border p-2 rounded w-full" />
            <input type="text" placeholder="Attribute Value" value={newAttrValue} onChange={(e) => setNewAttrValue(e.target.value)} className="border p-2 rounded w-full" />
            <button type="button" onClick={addAttribute} className="bg-green-500 text-white px-3 rounded">Add</button>
          </div>
          <ul className="mt-2">
            {Object.entries(formData.attributes).map(([key, value], idx) => (
              <li key={idx} className="text-sm">{key}: {value}</li>
            ))}
          </ul>
        </div>

        {/* Images */}
        <input type="file" multiple onChange={handleImageChange} className="w-full border p-2 rounded" />
        <div className="flex gap-2 flex-wrap mb-2">
          {imagePreviews.map((src, idx) => (
            <img key={idx} src={src} alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded border" />
          ))}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Product
        </button>
      </form>
    </div>
  );
}
