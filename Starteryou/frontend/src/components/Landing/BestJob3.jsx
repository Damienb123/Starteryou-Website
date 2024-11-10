/**
 * @module BestJob3
 * @description A React component for displaying promotional content with 
 * image upload functionality and error handling
 */

import {useState, useEffect} from "react";
import FileUpload from "../Common/FileUpload";
import {useNavigation} from "../../context/NavigationContext";
import {API_CONFIG} from "@config/api";

/**
 * @typedef {Object} BestJob3State
 * @property {string|null} uploadedFile - URL of the uploaded file
 * @property {string|null} error - Error message if any
 * @property {boolean} hasFetchedOnce - Track if file has been fetched
 */

/**
 * @typedef {Object} FeatureBox
 * @property {number} id - Unique identifier
 * @property {string} iconSrc - Path to icon image
 * @property {string} title - Feature title
 * @property {string} description - Feature description
 */

const BestJob3 = () => {
  const { isAdmin } = useNavigation();

  /**
   * Uploaded file URL state
   * @type {string|null}
   */
  const [uploadedFile, setUploadedFile] = useState(null);

  /**
   * Title identifier for file operations
   * @type {string}
   */
  const title = "starteryou-v2";

  /**
   * Error message state
   * @type {string|null}
   */
  const [error, setError] = useState(null);

  /**
   * Fetch tracking state
   * @type {boolean}
   */
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  /**
   * Fetches file from the server
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const fetchUploadedFile = async () => {
    if (hasFetchedOnce) return;

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileDownload(title)}`
      );
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setUploadedFile(url);
      setError(null);
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
      setError("Failed to load image");
    } finally {
      setHasFetchedOnce(true);
    }
  };

  // Initialize file on component mount
  useEffect(() => {
    fetchUploadedFile();
  }, []);

  /**
   * Handles file upload
   * @async
   * @function
   * @param {Event} event - File input change event
   * @returns {Promise<void>}
   */
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate(title)}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Image updated successfully:", data);
      setUploadedFile(URL.createObjectURL(file));
      setError(null);
    } catch (error) {
      console.error("Error updating image:", error);
      setError("Error updating image");
    }
  };

  /**
   * Feature box configuration
   * @type {FeatureBox}
   */
  const box = {
    id: 0,
    iconSrc: "/LandingPage/Icons/pen.png",
    title: "Lorem Ipsum",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  };

  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-12 md:mb-10">
      <div className="flex flex-col lg:flex-row items-center justify-between lg:space-x-8">
        {/* Left Section - Content */}
        <div className="md:w-full lg:w-1/2 w-full md:text-center lg:text-left mb-8 lg:mb-0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 leading-tight">
            Rohit ipsum dolor sit amet consectetur adipiscing.
          </h2>
          <p className="text-gray-600 mb-2 md:text-lg font-light">
            Let us handle the grunt work so you can do the fun stuff.
          </p>
          <a href="#" className="text-[#7950F2] hover:underline font-medium">
            Request for demo &gt;
          </a>

          {/* Feature Box */}
          <div className="mt-8 p-4 rounded-xl shadow-[0px_10.19px_30.57px_10.19px_#1F23290A] md:w-[600px] md:mx-auto lg:h-auto lg:mx-0 lg:max-w-[500px]">
            <div className="flex items-center space-x-4">
              <img src={box.iconSrc} alt={box.title} className="w-8 h-8" />
              <h3 className="text-xl font-bold text-[#7950F2]">{box.title}</h3>
            </div>
            <p className="mt-4 text-[#646A73] text-base font-light text-left">
              {box.description}
            </p>
          </div>
        </div>

        {/* Right Section - Image Display */}
        <div className="relative w-[330px] h-[300px] md:w-[550px] lg:w-[700px] lg:h-[550px] bg-gradient-to-b from-[#8B96E9] to-[#E2EAFF] rounded-xl overflow-hidden">
          {uploadedFile ? (
            <img
              src={uploadedFile}
              alt="Preview"
              className="relative w-[340px] h-[190px] top-[66px] left-[-48px] md:w-[480px] md:h-[200px] md:top-[71px] md:left-[-20px] lg:top-[78px] lg:left-[-70px] lg:w-[680px] lg:h-[400px] rounded-xl"
              style={{transform: "rotate(-10.22deg)"}}
            />
          ) : (
            <img
              src="/LandingPage/Rectangle.png"
              alt="Job Opportunities"
              className="relative w-[340px] h-[190px] top-[66px] left-[-48px] md:w-[480px] md:h-[200px] md:top-[71px] md:left-[-20px] lg:top-[78px] lg:left-[-70px] lg:w-[680px] lg:h-[400px] rounded-xl"
              style={{transform: "rotate(-10.22deg)"}}
            />
          )}
          {/* Admin file upload control */}
          {isAdmin && <FileUpload handleFileChange={handleFileChange} />}
        </div>
      </div>
    </div>
  );
};

export default BestJob3;