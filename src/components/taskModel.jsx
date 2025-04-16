import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { decrypt } from "../utils/cryptoUtils";
import ValidateError from "./validateError";

const apiUrl = import.meta.env.VITE_API_URL;

const TaskModal = ({ isOpen, onClose, taskId, onTaskChange }) => {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];

  const initialTaskData = {
    id: null,
    title: "",
    task: "",
    category_id: "",
    is_complete: false,
    priority: "low",
    due_date: "",
  };

  const [taskData, setTaskData] = useState(initialTaskData);
  const [titleError, setTitleError] = useState("");
  const [taskError, setTaskError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/show-task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${decrypt(Cookies.get("token"))}`,
          },
        });
        return response.data.task;
      } catch (error) {
        console.error("Error fetching task!", error);
        return null;
      }
    };

    const loadTask = async () => {
      if (taskId) {
        const task = await fetchTask();
        if (task) {
          setTaskData({
            id: task.id,
            title: task.title,
            task: task.task,
            category_id: task.category_id,
            is_complete: task.is_complete,
            priority: task.priority,
            due_date: task.due_date,
          });
        } else {
          setTaskData(initialTaskData);
        }
      } else {
        setTaskData(initialTaskData);
      }
    };

    loadTask();
  }, [taskId, isOpen]);

  const handleClose = () => {
    setTaskData(initialTaskData);
    onClose();
  };

  const handleSave = async () => {
    try {
      if (!taskData.title || !taskData.task || !taskData.category_id) {
        toast.error("Please fill in all required fields.");
        return;
      }
      if (titleError || taskError) {
        toast.error("Please fix the errors before saving.");
        return;
      }

      await toast.promise(
        axios.post(`${apiUrl}/api/store-task`, taskData, {
          headers: {
            Authorization: `Bearer ${decrypt(Cookies.get("token"))}`,
          },
        }),
        {
          pending: "Saving task...",
          success: "Task saved successfully!",
          error: "Something went wrong!",
        }
      );

      if (onTaskChange) {
        onTaskChange();
      }

      handleClose();
    } catch (error) {
      console.error("Error saving task!", error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!taskData.title || !taskData.task || !taskData.category_id) {
        toast.error("Please fill in all required fields.");
        return;
      }

      await toast.promise(
        axios.post(`${apiUrl}/api/update-task`, taskData, {
          headers: {
            Authorization: `Bearer ${decrypt(Cookies.get("token"))}`,
          },
        }),
        {
          pending: "Updating task...",
          success: "Task updated successfully!",
          error: "Something went wrong!",
        }
      );

      if (onTaskChange) {
        onTaskChange();
      }

      handleClose();
    } catch (error) {
      console.error("Error updating task!", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10 px-2">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 sm:w-2/5">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {taskId ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full cursor-pointer hover:shadow-sm"
          >
            <X className="w-6 h-6 text-red-500" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm">Task Title:</label>
          <input
            type="text"
            value={taskData.title}
            onChange={(e) => {
              setTaskData({ ...taskData, title: e.target.value });
              setTitleError(
                e.target.value.length > 30
                  ? "Recomended text limit is exceeded.."
                  : ""
              );
            }}
            className="w-full border-gray-300 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter task title (Max 30 characters)"
            maxLength={30}
          />
          {titleError && <ValidateError error={titleError} />}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm">Task:</label>
          <textarea
            value={taskData.task}
            onChange={(e) => {
              setTaskData({ ...taskData, task: e.target.value });
              setTaskError(
                e.target.value.length > 100
                  ? "Recomended text limit is exceeded.."
                  : ""
              );
            }}
            className="w-full border-gray-300 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            rows="4"
            placeholder="Enter task description (Max 100 characters)"
            maxLength={100}
          ></textarea>
          {taskError && <ValidateError error={taskError} />}
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm">Category:</label>
          <select
            value={taskData.category_id}
            onChange={(e) =>
              setTaskData({ ...taskData, category_id: e.target.value })
            }
            className="w-full border-gray-300 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm">Priority:</label>
          <select
            value={taskData.priority}
            onChange={(e) =>
              setTaskData({ ...taskData, priority: e.target.value })
            }
            className="w-full border-gray-300 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm">Set Due Date:</label>
          <input
            type="date"
            value={taskData.due_date}
            onChange={(e) =>
              setTaskData({ ...taskData, due_date: e.target.value })
            }
            className="w-full border-gray-300 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <button
          onClick={taskId ? handleUpdate : handleSave}
          className="w-full bg-blue-400 text-white font-bold p-2 rounded-lg hover:bg-blue-500"
        >
          {taskId ? "Update Task" : "Add Task"}
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
