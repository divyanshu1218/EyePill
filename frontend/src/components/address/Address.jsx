import React, { Fragment, useState } from "react";

import { useProductsContext } from "../../contexts";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

const Address = ({ isEdit }) => {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const { addressList } = useProductsContext();
  return (
    <>
      {!isEdit && <h1 className="text-2xl font-bold">Address</h1>}
      {showAddressForm && !editAddress ? (
        <AddressForm
          setShowAddressForm={setShowAddressForm}
          editAddress={editAddress}
          setEditAddress={setEditAddress}
        />
      ) : (
      <div className="flex flex-col items-start mb-6">
          <button
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-black transition-all active:scale-[0.98]"
            onClick={() => {
              setShowAddressForm(true);
              setEditAddress(false);
            }}
          >
            <span className="text-xl">+</span> Add New Address
          </button>
      </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addressList.map((address) => (
          <Fragment key={address.id}>
            {showAddressForm && editAddress?.id === address.id ? (
              <AddressForm
                setShowAddressForm={setShowAddressForm}
                editAddress={editAddress}
                setEditAddress={setEditAddress}
              />
            ) : (
              <AddressCard
                address={address}
                isEdit={isEdit}
                editAddress={editAddress}
                setEditAddress={setEditAddress}
                setShowAddressForm={setShowAddressForm}
              />
            )}
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default Address;
