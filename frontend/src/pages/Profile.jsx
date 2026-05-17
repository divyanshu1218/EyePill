import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuthContext } from "../contexts";
import Address from "../components/address/Address";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AiOutlineUser, 
  AiOutlineHome, 
  AiOutlineLogout, 
  AiOutlineMail,
  AiOutlineSafety,
  AiOutlinePhone,
  AiOutlineEdit
} from "react-icons/ai";
import axios from "axios";
import { notify } from "../utils/utils";
import { PROFILE_URL } from "../api/apiUrls";

const Profile = () => {
  const { logoutHandler, userInfo, setUserInfo, token } = useAuthContext();
  const userDetails = userInfo;
  const [selectedItem, setSelectedItem] = useState("profile");
  const [loggingOut, setLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);

  // Fetch profile data
  useEffect(() => {
    if (token) {
      (async () => {
        try {
          const res = await axios.get(PROFILE_URL, { headers: { authorization: token } });
          if (res.data.success) {
            const { firstName, lastName, phone, role, username, email, id } = res.data.user;
            setProfileData({
              firstName: firstName || "",
              lastName: lastName || "",
              phone: phone || "",
            });
            // Sync user role and info inside local context and localStorage
            if (userInfo && (userInfo.role !== role || userInfo.username !== username || userInfo.email !== email)) {
              const updatedUser = {
                ...userInfo,
                _id: id,
                username,
                email,
                role
              };
              setUserInfo(updatedUser);
              localStorage.setItem("userInfo", JSON.stringify(updatedUser));
            }
          }
        } catch (err) { console.error(err); }
      })();
    }
  }, [token, userInfo, setUserInfo]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await axios.put(PROFILE_URL, profileData, {
        headers: { authorization: token },
      });
      if (res.data.success) {
        notify("success", "Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      notify("error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogOut = () => {
    setLoggingOut(true);
    setTimeout(() => {
      logoutHandler();
      setLoggingOut(false);
    }, 1000);
  };

  const menuItems = [
    { id: "profile", label: "My Profile", icon: <AiOutlineUser /> },
    { id: "address", label: "Addresses", icon: <AiOutlineHome /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pt-10 pb-20">
      <Helmet><title>Account Settings | EyePill</title></Helmet>
      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Account Settings</h1>
          <p className="text-gray-500 mt-2">Manage your profile, addresses and account preferences.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    selectedItem === item.id
                      ? "bg-gray-900 text-white shadow-lg shadow-gray-200"
                      : "text-gray-500 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.label}
                </button>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  disabled={loggingOut}
                  onClick={handleLogOut}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all w-full"
                >
                  <AiOutlineLogout className="text-xl" />
                  {loggingOut ? "Logging Out..." : "Sign Out"}
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              {selectedItem === "profile" ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-blue-100">
                      {userDetails?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center sm:text-left flex-grow">
                      <h2 className="text-2xl font-bold text-gray-900">{userDetails?.username}</h2>
                      <div className="flex items-center gap-2 mt-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-wider w-fit mx-auto sm:mx-0">
                        <AiOutlineSafety /> {userDetails?.role || 'User'} Account
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition"
                    >
                      <AiOutlineEdit /> {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4 mb-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">First Name</label>
                          <input
                            type="text"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            placeholder="Enter first name"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Last Name</label>
                          <input
                            type="text"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            placeholder="Enter last name"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          placeholder="Enter phone number"
                          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </div>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                          <AiOutlineUser className="text-lg" />
                          <span className="text-xs font-bold uppercase tracking-widest">Full Name</span>
                        </div>
                        <p className="text-gray-900 font-bold">
                          {profileData.firstName || profileData.lastName
                            ? `${profileData.firstName} ${profileData.lastName}`.trim()
                            : userDetails?.username || 'Not provided'}
                        </p>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                          <AiOutlineMail className="text-lg" />
                          <span className="text-xs font-bold uppercase tracking-widest">Email Address</span>
                        </div>
                        <p className="text-gray-900 font-bold">{userDetails?.email || 'Not provided'}</p>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                          <AiOutlinePhone className="text-lg" />
                          <span className="text-xs font-bold uppercase tracking-widest">Phone Number</span>
                        </div>
                        <p className="text-gray-900 font-bold">{profileData.phone || 'Not provided'}</p>
                      </div>

                      <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3 text-gray-400 mb-2">
                          <AiOutlineSafety className="text-lg" />
                          <span className="text-xs font-bold uppercase tracking-widest">Account Type</span>
                        </div>
                        <p className="text-gray-900 font-bold capitalize">{userDetails?.role || 'User'}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-10 pt-10 border-t border-gray-100">
                     <h3 className="text-lg font-bold text-gray-900 mb-4">Security</h3>
                     <p className="text-sm text-gray-500 mb-6">Your password and security settings can be updated here.</p>
                     <button className="px-6 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-all text-sm">
                        Change Password
                     </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Delivery Addresses</h2>
                      <p className="text-sm text-gray-500 mt-1">Manage your saved addresses for faster checkout.</p>
                    </div>
                  </div>
                  <Address isEdit />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;

