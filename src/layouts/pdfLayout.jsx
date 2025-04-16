import React from "react";
import todologo from "../assets/logo-big.png";
import Cookies from "js-cookie";

const PDFLayout = ({ tasks }) => {
  const name = Cookies.get("name");

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center gap-x-1 text-3xl font-semibold font-sans py-2 px-4">
          <img src={todologo} alt="app logo" className="w-8 sm:w-10" />
          TooDoo
        </div>
      </div>
      <div className="flex items-center justify-center text-2xl font-semibold font-sans py-2 px-4">
        <span>{name.split(" ")[0]}</span>
        <div className="">s' Task Export</div>
      </div>
      <div className="flex items-center justify-center text-lg font-light mb-4">
        {new Date().toString()}
      </div>
      <div className="w-full flex items-center justify-center">
        <table className="w-full border-collapse border border-gray-300 mx-20 mb-20">
          <thead>
            <tr className="border border-gray-300">
              <th></th>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No Tasks Avalilable
                </td>
              </tr>
            )}
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border border-gray-300 p-2 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={task.is_complete}
                    readOnly
                    className="appearance-none w-4 h-4 border-2 border-gray-300 rounded-full bg-white checked:bg-green-500 checked:border-green-400"
                  />
                </td>
                <td className="border border-gray-300 text-wrap pl-2">
                  {task.title}
                </td>
                <td className="border border-gray-300 text-wrap  pl-2">
                  {task.task}
                </td>
                <td className="border border-gray-300 pl-2">{task.due_date}</td>
                <td className="border border-gray-300 pl-2">{task.priority}</td>
                <td className="border border-gray-300 pl-2">
                  {task.is_complete ? "Completed" : "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PDFLayout;
