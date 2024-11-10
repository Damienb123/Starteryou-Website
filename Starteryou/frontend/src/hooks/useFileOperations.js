/**
 * @module useFileOperations
 * @description A custom React hook for managing file operations including fetching and updating files
 */

import {useState, useCallback} from "react";
import {API_CONFIG} from "@config/api";

/**
 * @typedef {Object} FileOperationsReturn
 * @property {string|null} uploadedFile - URL of the currently uploaded file
 * @property {function(): Promise<void>} fetchUploadedFile - Function to fetch the file
 * @property {function(Event): Promise<void>} handleFileChange - Function to handle file uploads
 */

/**
 * Custom hook for managing file operations with the backend API
 * 
 * @param {string} title - Title identifier for the file being managed
 * @returns {FileOperationsReturn} Object containing file state and operations
 * 
 * @example
 * function MyComponent() {
 *   const { uploadedFile, fetchUploadedFile, handleFileChange } = useFileOperations("example-file");
 *
 *   useEffect(() => {
 *     fetchUploadedFile();
 *   }, []);
 *
 *   return (
 *     <div>
 *       {uploadedFile && <img src={uploadedFile} alt="Uploaded file" />}
 *       <input type="file" onChange={handleFileChange} />
 *     </div>
 *   );
 * }
 */
export const useFileOperations = (title) => {
  /**
   * State for storing the URL of the uploaded file
   * @type {string|null}
   */
  const [uploadedFile, setUploadedFile] = useState(null);

  /**
   * Fetches the file from the backend using the provided title
   * Creates a local URL for the fetched blob
   * 
   * @function
   * @async
   * @returns {Promise<void>}
   */
  const fetchUploadedFile = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileByTitle(title)}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setUploadedFile(url);
    } catch (error) {
      console.error("Error fetching uploaded file:", error);
    }
  }, [title]);

  /**
   * Handles file upload events and updates the file on the backend
   * Updates local state with the new file URL on success
   * 
   * @function
   * @async
   * @param {Event} event - The file input change event
   * @returns {Promise<void>}
   */
  const handleFileChange = useCallback(
    async (event) => {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);

      try {
        const response = await fetch(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.fileUpdate}`,
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
      } catch (error) {
        console.error("Error updating image:", error);
      }
    },
    [title]
  );

  return {uploadedFile, fetchUploadedFile, handleFileChange};
};

/**
 * @typedef {Object} UploadResponse
 * @property {string} message - Response message from the server
 * @property {string} url - URL of the uploaded file
 */

/**
 * @typedef {Object} FileError
 * @property {string} message - Error message
 * @property {number} status - HTTP status code
 */