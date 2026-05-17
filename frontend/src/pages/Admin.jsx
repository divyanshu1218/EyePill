import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuthContext, useProductsContext } from "../contexts";
import axios from "axios";
import { notify } from "../utils/utils";
import { toast } from "react-toastify";
import { getAdminDashboardMetricsService } from "../api/apiServices";
import { BsPeople, BsShop, BsCurrencyRupee, BsTruck, BsCheckCircle, BsXCircle, BsClock } from "react-icons/bs";
import { HiOutlineShoppingBag } from "react-icons/hi";

const TABS = [
    { id: "dashboard", label: "Dashboard" },
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
    { id: "users", label: "Users" },
];

const API_PREFIX = process.env.REACT_APP_API_BASE_URL ? process.env.REACT_APP_API_BASE_URL.replace(/\/api$/, "") : "";

const Admin = () => {
    const { token } = useAuthContext();
    const { allProducts, refreshProducts } = useProductsContext();
    const [activeTab, setActiveTab] = useState("dashboard");

    // Dashboard state
    const [metrics, setMetrics] = useState(null);
    const [loadingMetrics, setLoadingMetrics] = useState(true);

    // Products state
    const [productData, setProductData] = useState({
        name: "", brand: "", price: "", newPrice: "", category: "sports", gender: "unisex",
        description: "", image: null, additionalImages: [], qty: "", trending: false, colors: "", sizes: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [previews, setPreviews] = useState({ main: null, additional: [] });
    const [hiddenProductIds, setHiddenProductIds] = useState([]);

    // Orders state
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Users state
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Fetch dashboard metrics
    useEffect(() => {
        if (activeTab === "dashboard" && token) {
            (async () => {
                setLoadingMetrics(true);
                try {
                    const res = await getAdminDashboardMetricsService(token);
                    if (res.data.success) setMetrics(res.data.metrics);
                } catch (err) { console.error(err); }
                finally { setLoadingMetrics(false); }
            })();
        }
    }, [activeTab, token]);

    // Fetch orders
    useEffect(() => {
        if (activeTab === "orders" && token) {
            (async () => {
                setLoadingOrders(true);
                try {
                    const res = await axios.get(API_PREFIX + "/api/orders/admin/all", { headers: { authorization: token } });
                    if (res.data.success) setOrders(res.data.orders);
                } catch (err) { console.error(err); notify("error", "Failed to load orders"); }
                finally { setLoadingOrders(false); }
            })();
        }
    }, [activeTab, token]);

    // Fetch users
    useEffect(() => {
        if (activeTab === "users" && token) {
            (async () => {
                setLoadingUsers(true);
                try {
                    const res = await axios.get(API_PREFIX + "/api/admin/users", { headers: { authorization: token } });
                    if (res.data.success) setUsers(res.data.users);
                } catch (err) { console.error(err); }
                finally { setLoadingUsers(false); }
            })();
        }
    }, [activeTab, token]);

    // Order status update
    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            const res = await axios.put(API_PREFIX + `/api/orders/admin/${orderId}`, { orderStatus: newStatus }, { headers: { authorization: token } });
            if (res.data.success) {
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
                notify("success", `Order status updated to ${newStatus}`);
            }
        } catch (err) { notify("error", "Failed to update order status"); }
    };

    // Product handlers
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
            const colorsArray = productData.colors ? productData.colors.split(',').map(c => c.trim()).filter(c => c) : [];
            const sizesArray = productData.sizes ? productData.sizes.split(',').map(s => s.trim()).filter(s => s) : [];
            formData.append('colors', JSON.stringify(colorsArray));
            formData.append('sizes', JSON.stringify(sizesArray));
            if (productData.image) formData.append('image', productData.image);
            productData.additionalImages.forEach(file => formData.append('additionalImages', file));

            const config = { headers: { authorization: token } };
            let response;
            if (isEditing) {
                response = await axios.put(API_PREFIX + `/api/admin/products/${editProductId}`, formData, config);
            } else {
                response = await axios.post(API_PREFIX + '/api/admin/products', formData, config);
            }

            if (response.data.success) {
                notify("success", isEditing ? "Product Updated!" : "Product Added Successfully!");
                resetProductForm();
                refreshProducts();
            }
        } catch (err) { console.error(err); notify("error", "Failed to save product"); }
    };

    const resetProductForm = () => {
        setProductData({ name: "", brand: "", price: "", newPrice: "", category: "sports", gender: "unisex", description: "", image: null, additionalImages: [], qty: "", trending: false, colors: "", sizes: "" });
        setIsEditing(false);
        setEditProductId(null);
        setPreviews({ main: null, additional: [] });
    };

    const handleDeleteProduct = (id) => {
        setHiddenProductIds(prev => [...prev, id]);
        const timeoutId = setTimeout(async () => {
            try {
                const response = await axios.delete(API_PREFIX + `/api/admin/products/${id}`, { headers: { authorization: token } });
                if (response.data.success) { refreshProducts(); setHiddenProductIds(prev => prev.filter(hid => hid !== id)); }
            } catch (err) { console.error(err); notify("error", "Failed to delete product"); setHiddenProductIds(prev => prev.filter(hid => hid !== id)); }
        }, 5000);

        toast(({ closeToast }) => (
            <div className="flex justify-between items-center w-full">
                <span>Product Removed!</span>
                <button onClick={() => { clearTimeout(timeoutId); setHiddenProductIds(prev => prev.filter(hid => hid !== id)); closeToast(); notify("info", "Product Restored"); }}
                    className="ml-4 font-bold underline text-blue-600 bg-blue-50 px-2 py-1 rounded">UNDO</button>
            </div>
        ), { autoClose: 5000, position: toast.POSITION?.BOTTOM_CENTER || "bottom-center", closeButton: false, type: "success" });
    };

    const handleEditClick = (product) => {
        setActiveTab("products");
        setIsEditing(true);
        setEditProductId(product.id);
        setProductData({
            name: product.name, brand: product.brand || "", price: product.price, newPrice: product.newPrice,
            category: product.category, gender: product.gender, description: product.description || "",
            image: null, additionalImages: [], qty: product.qty, trending: product.trending,
            colors: product.colors ? (Array.isArray(product.colors) ? product.colors.join(', ') : product.colors) : "",
            sizes: product.sizes ? (Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes) : ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getStatusColor = (status) => {
        const colors = { PENDING: 'bg-yellow-100 text-yellow-800', CONFIRMED: 'bg-blue-100 text-blue-800', SHIPPED: 'bg-purple-100 text-purple-800', DELIVERED: 'bg-green-100 text-green-800', CANCELLED: 'bg-red-100 text-red-800' };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="container mx-auto p-4 pt-24 max-w-7xl">
            <Helmet><title>Admin Dashboard | EyePill</title></Helmet>
            <h1 className="text-3xl font-black mb-6 tracking-tight">Admin Panel</h1>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-2xl w-fit">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                        }`}>{tab.label}</button>
                ))}
            </div>

            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
                <div className="space-y-8">
                    {loadingMetrics ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>
                    ) : metrics ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <MetricCard icon={<BsPeople className="text-2xl" />} label="Total Users" value={metrics.totalUsers} color="blue" />
                                <MetricCard icon={<BsShop className="text-2xl" />} label="Total Products" value={metrics.totalProducts} color="purple" />
                                <MetricCard icon={<HiOutlineShoppingBag className="text-2xl" />} label="Total Orders" value={metrics.totalOrders} color="amber" />
                                <MetricCard icon={<BsCurrencyRupee className="text-2xl" />} label="Revenue" value={`₹${Number(metrics.totalRevenue).toLocaleString()}`} color="green" />
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <SmallMetric icon={<BsClock />} label="Pending" value={metrics.pendingOrders} color="yellow" />
                                <SmallMetric icon={<BsTruck />} label="Shipped" value={metrics.shippedOrders} color="purple" />
                                <SmallMetric icon={<BsCheckCircle />} label="Delivered" value={metrics.deliveredOrders} color="green" />
                                <SmallMetric icon={<BsXCircle />} label="Low Stock" value={metrics.lowStockProducts} color="red" />
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-400 text-center py-20">Failed to load metrics</p>
                    )}
                </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === "products" && (
                <div className="space-y-8">
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Product" : "Add New Product"}</h2>
                        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Name" required className="border p-2.5 rounded-xl" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} />
                            <input type="text" placeholder="Brand" className="border p-2.5 rounded-xl" value={productData.brand} onChange={e => setProductData({...productData, brand: e.target.value})} />
                            <input type="number" placeholder="Original Price" required className="border p-2.5 rounded-xl" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} />
                            <input type="number" placeholder="Discounted Price" className="border p-2.5 rounded-xl" value={productData.newPrice} onChange={e => setProductData({...productData, newPrice: e.target.value})} />
                            <select className="border p-2.5 rounded-xl" value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})}>
                                <option value="sports">Sports</option><option value="sunglasses">Sunglasses</option><option value="vision">Vision</option>
                            </select>
                            <select className="border p-2.5 rounded-xl" value={productData.gender} onChange={e => setProductData({...productData, gender: e.target.value})}>
                                <option value="men">Men</option><option value="women">Women</option><option value="unisex">Unisex</option>
                            </select>
                            <div className="col-span-2 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Image</label>
                                    <input type="file" accept="image/*" className="border p-2 rounded-xl w-full"
                                        onChange={e => { const file = e.target.files[0]; setProductData({...productData, image: file}); if (file) setPreviews({...previews, main: URL.createObjectURL(file)}); }} />
                                    {previews.main && <img src={previews.main} alt="Preview" className="h-20 mt-2 rounded shadow" />}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Gallery Images</label>
                                    <input type="file" accept="image/*" multiple className="border p-2 rounded-xl w-full"
                                        onChange={e => { const files = Array.from(e.target.files); setProductData({...productData, additionalImages: [...productData.additionalImages, ...files]}); const newPreviews = files.map(file => URL.createObjectURL(file)); setPreviews({...previews, additional: [...previews.additional, ...newPreviews]}); }} />
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {previews.additional.map((prev, i) => (
                                            <div key={i} className="relative">
                                                <img src={prev} alt="Preview" className="h-20 w-20 object-cover rounded shadow" />
                                                <button type="button" onClick={() => { setProductData({...productData, additionalImages: productData.additionalImages.filter((_, idx) => idx !== i)}); setPreviews({...previews, additional: previews.additional.filter((_, idx) => idx !== i)}); }}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <textarea placeholder="Description" className="border p-2.5 rounded-xl col-span-2" value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} />
                            <input type="text" placeholder="Colors (e.g. Black, Red, Blue)" className="border p-2.5 rounded-xl" value={productData.colors} onChange={e => setProductData({...productData, colors: e.target.value})} />
                            <input type="text" placeholder="Sizes (e.g. S, M, L, XL)" className="border p-2.5 rounded-xl" value={productData.sizes} onChange={e => setProductData({...productData, sizes: e.target.value})} />
                            <input type="number" placeholder="Quantity" className="border p-2.5 rounded-xl" value={productData.qty} onChange={e => setProductData({...productData, qty: e.target.value})} />
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={productData.trending} onChange={e => setProductData({...productData, trending: e.target.checked})} /> Trending
                            </label>
                            <div className="col-span-2 flex gap-2">
                                <button type="submit" className="bg-gray-900 text-white p-2.5 rounded-xl hover:bg-gray-800 transition flex-1 font-bold">{isEditing ? "Update Product" : "Add Product"}</button>
                                {isEditing && <button type="button" onClick={resetProductForm} className="bg-gray-200 text-gray-700 p-2.5 rounded-xl hover:bg-gray-300 transition font-bold">Cancel</button>}
                            </div>
                        </form>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">Manage Products ({allProducts.filter(p => !hiddenProductIds.includes(p.id)).length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
                                <thead className="bg-gray-50"><tr>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Name</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Category</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Price</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Stock</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Action</th>
                                </tr></thead>
                                <tbody>
                                    {allProducts.filter(product => !hiddenProductIds.includes(product.id)).map(product => (
                                        <tr key={product.id} className="border-t hover:bg-gray-50 transition">
                                            <td className="p-3 font-medium">{product.name}</td>
                                            <td className="p-3 uppercase text-xs font-bold text-gray-400">{product.category}</td>
                                            <td className="p-3">₹{product.newPrice}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.qty <= 0 ? 'bg-red-100 text-red-700' : product.qty <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                                    {product.qty <= 0 ? 'Out' : product.qty}
                                                </span>
                                            </td>
                                            <td className="p-3 space-x-2">
                                                <button onClick={() => handleEditClick(product)} className="text-blue-600 hover:underline font-medium text-sm">Edit</button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:underline font-medium text-sm">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">All Orders ({orders.length})</h2>
                    {loadingOrders ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>
                    ) : orders.length === 0 ? (
                        <p className="text-gray-400 text-center py-20">No orders yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
                                <thead className="bg-gray-50"><tr>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Order #</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Date</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Customer</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Items</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Amount</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Payment</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Status</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Update</th>
                                </tr></thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                                            <td className="p-3 font-mono text-sm">{order.orderNumber}</td>
                                            <td className="p-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="p-3 text-sm">{order.firstName} {order.lastName}</td>
                                            <td className="p-3 text-sm">{order.items?.length || 0}</td>
                                            <td className="p-3 font-bold">₹{order.totalAmount?.toFixed(2)}</td>
                                            <td className="p-3"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-gray-100">{order.paymentMethod}</span></td>
                                            <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(order.orderStatus)}`}>{order.orderStatus}</span></td>
                                            <td className="p-3">
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                                                    className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                >
                                                    {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* USERS TAB */}
            {activeTab === "users" && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">All Users ({users.length})</h2>
                    {loadingUsers ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>
                    ) : users.length === 0 ? (
                        <p className="text-gray-400 text-center py-20">No users found</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
                                <thead className="bg-gray-50"><tr>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">ID</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Username</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Email</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Role</th>
                                    <th className="p-3 text-left text-sm font-bold text-gray-500">Joined</th>
                                </tr></thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="border-t hover:bg-gray-50 transition">
                                            <td className="p-3 text-sm text-gray-400">#{user.id}</td>
                                            <td className="p-3 font-medium">{user.username}</td>
                                            <td className="p-3 text-sm text-gray-600">{user.email}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Metric card components
const MetricCard = ({ icon, label, value, color }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition`}>
        <div className={`p-3 rounded-xl bg-${color}-100 text-${color}-600`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-400 font-medium">{label}</p>
            <p className="text-2xl font-black text-gray-900">{value}</p>
        </div>
    </div>
);

const SmallMetric = ({ icon, label, value, color }) => (
    <div className={`bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3`}>
        <span className={`text-${color}-500`}>{icon}</span>
        <div>
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-lg font-bold">{value}</p>
        </div>
    </div>
);

export default Admin;
