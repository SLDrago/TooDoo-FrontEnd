import { useState } from "react";
import { Check, Undo2, EllipsisVertical, Trash2, Cog } from "lucide-react";

const Card = ({
  title,
  description,
  priority,
  isCompleted,
  category,
  dueDate,
}) => {
  const [isChecked, setIsChecked] = useState(isCompleted);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-500 bg-white shadow-md rounded-lg p-4 flex flex-col gap-2 my-2 mx-6">
      <div className="flex items-center justify-between mb-2">
        <div className="bg-blue-300 rounded-2xl py-1 px-2 text-sm">
          {category}
        </div>
        <div className="relative flex items-center gap-2">
          <div className="flex items-center justify-end gap-2">
            <div className="text-gray-500">Priority:</div>
            <div
              className={`${
                priority === "High"
                  ? "bg-red-300"
                  : priority === "Medium"
                  ? "bg-yellow-300"
                  : "bg-green-300"
              } rounded-2xl py-1 px-2 text-sm`}
            >
              {priority}
            </div>
          </div>

          <button
            className="flex items-center justify-end"
            onClick={() => setIsOpen(!isOpen)}
          >
            <EllipsisVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-6 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
              <ul className="py-2 text-gray-700 text-sm">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Edit
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-red-500">
                  <Cog className="w-4 h-4 mr-2" />
                  Delete
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="text-lg font-semibold text-gray-800">{title}</div>
      <p className="card-description">{description}</p>
      <div className="flex gap-4 text-center items-center justify-between">
        {/* Left Side (Due Date) */}
        <div className="flex gap-2">
          <div className="text-gray-500">Due Date:</div>
          <div
            className={`${
              new Date(dueDate) < new Date() ? "text-red-400" : ""
            }`}
          >
            {dueDate}
          </div>
        </div>

        {/* Right Side (Button) */}
        <div className="flex justify-end gap-2">
          <button
            className={`${
              isChecked
                ? "bg-amber-400 hover:bg-amber-500"
                : "bg-green-500 hover:bg-green-600"
            } text-white p-2 rounded-full cursor-pointer`}
            onClick={() => setIsChecked(!isChecked)}
          >
            {isChecked ? (
              <Undo2 className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Card;
