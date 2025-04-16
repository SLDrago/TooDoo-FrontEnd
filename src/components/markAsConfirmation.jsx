import { X } from "lucide-react";

const MarkAsConfirmation = ({ isOpen, onClose, isComplete, confirmation }) => {
  if (!isOpen) return null;

  const handleAccept = () => {
    confirmation();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10 px-2">
        <div className="bg-white w-full mx-2 sm:w-1/5 rounded-xl shadow-2xl p-4">
          <div className="flex items-center justify-between p-4">
            <div className="font-bold text-xl">Please Confirm</div>
            <button
              onClick={onClose}
              className="p-1 rounded-full cursor-pointer hover:shadow-sm"
            >
              <X className="w-6 h-6 text-red-500" />
            </button>
          </div>
          {isComplete ? (
            <div className="font-light text-lg p-4">
              Are you sure you want to mark this task as incomplete?
            </div>
          ) : (
            <div className="font-light text-lg p-4">
              Are you completed this task?
            </div>
          )}
          <div className="items-center grid grid-cols-2 gap-2 p-4">
            <button
              className="bg-gray-400 text-white shadow-md hover:bg-gray-800 rounded-lg p-2 font-bold"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white shadow-md hover:bg-blue-600 rounded-lg p-2 font-bold"
              onClick={handleAccept}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkAsConfirmation;
