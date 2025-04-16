import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus,
  Search,
  Download,
  FileSpreadsheet,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import Card from "../components/card";
import TaskModal from "../components/taskModel";
import Header from "../components/header";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CSVLink } from "react-csv";
import { decrypt } from "../utils/cryptoUtils";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import PDFLayout from "../layouts/pdfLayout";

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todo");
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const token = Cookies.get("token");
  const name = Cookies.get("name").split(" ")[0];
  const navigate = useNavigate();
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [pdfExporting, setPdfExporting] = useState(false);
  const exportMenuRef = useRef(null);
  const [showFilter, setShowFilter] = useState(false);

  const csvLinkRef = useRef(null);

  const handleCSVExport = () => {
    if (csvLinkRef.current) {
      csvLinkRef.current.link.click();
    }
  };

  const handleExportPDF = () => {
    setPdfExporting(true);

    setTimeout(() => {
      const pdf = new jsPDF();
      const input = document.getElementById("task-list");

      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 190;
        const pageHeight = pdf.internal.pageSize.height;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 10;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight + 10;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        const timestamp = new Date()
          .toLocaleString()
          .replace(/[:/]/g, "-")
          .replace(",", "_");
        pdf.save(`${name}'s_TooDoo_Export_${timestamp}.pdf`);
      });

      setPdfExporting(false);
    }, 5);
  };

  const handleTaskChange = () => {
    loadTasks();
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
      setFilteredTasks(response.data);
      // localStorage.setItem("tasks", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [token]);

  const filterTasks = useCallback(() => {
    let filtered = [...tasks];

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (task) => task.category_id === parseInt(categoryFilter)
      );
    }

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
    const handler = (e) => {
      if (!exportMenuRef.current.contains(e.target)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <>
      <div className="h-dvh">
        <Header />
        <div className="justify-between flex mx-6 my-4">
          <div className="text-xl sm:text-2xl font-bold font-sans flex items-center text-center">
            To Do List
          </div>

          <div className="hidden sm:flex p-2 gap-3 justify-end items-center">
            <button
              className="flex items-center gap-2 py-1 px-3 border-2 border-blue-400 text-blue-400 font-bold hover:bg-blue-500 hover:text-white rounded-lg sm:text-sm h-9 cursor-pointer"
              onClick={handleCSVExport}
            >
              <FileSpreadsheet className="w-5 h-5" />
              Export CSV
            </button>

            {"|"}

            <button
              className="flex items-center gap-2 py-1 px-3 border-2 border-blue-400 text-blue-400 font-bold hover:bg-blue-500 hover:text-white rounded-lg sm:text-sm h-9 cursor-pointer"
              onClick={handleExportPDF}
            >
              <Download className="w-5 h-5" />
              Export PDF
            </button>
          </div>

          <div className="sm:hidden flex" ref={exportMenuRef}>
            <button
              className="flex items-center gap-2 px-3 sm:py-1 border border-blue-400 text-blue-400 font-bold hover:bg-blue-500 hover:text-white rounded-lg text-xs sm:text-sm h-9 cursor-pointer"
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
            >
              Export <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {exportMenuOpen && (
              <div className="absolute text-sm right-5 mt-10 bg-white shadow-md rounded-md p-2 w-32">
                <button
                  className="flex w-full items-center gap-2 p-2 hover:bg-gray-100"
                  onClick={handleCSVExport}
                >
                  <FileSpreadsheet className="w-4 h-4" /> CSV
                </button>

                <button
                  className="flex w-full items-center gap-2 p-2 hover:bg-gray-100"
                  onClick={handleExportPDF}
                >
                  <Download className="w-4 h-4" /> PDF
                </button>
              </div>
            )}
          </div>
        </div>
        <CSVLink
          data={tasks}
          filename={`${name}'s_TooDoo_Export_${new Date()
            .toLocaleString()
            .replace(/[:/]/g, "-")
            .replace(",", "_")}.csv`}
          className="hidden"
          target="_blank"
          ref={csvLinkRef}
        ></CSVLink>
        <div>
          <div className="hidden items-center justify-center sm:grid grid-cols-3 gap-3 mx-5">
            <div className="rounded-xl shadow-md mt-4 mb-4 p-4 font-medium text-gray-800 text-xl flex items-center justify-center bg-blue-100 border border-gray-200">
              Pending Tasks:
              <span className="font-bold font-mono text-2xl ml-3">
                {tasks.filter((task) => task.is_complete === 0).length}
              </span>
            </div>
            <div className="rounded-xl shadow-md mt-4 mb-4 p-4 font-medium text-gray-800 text-xl flex items-center justify-center bg-blue-100">
              Completed Tasks:
              <span className="font-bold font-mono text-2xl ml-3">
                {tasks.filter((task) => task.is_complete === 1).length}
              </span>
            </div>
            <div className="rounded-xl shadow-md mt-4 mb-4 p-4 font-medium text-gray-800 text-xl flex items-center justify-center bg-blue-100">
              Overdue Tasks:
              <span className="font-bold font-mono text-2xl ml-3">
                {
                  tasks.filter((task) => {
                    const dueDate = task.due_date
                      ? new Date(task.due_date)
                      : null;
                    return (
                      task.is_complete === 0 &&
                      dueDate &&
                      dueDate.setHours(0, 0, 0, 0) <
                        new Date().setHours(0, 0, 0, 0)
                    );
                  }).length
                }
              </span>
            </div>
          </div>
          <div className="bg-white py-3 sm:py-4 rounded-lg shadow-md mx-5 my-4 border border-gray-200">
            <div
              className={`flex items-center justify-between px-6 gap-4 sm:mb-4 ${
                showFilter ? "mb-3" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <button
                  className={`text-sm sm:text-lg font-bold p-2 cursor-pointer ${
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
                    } text-white text-xs sm:text-sm px-2 py-1 rounded-lg`}
                  >
                    {
                      filteredTasks.filter((task) => task.is_complete === 0)
                        .length
                    }
                  </span>
                </button>
                <button
                  className={`text-sm sm:text-lg font-bold p-2 cursor-pointer ${
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
                    } text-white text-xs sm:text-sm px-2 py-1 rounded-lg`}
                  >
                    {
                      filteredTasks.filter((task) => task.is_complete === 1)
                        .length
                    }
                  </span>
                </button>
              </div>
              <button
                className="hidden sm:flex items-center gap-2 py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md sm:text-sm h-9 cursor-pointer"
                onClick={() => setIsModelOpen(true)}
                data-html2canvas-ignore
              >
                <Plus className="w-6 h-6 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">New Task</span>
              </button>
              <button
                className="sm:hidden p-2 cursor-pointer"
                onClick={() => setShowFilter(!showFilter)}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
            <TaskModal
              isOpen={isModelOpen}
              onClose={() => setIsModelOpen(false)}
              onTaskChange={handleTaskChange}
            />

            <div
              className={`${
                showFilter ? "flex" : "hidden"
              } sm:flex flex-col sm:flex-row justify-between items-center px-6 gap-4`}
            >
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
          <div className="mb-4 min-h-dvh">
            {tasks.length === 0 && (
              <div className="flex items-center justify-center h-full mt-20">
                <div className="text-gray-500 text-xl font-semibold">
                  😩 No tasks available, please add a task.
                </div>
              </div>
            )}
            {activeTab === "todo" ? (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {filteredTasks
                  .filter((task) => task.is_complete === 0)
                  .map((task) => (
                    <Card
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      description={task.task}
                      priority={task.priority}
                      isCompleted={task.is_complete === 1}
                      category={
                        categories.find((cat) => cat.id === task.category_id)
                          ?.name || "Unknown"
                      }
                      dueDate={task.due_date || "Not Set"}
                      onTaskChange={handleTaskChange}
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
                      id={task.id}
                      title={task.title}
                      description={task.task}
                      priority={task.priority}
                      isCompleted={task.is_complete === 1}
                      category={
                        categories.find((cat) => cat.id === task.category_id)
                          ?.name || "Unknown"
                      }
                      dueDate={task.due_date || "Not Set"}
                      onTaskChange={handleTaskChange}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
        <div className="m-5 pb-5 flex justify-center items-center font-light text-gray-600">
          2025 All rights reserved.
        </div>
        <div className={`${pdfExporting ? "" : "hidden"}`}>
          <div id="task-list">
            <PDFLayout tasks={tasks} />
          </div>
        </div>
        <div class="sm:hidden fixed bottom-4 right-4">
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded-full shadow-lg"
            onClick={() => setIsModelOpen(true)}
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
