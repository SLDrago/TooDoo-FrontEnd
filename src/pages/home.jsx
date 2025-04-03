import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus,
  Search,
  Download,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";
import Card from "../components/card";
import TaskModal from "../components/taskModel";
import Header from "../components/header";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CSVLink } from "react-csv";
import { decrypt } from "../utils/cryptoUtils";

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todo");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const token = Cookies.get("token");
  const navigate = useNavigate();

  const csvLinkRef = useRef(null);

  const handleCSVExport = () => {
    if (csvLinkRef.current) {
      csvLinkRef.current.link.click();
    }
  };

  const handlePDFExport = () => {
    // Implement PDF export logic here
  };

  const loadCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/get-categories`, {
        headers: {
          Authorization: `Bearer ${decrypt(token)}`,
        },
      });
      setCategories(response.data);
      localStorage.setItem("categories", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [token]);

  const loadTasks = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/get-tasks`, {
        headers: {
          Authorization: `Bearer ${decrypt(token)}`,
        },
      });
      setTasks(response.data);
      setFilteredTasks(response.data); // Initialize filtered tasks
      localStorage.setItem("tasks", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [token]);

  const filterTasks = useCallback(() => {
    let filtered = [...tasks];

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (task) => task.category_id === parseInt(categoryFilter)
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.task.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, priorityFilter, categoryFilter, searchQuery]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    loadCategories();
    loadTasks();
  }, [token, navigate, loadCategories, loadTasks]);

  useEffect(() => {
    filterTasks();
  }, [tasks, priorityFilter, categoryFilter, searchQuery, filterTasks]);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  const handleTaskChange = (updatedTasks) => {
    setTasks(updatedTasks); // Update the state
  };

  return (
    <>
      <div className="h-screen bg-zinc-50">
        <Header />
        <div className="justify-between flex mx-6 my-4">
          <div className="text-2xl font-bold font-sans flex items-center text-center">
            To Do List
          </div>

          <div className="hidden sm:flex p-2 gap-3 justify-end items-center">
            <button
              className="flex items-center gap-2 py-1 px-3 bg-gray-800 hover:bg-gray-950 text-white rounded-lg sm:text-sm h-9 cursor-pointer"
              onClick={handleCSVExport}
            >
              <FileSpreadsheet className="w-5 h-5" />
              Export CSV
            </button>
            <button
              className="flex items-center gap-2 py-1 px-3 bg-gray-800 hover:bg-gray-950 text-white rounded-lg sm:text-sm h-9 cursor-pointer"
              onClick={handlePDFExport}
            >
              <Download className="w-5 h-5" />
              Export PDF
            </button>
          </div>
          <CSVLink
            data={tasks}
            filename={"todo_tasks.csv"}
            className="hidden"
            target="_blank"
            ref={csvLinkRef}
          ></CSVLink>
        </div>
        <div className="bg-white py-4 rounded-lg shadow-md mx-5 my-4">
          <div className="flex items-center justify-between px-6 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <button
                className={`text-lg p-2 cursor-pointer ${
                  activeTab === "todo"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("todo")}
              >
                To Do{" "}
                <span
                  className={`${
                    activeTab === "todo" ? "bg-blue-600" : "bg-gray-500"
                  } text-white text-sm px-2 py-1 rounded-lg`}
                >
                  {
                    filteredTasks.filter((task) => task.is_complete === 0)
                      .length
                  }
                </span>
              </button>
              <button
                className={`text-lg p-2 cursor-pointer ${
                  activeTab === "completed"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("completed")}
              >
                Completed{" "}
                <span
                  className={`${
                    activeTab === "completed" ? "bg-blue-600" : "bg-gray-500"
                  } text-white text-sm px-2 py-1 rounded-lg`}
                >
                  {
                    filteredTasks.filter((task) => task.is_complete === 1)
                      .length
                  }
                </span>
              </button>
            </div>
            <button
              className="flex items-center gap-2 py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md sm:text-sm h-9 cursor-pointer"
              onClick={() => setIsModelOpen(true)}
            >
              <Plus className="w-6 h-6 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
          <TaskModal
            isOpen={isModelOpen}
            onClose={() => setIsModelOpen(false)}
            onTaskChange={handleTaskChange}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center px-6 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto sm:gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <span className="text-gray-500 text-sm sm:mb-0 mb-1">
                    Category:
                  </span>
                  <select
                    className="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none w-full sm:w-auto"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <span className="text-gray-500 text-sm sm:mb-0 mb-1">
                    Priority:
                  </span>
                  <select
                    className="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none w-full sm:w-auto"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="relative w-full md:w-auto flex justify-center md:justify-end">
              <input
                type="text"
                placeholder="Search..."
                className="w-full md:w-64 border border-gray-300 p-2 pr-10 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute inset-y-0 right-3 my-auto w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
        {activeTab === "todo" ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {filteredTasks
              .filter((task) => task.is_complete === 0)
              .map((task) => (
                <Card
                  key={task.id}
                  title={task.title}
                  description={task.task}
                  priority={task.priority}
                  isCompleted={task.is_complete === 1}
                  category={
                    categories.find((cat) => cat.id === task.category_id)
                      ?.name || "Unknown"
                  }
                  dueDate={task.due_date || "Not Set"}
                />
              ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {filteredTasks
              .filter((task) => task.is_complete === 1)
              .map((task) => (
                <Card
                  key={task.id}
                  title={task.title}
                  description={task.task}
                  priority={task.priority}
                  isCompleted={task.is_complete === 1}
                  category={
                    categories.find((cat) => cat.id === task.category_id)
                      ?.name || "Unknown"
                  }
                  dueDate={task.due_date || "Not Set"}
                />
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
