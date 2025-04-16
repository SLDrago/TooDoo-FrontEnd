import { useState, useEffect, useRef } from "react";
import {
  CheckCheck,
  Undo2,
  EllipsisVertical,
  Trash2,
  Cog,
  Paperclip,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { decrypt } from "../utils/cryptoUtils";
import TaskModal from "./taskModel";
import Cookies from "js-cookie";
import DeleteConfirmation from "./deleteConfirmation";
import MarkAsConfirmation from "./markAsConfirmation";

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
  const cardMenuRef = useRef(null);
  const [isMarkAsCompleteOpen, setIsMarkAsCompleteOpen] = useState(false);

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

  useEffect(() => {
    const handler = (e) => {
      if (!cardMenuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <div className="border border-gray-300 bg-white shadow-md rounded-lg p-4 flex flex-col gap-2 my-2 mx-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 text-xs sm:text-sm italic">
          <div className="text-gray-500">Due Date:</div>
          <div
            className={`${
              new Date(dueDate).setHours(0, 0, 0, 0) <
              new Date().setHours(0, 0, 0, 0)
                ? "text-red-400"
                : "text-gray-500"
            }`}
          >
            {dueDate}
          </div>
        </div>
        <div className="relative flex items-center gap-2">
          <div className="flex items-center justify-end gap-2 text-xs sm:text-sm">
            <div className="text-gray-500">Priority:</div>
            <div
              className={`${
                priority === "high"
                  ? "bg-blue-400"
                  : priority === "medium"
                  ? "bg-blue-300"
                  : "bg-blue-200"
              } rounded-2xl px-2 sm:py-1 sm:px-2 text-xs capitalize`}
            >
              {priority}
            </div>
          </div>
          <div ref={cardMenuRef}>
            <button
              className="flex items-center justify-end"
              onClick={() => setIsOpen(!isOpen)}
            >
              <EllipsisVertical className="sm:w-5 w-4 sm:h-5 h4 text-gray-500 cursor-pointer" />
            </button>

            {isOpen && (
              <div className="absolute right-0 top-6 mt-2 w-30 sm:w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-10">
                <ul className="py-2 text-gray-700 text-xs sm:text-sm">
                  <li
                    className="sm:px-4 px-2 sm:py-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
                    onClick={handleEditTask}
                  >
                    <Trash2 className="sm:w-4 w-3 sm:h-4 h-3 mr-2" />
                    Edit
                  </li>
                  <li
                    className="sm:px-4 px-2 sm:py-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center text-red-500"
                    onClick={() => setIsDeleteModelOpen(true)}
                  >
                    <Cog className="sm:w-4 w-3 sm:h-4 h-3 mr-2" />
                    Delete
                  </li>
                </ul>
              </div>
            )}
          </div>
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
      <div className="sm:text-lg font-semibold text-gray-800 truncate">
        {title}
      </div>
      <p className="text-wrap text-sm sm:text mb-1">{description}</p>
      <div className="border-b border-blue-300 text-xs gap-1 flex items-center cursor-pointer w-fit">
        <Paperclip className="w-3 h-3" />
        hello-world.pdf
      </div>
      <div className="flex gap-4 text-center items-center justify-between">
        <div className="flex items-center justify-center gap-1">
          <div className="bg-blue-50 rounded-2xl py-1 px-2 text-xs">
            {category}
          </div>
        </div>
        {/* Right Side (Button) */}
        <div className="flex justify-endgap-2">
          <button
            className={`${
              isChecked
                ? "border-1 sm:border-2 border-blue-400 hover:bg-blue-500 hover:text-white"
                : "border-1 sm:border-2 border-blue-400 hover:bg-blue-500 hover:text-white"
            } text-blue-400 sm:font-bold text-xs px-2 py-1 rounded-full cursor-pointer items-center flex gap-2 justify-center`}
            onClick={() => setIsMarkAsCompleteOpen(true)}
          >
            {isChecked ? (
              <Undo2 className="w-4 h-4" />
            ) : (
              <CheckCheck className="w-4 h-4" />
            )}
            Mark as {isChecked ? "Incomplete" : "Complete"}
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
      <MarkAsConfirmation
        key={id}
        confirmation={handleToggleComplete}
        isComplete={isChecked}
        isOpen={isMarkAsCompleteOpen}
        onClose={() => setIsMarkAsCompleteOpen(false)}
      />
    </div>
  );
};
export default Card;
