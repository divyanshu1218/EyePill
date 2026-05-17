import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router";
import { useAuthContext } from "../contexts";
import { notify } from "../utils/utils";
import orderSuccess from "../assets/success-order.gif";
import { BsBoxSeam, BsCheckCircle, BsTruck, BsXCircle } from "react-icons/bs";
import { getUserOrdersService, cancelOrderService } from "../api/apiServices";

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Check if this is a success redirect
  useEffect(() => {
    if (location?.state === "orderSuccess") {
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    }
  }, [location?.state]);

  // Fetch user orders
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getUserOrdersService(token);

        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error(error);
        notify("error", "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  // Cancel order handler
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const response = await cancelOrderService(orderId, token);

      if (response.data.success) {
        notify("success", "Order cancelled successfully");
        // Update the orders list
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, orderStatus: 'CANCELLED' } : order
        ));
      }
    } catch (error) {
      console.error(error);
      notify("error", error.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <BsBoxSeam className="text-yellow-500 text-xl" />;
      case 'CONFIRMED':
        return <BsCheckCircle className="text-blue-500 text-xl" />;
      case 'SHIPPED':
        return <BsTruck className="text-purple-500 text-xl" />;
      case 'DELIVERED':
        return <BsCheckCircle className="text-green-500 text-xl" />;
      case 'CANCELLED':
        return <BsXCircle className="text-red-500 text-xl" />;
      default:
        return <BsBoxSeam className="text-gray-500 text-xl" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showSuccessModal) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center py-3">
        <Helmet><title>Order Confirmed | EyePill</title></Helmet>
        <div className="bg-white h-1/2 w-96 m-auto rounded-md flex flex-col items-center justify-center p-5 modalShadow">
          <div className="w-64 flex items-center justify-center">
            <img
              src={orderSuccess}
              alt="order-successful"
              className="w-full object-fit"
            />
          </div>
          <p className="text-3xl py-2 font-semibold text-gray-700">
            Order Successful
          </p>
          <p className="text-sm text-gray-400">
            Thank you for ordering with us :)
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 m-auto mb-4"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please login to view your orders</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="text-center">
          <BsBoxSeam className="text-6xl text-gray-300 m-auto mb-4" />
          <p className="text-xl text-gray-600 mb-4">No orders yet</p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <Helmet><title>My Orders | EyePill</title></Helmet>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              {/* Order Header */}
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {order.orderNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{order.totalAmount?.toFixed(2) || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(order.orderStatus)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Items ({order.items?.length || 0})
                </h3>
                <div className="space-y-2">
                  {order.items?.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">
                          {item.productName}
                          {item.selectedColor && ` - ${item.selectedColor}`}
                          {item.selectedSize && ` - ${item.selectedSize}`}
                        </p>
                        <p className="text-gray-500">
                          Qty: {item.quantity} × ₹{item.price?.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">
                        ₹{(item.totalPrice || item.price * item.quantity)?.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pb-4 border-t">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Delivery Address</p>
                  <p className="text-sm text-gray-600">
                    {order.addressLine1}
                    {order.addressLine2 && `, ${order.addressLine2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.city}, {order.state} - {order.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{order.country}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Contact Info</p>
                  <p className="text-sm text-gray-600">Phone: {order.phone}</p>
                  <p className="text-sm text-gray-600">Email: {order.email}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Payment: <span className="font-medium">{order.paymentMethod}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {['PENDING', 'CONFIRMED'].includes(order.orderStatus) && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm font-medium"
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  onClick={() => navigate(`/product/${order.items?.[0]?.productId}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
                >
                  View Similar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
