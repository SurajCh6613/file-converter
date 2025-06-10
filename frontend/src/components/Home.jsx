import React, { useState } from "react";
import { FaFileWord } from "react-icons/fa";

import axios from "axios";
const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [downloadError, setDownloadError] = useState("");

  const handleOnChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await axios.post(
        "http://localhost:3000/convertfile",
        formData,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf"
      );
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setSelectedFile(null);
      setMessage("File Converted Successfully");
    } catch (error) {
      console.log(error);
      setDownloadError("Download Error",error);
      setMessage("");
    }
  };
  return (
    <>
      <div className="max-w-screen-2xl mx-auto container py-3 px-6 md:px-40">
        <div className="flex flex-col h-screen items-center justify-center">
          <div className="border-2 border-dashed px-4 py-2 md:px-8 md:py-6 border-indigo-400 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-4">
              Convert Word to PDF Online
            </h1>
            <p className="text-sm mb-5 text-center">
              Easily convert Word documents to PDF Online, without having to
              install any software
            </p>

            <div className="flex flex-col items-center space-y-4">
              <input
                type="file"
                onChange={handleOnChange}
                accept=".doc,.docx"
                className="hidden"
                id="FileInput"
              />
              <label
                htmlFor="FileInput"
                className="w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 shadow-lg rounded-lg cursor-pointer border-blue-300 hover:bg-blue-700 hover:text-white"
              >
                <FaFileWord className="text-3xl" />{" "}
                <span className="text-3xl ml-2 uppercase ">
                  {selectedFile ? selectedFile.name : "Choose File"}
                </span>
              </label>
              <button
                onClick={handleSubmit}
                disabled={!selectedFile}
                className="text-white bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 disabled:pointer-events-none cursor-pointer duration-300 font-bold px-4 py-2 rounded-lg"
              >
                Convert File
              </button>
              {message && (<div className="text-green-600 text-center">{message}</div>)}
              {downloadError && (<div className="text-red-500 text-center">{downloadError}</div>)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
