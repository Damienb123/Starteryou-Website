import { useState, useEffect } from "react";
import axios from "axios";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigation } from "../../context/NavigationContext";

/**
 * HeroAbout component that displays and allows editing of a title and paragraph content.
 * The component is primarily for admins who can edit the content, while others can only view it.
 * It fetches data from the backend on mount, and allows saving updated content.
 *
 * @component
 * @example
 * return (
 *   <HeroAbout />
 * )
 */
const HeroAbout = () => {
  /**
   * State for holding the title of the HeroAbout section.
   * @type {string}
   */
  const [title, setTitle] = useState("xxxxxxxxxxxxxxxxxxx");

  /**
   * State for holding the paragraph content of the HeroAbout section.
   * @type {string}
   */
  const [paragraph, setParagraph] = useState(
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  );

  /**
   * State for determining whether the content is in edit mode.
   * @type {boolean}
   */
  const [isEditing, setIsEditing] = useState(false);

  /**
   * State for error messages in case the fetch or save process fails.
   * @type {string}
   */
  const [error, setError] = useState("");

  /**
   * Admin status from the navigation context.
   * @type {boolean}
   */
  const { isAdmin } = useNavigation();

  /**
   * Fetches data for the HeroAbout component when the component is mounted.
   * Makes a GET request to fetch the content for the HeroAbout section.
   * If data is fetched successfully, it updates the state for title and paragraph.
   * In case of an error, it sets an error message.
   *
   * @async
   * @function
   * @returns {void}
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/text", {
          params: { component: "HeroAbout" },
        });

        if (response.data) {
          setTitle(response.data.content || "Your Hero Title Here");
          setParagraph(
            Array.isArray(response.data.paragraphs)
              ? response.data.paragraphs.join("\n")
              : "Your description paragraph here."
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching content. Please try again later.");
      }
    };

    fetchData();
  }, []);

  /**
   * Toggles the edit mode if the user is an admin.
   * @function
   * @returns {void}
   */
  const handleEdit = () => isAdmin && setIsEditing(true);

  /**
   * Handles changes to the title input field.
   * @function
   * @param {Event} e - The event object for the title input.
   * @returns {void}
   */
  const handleChangeTitle = (e) => setTitle(e.target.value);

  /**
   * Handles changes to the paragraph input field.
   * @function
   * @param {Event} e - The event object for the paragraph input.
   * @returns {void}
   */
  const handleChangeParagraph = (e) => setParagraph(e.target.value);

  /**
   * Saves the updated content to the backend by sending a PUT request.
   * Normalizes the paragraph data to ensure it's always stored as an array.
   * If the save is successful, it exits edit mode; otherwise, it sets an error message.
   *
   * @async
   * @function
   * @returns {void}
   */
  const saveContent = async () => {
    try {
      const normalizedParagraphs = Array.isArray(paragraph)
        ? paragraph
        : [paragraph.trim()];

      await axios.put("http://localhost:3000/api/text", {
        component: "HeroAbout",
        content: title.trim(),
        paragraphs: normalizedParagraphs,
      });

      setError(""); // Clear previous errors
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error saving content:", error.response || error.message);
      setError("Error saving content. Please try again later.");
    }
  };

  return (
    <div
      className="relative w-full lg:h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/AboutPage/Aboutbg.svg)" }}
    >
      <div className="relative z-10 flex justify-center items-center h-full overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:space-x-6 lg:space-x-12 max-w-6xl p-6 lg:p-12 space-y-6 md:space-y-0">
          <div className="w-full md:w-1/2 md:flex justify-center mb-6 md:mb-[-25px] lg:mb-[-144px] hidden">
            <img
              src="/AboutPage/aboutMen.svg"
              alt="Your Image"
              className="w-full h-[400px] md:h-[450px] lg:h-[700px] object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-4 pt-[100px] md:pt-0">
            {isEditing ? (
              <div>
                <textarea
                  value={title}
                  onChange={handleChangeTitle}
                  className="text-3xl lg:text-4xl font-semibold text-white bg-transparent border border-white p-2 rounded resize-none focus:outline-none"
                />
                <textarea
                  value={paragraph}
                  onChange={handleChangeParagraph}
                  className="text-lg lg:text-xl text-gray-300 bg-transparent border border-gray-300 p-2 mt-4 rounded resize-none focus:outline-none"
                />
                <button
                  onClick={saveContent}
                  className="mt-4 bg-green-600 text-white py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl lg:text-5xl font-semibold text-white break-words mb-6">
                  {title}
                </h1>
                <p className="text-lg lg:text-xl text-gray-300">{paragraph}</p>
                {isAdmin && (
                  <FaPencilAlt
                    onClick={handleEdit}
                    style={{ cursor: "pointer", marginTop: "1rem" }}
                    className="text-gray-300 hover:text-white"
                  />
                )}
              </div>
            )}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-6">
              <button className="bg-[#D9502E] text-white py-2 px-6 rounded-lg font-semibold">
                Get Demo
              </button>
              <button className="bg-white text-[#D9502E] py-2 px-6 rounded-lg font-semibold">
                Try for Free
              </button>
            </div>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default HeroAbout;
