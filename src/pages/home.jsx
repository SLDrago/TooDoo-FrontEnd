import React, { useState } from "react";
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

const Home = () => {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todo");

  return (
    <>
      <div className="h-screen bg-zinc-50">
        <Header />
        <div className="justify-between flex mx-6 my-4">
          <div className="text-2xl font-bold font-sans flex items-center text-center">
            To Do List
          </div>

          <div className="hidden sm:flex p-2 gap-3 justify-end items-center">
            <button className="flex items-center gap-2 py-1 px-3 bg-gray-800 hover:bg-gray-950 text-white rounded-lg sm:text-sm h-9 cursor-pointer">
              <FileSpreadsheet className="w-5 h-5" />
              Export CSV
            </button>
            {"|"}
            <button className="flex items-center gap-2 py-1 px-3 bg-gray-800 hover:bg-gray-950 text-white rounded-lg sm:text-sm h-9 cursor-pointer">
              <Download className="w-5 h-5" />
              Export PDF
            </button>
          </div>
          <div className="sm:hidden flex">
            <button
              className="flex items-center gap-2 py-1 px-3 bg-gray-800 hover:bg-gray-950 text-white rounded-lg sm:text-sm h-9 cursor-pointer"
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
            >
              <ChevronDown className="w-5 h-5" /> Export
            </button>
          </div>
          {exportMenuOpen && (
            <div className="absolute right-5 mt-10 bg-white shadow-md rounded-md p-2 w-32">
              <button className="flex w-full items-center gap-2 p-2 hover:bg-gray-100">
                <FileSpreadsheet className="w-5 h-5" /> CSV
              </button>
              <button className="flex w-full items-center gap-2 p-2 hover:bg-gray-100">
                <Download className="w-5 h-5" /> PDF
              </button>
            </div>
          )}
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
                  108
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
                  3
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
          />

          <div className="flex flex-col sm:flex-row justify-between items-center px-6 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto sm:gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <span className="text-gray-500 text-sm sm:mb-0 mb-1">
                    Category:
                  </span>
                  <select className="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none w-full sm:w-auto">
                    <option value="all">All</option>
                    <option value="work">Work</option>
                    <option value="home">Home</option>
                    <option value="school">School</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                  <span className="text-gray-500 text-sm sm:mb-0 mb-1">
                    Priority:
                  </span>
                  <select className="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none w-full sm:w-auto">
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
              />
              <Search className="absolute inset-y-0 right-3 my-auto w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
        {activeTab === "todo" ? (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card
              title={"Task 1"}
              description="Complete the project Archive"
              priority="High"
              isCompleted={false}
              category={"👜 Work"}
              dueDate={"2023-10-15"}
            />
            <Card
              title={"Task 2"}
              description="Run 1000m in 5 days"
              priority="Low"
              isCompleted={false}
              category={"🏃 Excersise"}
              dueDate={"2025-04-07"}
            />
            <Card
              title={"Task 2"}
              description="Run 1000m in 5 days"
              priority="Low"
              isCompleted={false}
              category={"🏃 Excersise"}
              dueDate={"2025-04-07"}
            />
            <Card
              title={"Task 2"}
              description="Run 1000m in 5 days"
              priority="Low"
              isCompleted={false}
              category={"🏃 Excersise"}
              dueDate={"2025-04-07"}
            />
            <Card
              title={"Task 2"}
              description="Run 1000m in 5 days"
              priority="Low"
              isCompleted={false}
              category={"🏃 Excersise"}
              dueDate={"2025-04-07"}
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card
              title={"Task 0"}
              description="Get Vegitables from Keels"
              priority="Medium"
              isCompleted={true}
              category={"🏡 Home"}
              dueDate={"Not Set"}
            />
            <Card
              title={"Task 0"}
              description="Get Vegitables from Keels"
              priority="Medium"
              isCompleted={true}
              category={"🏡 Home"}
              dueDate={"Not Set"}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
