import { useState } from "react";
import { useAuthContext, useProductsContext } from "../contexts";
import axios from "axios";
import { notify } from "../utils/utils";
import { toast } from "react-toastify";

const Admin = () => {
    const { token } = useAuthContext();
    const { allProducts, refreshProducts } = useProductsContext();
    const [productData, setProductData] = useState({
        name: "",
        brand: "",
        price: "",
        newPrice: "",
        category: "sports",
        gender: "unisex",
        description: "",
        image: null,
        additionalImages: [],
        qty: "",
        trending: false,
        colors: "",
        sizes: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [previews, setPreviews] = useState({ main: null, additional: [] });
    const [hiddenProductIds, setHiddenProductIds] = useState([]);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('brand', productData.brand);
            formData.append('price', productData.price);
            formData.append('newPrice', productData.newPrice);
            formData.append('category', productData.category);
            formData.append('gender', productData.gender);
            formData.append('description', productData.description);
            formData.append('qty', productData.qty);
            formData.append('trending', productData.trending);
            
            // Format colors and sizes as arrays
            const colorsArray = productData.colors ? productData.colors.split(',').map(c => c.trim()).filter(c => c) : [];
            const sizesArray = productData.sizes ? productData.sizes.split(',').map(s => s.trim()).filter(s => s) : [];
            formData.append('colors', JSON.stringify(colorsArray));
            formData.append('sizes', JSON.stringify(sizesArray));

            if (productData.image) {
                formData.append('image', productData.image);
            }
            productData.additionalImages.forEach(file => {
                formData.append('additionalImages', file);
            });

            const config = {
                headers: { authorization: token }
            };

            let response;
            if (isEditing) {
                response = await axios.put(`/api/admin/products/${editProductId}`, formData, config);
            } else {
                response = await axios.post('/api/admin/products', formData, config);
            }

            if (response.data.success) {
                notify("success", isEditing ? "Product Updated!" : "Product Added Successfully!");
                setProductData({
                    name: "",
                    brand: "",
                    price: "",
                    newPrice: "",
                    category: "sports",
                    gender: "unisex",
                    description: "",
                    image: null,
                    additionalImages: [],
                    qty: "",
                    trending: false,
                    colors: "",
                    sizes: ""
                });
                setIsEditing(false);
                setEditProductId(null);
                setPreviews({ main: null, additional: [] });
                refreshProducts();
            }
        } catch (err) {
            console.error(err);
            notify("error", "Failed to add product");
        }
    };

    const handleDeleteProduct = (id) => {
        // 1. Hide it locally immediately for an optimistic update
        setHiddenProductIds(prev => [...prev, id]);
        
        // 2. Set timeout to delete on the backend after 5 seconds
        const timeoutId = setTimeout(async () => {
            try {
                const config = {
                    headers: { authorization: token }
                };
                const response = await axios.delete(`/api/admin/products/${id}`, config);
                if (response.data.success) {
                    refreshProducts();
                    setHiddenProductIds(prev => prev.filter(hiddenId => hiddenId !== id)); // Clean up state
                }
            } catch (err) {
                console.error(err);
                notify("error", "Failed to delete product");
                // Unhide if the deletion fails on the server
                setHiddenProductIds(prev => prev.filter(hiddenId => hiddenId !== id));
            }
        }, 5000);

        // 3. Show custom toast with Undo button
        toast(
            ({ closeToast }) => (
                <div className="flex justify-between items-center w-full">
                    <span>Product Removed!</span>
                    <button 
                        onClick={() => {
                            clearTimeout(timeoutId);
                            setHiddenProductIds(prev => prev.filter(hiddenId => hiddenId !== id));
                            closeToast();
                            notify("info", "Product Restored");
                        }}
                        className="ml-4 font-bold underline text-blue-600 bg-blue-50 px-2 py-1 rounded"
                    >
                        UNDO
                    </button>
                </div>
            ),
            { 
                autoClose: 5000, 
                position: toast.POSITION?.BOTTOM_CENTER || "bottom-center",
                closeButton: false,
                type: "success"
            }
        );
    };

    const handleEditClick = (product) => {
        setIsEditing(true);
        setEditProductId(product.id);
        setProductData({
            name: product.name,
            brand: product.brand || "",
            price: product.price,
            newPrice: product.newPrice,
            category: product.category,
            gender: product.gender,
            description: product.description || "",
            image: null,
            additionalImages: [],
            qty: product.qty,
            trending: product.trending,
            colors: product.colors ? (Array.isArray(product.colors) ? product.colors.join(', ') : product.colors) : "",
            sizes: product.sizes ? (Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes) : ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="container mx-auto p-4 pt-24">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            
            <section className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" required className="border p-2 rounded" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} />
                    <input type="text" placeholder="Brand" className="border p-2 rounded" value={productData.brand} onChange={e => setProductData({...productData, brand: e.target.value})} />
                    <input type="number" placeholder="Original Price" required className="border p-2 rounded" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} />
                    <input type="number" placeholder="Discounted Price" required className="border p-2 rounded" value={productData.newPrice} onChange={e => setProductData({...productData, newPrice: e.target.value})} />
                    <select className="border p-2 rounded" value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})}>
                        <option value="sports">Sports</option>
                        <option value="sunglasses">Sunglasses</option>
                        <option value="vision">Vision</option>
                    </select>
                    <select className="border p-2 rounded" value={productData.gender} onChange={e => setProductData({...productData, gender: e.target.value})}>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="unisex">Unisex</option>
                    </select>
                    <div className="col-span-2 space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Image</label>
                            <input 
                                type="file" 
                                accept="image/*"
                                className="border p-2 rounded w-full" 
                                onChange={e => {
                                    const file = e.target.files[0];
                                    setProductData({...productData, image: file});
                                    if (file) setPreviews({...previews, main: URL.createObjectURL(file)});
                                }} 
                            />
                            {previews.main && <img src={previews.main} alt="Preview" className="h-20 mt-2 rounded shadow" />}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Gallery Images</label>
                            <input 
                                type="file" 
                                accept="image/*"
                                multiple
                                className="border p-2 rounded w-full" 
                                onChange={e => {
                                    const files = Array.from(e.target.files);
                                    setProductData({...productData, additionalImages: [...productData.additionalImages, ...files]});
                                    const newPreviews = files.map(file => URL.createObjectURL(file));
                                    setPreviews({...previews, additional: [...previews.additional, ...newPreviews]});
                                }} 
                            />
                            <div className="flex gap-2 flex-wrap mt-2">
                                {previews.additional.map((prev, i) => (
                                    <div key={i} className="relative">
                                        <img src={prev} alt="Preview" className="h-20 w-20 object-cover rounded shadow" />
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                const newImgs = productData.additionalImages.filter((_, idx) => idx !== i);
                                                const newPrevs = previews.additional.filter((_, idx) => idx !== i);
                                                setProductData({...productData, additionalImages: newImgs});
                                                setPreviews({...previews, additional: newPrevs});
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                        >×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <textarea placeholder="Description" className="border p-2 rounded col-span-2" value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} />
                    
                    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="Colors (e.g. Black, Red, Blue)" 
                            className="border p-2 rounded" 
                            value={productData.colors} 
                            onChange={e => setProductData({...productData, colors: e.target.value})} 
                        />
                        <input 
                            type="text" 
                            placeholder="Sizes (e.g. S, M, L, XL)" 
                            className="border p-2 rounded" 
                            value={productData.sizes} 
                            onChange={e => setProductData({...productData, sizes: e.target.value})} 
                        />
                    </div>

                    <input type="number" placeholder="Quantity" className="border p-2 rounded" value={productData.qty} onChange={e => setProductData({...productData, qty: e.target.value})} />
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={productData.trending} onChange={e => setProductData({...productData, trending: e.target.checked})} />
                        Trending
                    </label>
                    <div className="col-span-2 flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition flex-1">
                            {isEditing ? "Update Product" : "Add Product"}
                        </button>
                        {isEditing && (
                            <button 
                                type="button" 
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditProductId(null);
                                    setProductData({
                                        name: "", brand: "", price: "", newPrice: "", category: "sports", gender: "unisex", description: "", image: null, additionalImages: [], qty: "", trending: false, colors: "", sizes: ""
                                    });
                                }}
                                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                            >Cancel</button>
                        )}
                    </div>
                </form>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Manage Products</h2>
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Category</th>
                                <th className="p-3 text-left">Price</th>
                                <th className="p-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allProducts.filter(product => !hiddenProductIds.includes(product.id)).map(product => (
                                <tr key={product.id} className="border-t">
                                    <td className="p-3">{product.name}</td>
                                    <td className="p-3 uppercase text-xs">{product.category}</td>
                                    <td className="p-3">₹{product.newPrice}</td>
                                    <td className="p-3 space-x-2">
                                        <button onClick={() => handleEditClick(product)} className="text-blue-600 hover:underline">Edit</button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default Admin;
