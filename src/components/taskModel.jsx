import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import axios from "axios";

const TaskModal = ({ isOpen, onClose, taskId }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    category: "all",
    priority: "medium",
    description: "",
    dueDate: "",
  });
  const [categories, setCategories] = useState([
    "all",
    "work",
    "home",
    "school",
  ]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const response = await axios.get(`/api/tasks/${taskId}`);
          setTaskData(response.data);
        } catch (error) {
          console.error("Failed to load task!", error);
        }
      };
      fetchTask();
    }
  }, [taskId]);

  const handleSave = async () => {
    try {
      await toast.promise(axios.post("/api/tasks", taskData), {
        pending: "Saving task...",
        success: "Task saved successfully!",
        error: "Something went wrong!",
      });
      onClose();
    } catch (error) {
      console.error("Error saving task!", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await toast.promise(axios.put(`/api/tasks/${taskId}`, taskData), {
        pending: "Updating task...",
        success: "Task updated successfully!",
        error: "Something went wrong!",
      });
      onClose();
    } catch (error) {
      console.error("Error updating task!", error);
    }
  };

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      toast.success("Category added successfully!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10 px-2">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {taskId ? "Edit Task" : "Add New Task"}
          </h2>
          <button
            onClick={onClose}
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
            onChange={(e) =>
              setTaskData({ ...taskData, title: e.target.value })
            }
            className="w-full border-gray-300 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter task title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm">Category:</label>
          <select
            value={taskData.category}
            onChange={(e) =>
              setTaskData({ ...taskData, category: e.target.value })
            }
            className="w-full border-gray-300 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="flex mt-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full border-gray-300 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="New category"
            />
            <button
              onClick={addCategory}
              className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              Add
            </button>
          </div>
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
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm">Task:</label>
          <textarea
            value={taskData.description}
            onChange={(e) =>
              setTaskData({ ...taskData, description: e.target.value })
            }
            className="w-full border-gray-300 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            rows="4"
            placeholder="Enter task description"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm">Set Due Date:</label>
          <input
            type="date"
            value={taskData.dueDate}
            onChange={(e) =>
              setTaskData({ ...taskData, dueDate: e.target.value })
            }
            className="w-full border-gray-300 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <button
          onClick={taskId ? handleUpdate : handleSave}
          className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
        >
          {taskId ? "Update Task" : "Add Task"}
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
