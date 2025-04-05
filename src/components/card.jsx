import { useState } from "react";
import { Check, Undo2, EllipsisVertical, Trash2, Cog } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { decrypt } from "../utils/cryptoUtils";
import TaskModal from "./taskModel";
import Cookies from "js-cookie";
import DeleteConfirmation from "./deleteConfirmation";

const apiUrl = import.meta.env.VITE_API_URL;

const Card = ({
  id,
  title,
  description,
  priority,
  isCompleted,
  category,
  dueDate,
  onTaskChange,
}) => {
  const [isChecked, setIsChecked] = useState(isCompleted);
  const [isOpen, setIsOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);

  const token = decrypt(Cookies.get("token"));

  // const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  // const task = id ? tasks.find((task) => task.id === id) : null;

  const handleToggleComplete = async () => {
    try {
      await toast.promise(
        axios.post(
          `${apiUrl}/api/toggle-complete/`,
          { id: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
        {
          pending: "Updating task...",
          success: "Task marked as complete!",
          error: "Failed to update task.",
        }
      );
      setIsChecked(!isChecked);
      if (onTaskChange) {
        onTaskChange();
      }
    } catch (error) {
      console.error("Error updating task!", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await toast.promise(
        axios.delete(`${apiUrl}/api/delete-task/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        {
          pending: "Deleting task...",
          success: "Task deleted successfully!",
          error: "Failed to delete task.",
        }
      );
      // const updatedTasks = tasks.filter((task) => task.id !== id);
      // localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      if (onTaskChange) {
        onTaskChange();
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting task!", error);
    }
  };
  const handleEditTask = () => {
    setIsModelOpen(true);
  };

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
                priority === "high"
                  ? "bg-red-300"
                  : priority === "medium"
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
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  onClick={handleEditTask}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Edit
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-red-500"
                  onClick={() => setIsDeleteModelOpen(true)}
                >
                  <Cog className="w-4 h-4 mr-2" />
                  Delete
                </li>
              </ul>
            </div>
          )}
        </div>
        <TaskModal
          key={id}
          isOpen={isModelOpen}
          onClose={() => {
            setIsModelOpen(false);
            setIsOpen(false);
          }}
          taskId={id}
          onTaskChange={onTaskChange}
        />
      </div>
      <div className="text-lg font-semibold text-gray-800 truncate">
        {title}
      </div>
      <p className="text-wrap">{description}</p>
      <div className="flex gap-4 text-center items-center justify-between">
        <div className="flex gap-2">
          <div className="text-gray-500">Due Date:</div>
          <div
            className={`${
              new Date(dueDate).setHours(0, 0, 0, 0) <
              new Date().setHours(0, 0, 0, 0)
                ? "text-red-400"
                : ""
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
            onClick={() => handleToggleComplete()}
          >
            {isChecked ? (
              <Undo2 className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      <DeleteConfirmation
        key={id}
        isOpen={isDeleteModelOpen}
        onClose={() => {
          setIsDeleteModelOpen(false);
          setIsOpen(false);
        }}
        confirmation={handleDeleteTask}
      />
    </div>
  );
};
export default Card;
