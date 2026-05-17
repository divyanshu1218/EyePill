import React, { useState } from "react";

import { AiOutlineClose } from "react-icons/ai";
import { BsCashCoin, BsCreditCard2Back } from "react-icons/bs";
import spinningLoader from "../../assets/spinning-circles.svg";
import OrderSummary from "./OrderSummary";
import { useAuthContext, useCartContext, useProductsContext } from "../../contexts";
import appLogo from "../../assets/thugGlasses.png";
import { useNavigate } from "react-router";
import { createOrderService, verifyPaymentService } from "../../api/apiServices";
import { notify } from "../../utils/utils";

const Modal = ({ showModal, setShowModal }) => {
  const { userInfo, token } = useAuthContext();
  const { clearCart, totalPriceOfCartProducts, cart } = useCartContext();
  const { currentAddress } = useProductsContext();
  const [disableBtn, setDisableBtn] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const navigate = useNavigate();

  const buildOrderData = () => ({
    firstName: currentAddress.fullname || userInfo?.username || "Customer",
    lastName: "",
    email: userInfo?.email || "customer@eyepill.com",
    phone: currentAddress.mobile || "9999999999",
    addressLine1: currentAddress.flat || "Flat/House No",
    addressLine2: currentAddress.area || "",
    city: currentAddress.city || "City",
    state: currentAddress.city || "State",
    zipCode: currentAddress.pincode || "110001",
    country: "India",
    paymentMethod,
    cartItems: cart.map(item => ({
      id: item.id,
      name: item.name,
      newPrice: item.newPrice,
      qty: item.qty,
      selectedColor: item.selectedColor || null,
      selectedSize: item.selectedSize || null,
    })),
  });

  const handleCODOrder = async () => {
    setDisableBtn(true);
    try {
      const orderData = buildOrderData();
      const response = await createOrderService(orderData, token);
      if (response.data.success) {
        clearCart();
        notify("success", "Order placed successfully!");
        navigate("/orders", { state: "orderSuccess" });
      }
    } catch (err) {
      console.error(err);
      notify("error", err?.response?.data?.message || "Failed to place order");
    } finally {
      setDisableBtn(false);
      setShowModal(false);
    }
  };

  const loadScript = async (url) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = url;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayOrder = async () => {
    setDisableBtn(true);
    try {
      // 1. Create order on backend first
      const orderData = buildOrderData();
      const response = await createOrderService(orderData, token);

      if (!response.data.success) {
        notify("error", "Failed to create order");
        setDisableBtn(false);
        return;
      }

      // 2. Load Razorpay SDK
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        notify("error", "Razorpay SDK failed to load. Check your connection.");
        setDisableBtn(false);
        return;
      }

      // 3. Open Razorpay checkout
      const options = {
        key: response.data.razorpayKeyId || "rzp_test_H2lv7MTHG3JATn",
        amount: Math.round(totalPriceOfCartProducts * 100),
        currency: "INR",
        name: "EyePill",
        description: "Be awesome with EyePill :)",
        image: appLogo,
        order_id: response.data.razorpayOrderId,
        handler: async function (paymentResponse) {
          try {
            // 4. Verify payment
            const verifyRes = await verifyPaymentService({
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
              orderId: response.data.order.id,
            }, token);

            if (verifyRes.data.success) {
              clearCart();
              notify("success", "Payment successful! Order confirmed.");
              navigate("/orders", { state: "orderSuccess" });
            }
          } catch (verifyErr) {
            console.error(verifyErr);
            notify("error", "Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: userInfo ? userInfo.username : "Test",
          email: userInfo ? userInfo.email : "abc@gmail.com",
          contact: currentAddress.phone || "9833445762",
        },
        theme: {
          color: "#1f2937",
        },
        modal: {
          ondismiss: function () {
            notify("warn", "Payment cancelled. Your order has been saved.");
            setDisableBtn(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);

      // 5. Handle payment failure
      paymentObject.on("payment.failed", function (response) {
        notify(
          "error",
          `Payment failed: ${response.error.description || "Unknown error"}. Please try again.`
        );
        setDisableBtn(false);
      });

      paymentObject.open();
    } catch (err) {
      console.error(err);
      notify("error", err?.response?.data?.message || "Something went wrong");
      setDisableBtn(false);
    } finally {
      setShowModal(false);
    }
  };

  const handleConfirm = () => {
    if (paymentMethod === "COD") {
      handleCODOrder();
    } else {
      handleRazorpayOrder();
    }
  };

  return (
    <>
      {showModal ? (
        <>
          <div className="transition justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[200] outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-2xl shadow-2xl relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-slate-200 rounded-t">
                  <h3 className="text-xl font-bold">Confirm Your Order</h3>
                  <button className="p-1 hover:bg-gray-100 rounded-full transition" onClick={() => setShowModal(false)}>
                    <AiOutlineClose />
                  </button>
                </div>

                <OrderSummary />

                {/* Payment Method Selection */}
                <div className="px-7 py-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("RAZORPAY")}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === "RAZORPAY"
                          ? "border-blue-600 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <BsCreditCard2Back className={`text-2xl ${paymentMethod === "RAZORPAY" ? "text-blue-600" : "text-gray-400"}`} />
                      <div className="text-left">
                        <p className={`font-bold text-sm ${paymentMethod === "RAZORPAY" ? "text-blue-700" : "text-gray-700"}`}>Razorpay</p>
                        <p className="text-[10px] text-gray-400">Cards, UPI, Wallets</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("COD")}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === "COD"
                          ? "border-green-600 bg-green-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <BsCashCoin className={`text-2xl ${paymentMethod === "COD" ? "text-green-600" : "text-gray-400"}`} />
                      <div className="text-left">
                        <p className={`font-bold text-sm ${paymentMethod === "COD" ? "text-green-700" : "text-gray-700"}`}>Cash on Delivery</p>
                        <p className="text-[10px] text-gray-400">Pay when delivered</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 rounded-xl border border-gray-200 font-bold text-sm text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={disableBtn}
                    className="btn-rounded-primary w-1/2 text-sm ease-linear transition-all duration-150 h-10 flex justify-center items-center disabled:cursor-wait"
                    type="button"
                    onClick={handleConfirm}
                  >
                    {disableBtn ? (
                      <img src={spinningLoader} alt="" height={20} />
                    ) : paymentMethod === "COD" ? (
                      <span>Place COD Order</span>
                    ) : (
                      <span>Pay ₹{totalPriceOfCartProducts}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-[190] bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
