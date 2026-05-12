import { useProductsContext } from "../../contexts";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePhone, AiOutlineEnvironment } from "react-icons/ai";

const AddressCard = ({
  address,
  isEdit,
  showInput = true,
  editAddress,
  setEditAddress,
  setShowAddressForm,
}) => {
  const { id, fullname, mobile, flat, area, city, pincode } = address;
  const { currentAddress, setCurrentAddress, deleteAddress } =
    useProductsContext();
  
  const isSelected = id === currentAddress.id;

  return (
    <div
      onClick={() => showInput && setCurrentAddress(address)}
      className={`relative group flex flex-col p-6 rounded-2xl transition-all duration-300 cursor-pointer border ${
        isSelected 
          ? "bg-blue-50 border-blue-200 shadow-md shadow-blue-100" 
          : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-lg"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {showInput && (
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
              isSelected ? "border-blue-600" : "border-gray-300"
            }`}>
              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">{fullname}</h3>
        </div>
        
        {isEdit && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-900 hover:text-white transition-all shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                setEditAddress(address);
                setShowAddressForm(true);
              }}
              title="Edit Address"
            >
              <AiOutlineEdit className="text-lg" />
            </button>
            <button
              className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                deleteAddress(id);
              }}
              title="Remove Address"
            >
              <AiOutlineDelete className="text-lg" />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start gap-2 text-gray-500">
          <AiOutlineEnvironment className="mt-1 shrink-0" />
          <p className="text-sm leading-relaxed">
            {flat}, {area}<br />
            {city} - <span className="font-bold text-gray-700">{pincode}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 pt-2 border-t border-gray-50 mt-2">
          <AiOutlinePhone className="shrink-0" />
          <p className="text-sm">
            <span className="text-gray-400 mr-1">Mobile:</span>
            <span className="font-bold text-gray-700">{mobile}</span>
          </p>
        </div>
      </div>

      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
           Default
        </div>
      )}
    </div>
  );
};
export default AddressCard;
