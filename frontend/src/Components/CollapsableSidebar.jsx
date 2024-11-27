import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Sidebar } from "flowbite-react";
import { HiUser } from "react-icons/hi";
import {
  AlertCircle,
  AlertTriangle,
  Handshake,
  Receipt,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  BarChart2Icon,
  HouseIcon,
  Users2Icon,
  NotebookPenIcon,
  BookUserIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";

function CollapsableSidebar() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const dropdownOptions = {
    leads: [
      {
        label: "Assignments",
        action: () => console.log("Navigate to Assignments"),
      },
      {
        label: "Appointments",
        action: () => console.log("Navigate to Appointments"),
      },
      { label: "Task 3", action: () => console.log("Navigate to Task 3") },
    ],
    counsellors: [
      {
        label: "Assignments",
        action: () => console.log("Navigate to Assignments"),
      },
      { label: "Add New", action: () => console.log("Navigate to Add New") },
    ],
    colleges: [
      {
        label: "Add College",
        action: () => console.log("Navigate to Add College"),
      },
      {
        label: "Manage Colleges",
        action: () => console.log("Navigate to Manage Colleges"),
      },
      { label: "Reports", action: () => console.log("Navigate to Reports") },
    ],
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsOpen(screenWidth > 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key)); // Toggle dropdown
  };

  const isActive = (path) => location.pathname === path;
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <motion.div animate={{ width: isOpen ? 220 : 60 }} className="h-full mt-4">
      <Sidebar aria-label="Sidebar">
        <div className="h-full flex flex-col justify-between ">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                onClick={() => navigate("/admin/dashboard")}
                className={`transition-colors duration-300 flex items-center ${
                  isOpen ? "justify-start" : "justify-center"
                } hover:bg-primary-700 ${
                  isActive("/admin/dashboard") ? "bg-primary-500" : ""
                } ${isOpen ? "max-w-[200px] h-12" : "max-w-[40px] h-12"}`}
              >
                {isOpen ? (
                  <span className="flex flex-row items-center justify-start gap-2">
                    <BarChart2Icon className="w-5 h-5" />
                    <span>dashboard</span>
                  </span>
                ) : (
                  <span className="flex justify-center items-center w-full">
                    <BarChart2Icon className="w-5 h-5" />
                  </span>
                )}
              </Sidebar.Item>
            </Sidebar.ItemGroup>

            <Sidebar.ItemGroup>
              <Sidebar.Item
                onClick={() => navigate("/datagov")}
                className={`transition-colors duration-300 flex items-center ${
                  isOpen ? "justify-start" : "justify-center"
                } hover:bg-primary-700 ${
                  isActive("/admin/leads") ? "bg-primary-500" : ""
                } ${isOpen ? "max-w-[200px] h-12" : "max-w-[40px] h-12"}`}
              >
                {isOpen ? (
                  <span className="flex flex-row items-center justify-start gap-2">
                    <NotebookPenIcon className="w-5 h-5" />
                    <span>Data Governance</span>
                  </span>
                ) : (
                  <span className="flex justify-center items-center w-full">
                    <NotebookPenIcon className="w-5 h-5" />
                  </span>
                )}
              </Sidebar.Item>

              <Sidebar.Item
                onClick={() => navigate("/admin/students")}
                className={`transition-colors duration-300 flex items-center ${
                  isOpen ? "justify-start" : "justify-center"
                } hover:bg-primary-700 ${
                  isActive("/admin/students") ? "bg-primary-500" : ""
                } ${isOpen ? "max-w-[200px] h-12" : "max-w-[40px] h-12"}`}
              >
                {isOpen ? (
                  <span className="flex flex-row items-center justify-start gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Data Arch & Platform</span>
                  </span>
                ) : (
                  <span className="flex justify-center items-center w-full">
                    <AlertCircle className="w-5 h-5" />
                  </span>
                )}
              </Sidebar.Item>

              <Sidebar.Item
                onClick={() => navigate("/admin/teams")}
                className={`transition-colors duration-300 flex items-center ${
                  isOpen ? "justify-start" : "justify-center"
                } hover:bg-primary-700 ${
                  isActive("/admin/teams") ? "bg-primary-500" : ""
                } ${isOpen ? "max-w-[200px] h-12" : "max-w-[40px] h-12"}`}
              >
                {isOpen ? (
                  <span className="flex flex-row items-center justify-start gap-2">
                    <BookUserIcon className="w-5 h-5" />
                    <span>Data Quality</span>
                  </span>
                ) : (
                  <span className="flex justify-center items-center w-full">
                    <BookUserIcon className="w-5 h-5" />
                  </span>
                )}
              </Sidebar.Item>

              <Sidebar.Item
                onClick={() => navigate("/admin/onboarding")}
                className={`transition-colors duration-300 flex items-center ${
                  isOpen ? "justify-start" : "justify-center"
                } hover:bg-primary-700 ${
                  isActive("/customers") ? "bg-primary-500" : ""
                } ${isOpen ? "max-w-[200px] h-12" : "max-w-[40px] h-12"}`}
              >
                {isOpen ? (
                  <span className="flex flex-row items-center justify-start gap-2">
                    <HiUser className="w-5 h-5" />
                    <span>Meta Data Mgmt</span>
                  </span>
                ) : (
                  <span className="flex justify-center items-center w-full">
                    <HiUser className="w-5 h-5" />
                  </span>
                )}
              </Sidebar.Item>
            </Sidebar.ItemGroup>

            <Sidebar.ItemGroup>
              <Sidebar.Item
                onClick={() => navigate("/upcomingDeliveries")}
                className={`transition-colors duration-300 flex items-center ${
                  isOpen ? "justify-start" : "justify-center"
                } hover:bg-primary-700 ${
                  isActive("/upcomingDeliveries") ? "bg-primary-500" : ""
                } ${isOpen ? "max-w-[200px] h-12" : "max-w-[40px] h-12"}`}
              >
                {isOpen ? (
                  <span className="flex flex-row items-center justify-start gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Data Security</span>
                  </span>
                ) : (
                  <span className="flex justify-center items-center w-full">
                    <AlertTriangle className="w-5 h-5" />
                  </span>
                )}
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>

          <div className="p-2 mt-4 flex items-center">
            <img
              src="https://th.bing.com/th/id/OIP.lkVN1WDlcV2jQCq-9LT7-wHaIJ?rs=1&pid=ImgDetMain"
              className="mr-3 w-8 h-8 rounded-full"
              alt="User avatar"
            />
            {isOpen && (
              <div className="text-left flex flex-col">
                <div className="font-semibold leading-none text-gray-900 dark:text-white mb-0.5">
                  User
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Admin
                </div>
              </div>
            )}
          </div>
        </div>
      </Sidebar>
    </motion.div>
  );
}

export default CollapsableSidebar;

// <aside
// id="sidebar-team-switch"
// className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
// aria-label="Sidebar"
// >
// <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
//   {/* My Tasks Button */}
//   <button
//     id="dropdownCompanyNameButton"
//     data-dropdown-toggle="dropdownCompanyName"
//     className="flex justify-between items-center p-2 w-full rounded-lg dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-50 dark:hover-bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
//     type="button"
//   >
//     <span className="sr-only">Open user menu</span>
//     <div className="flex items-center">
//       <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-7" alt="Flowbite Logo" />
//       <div>
//         <div className="font-semibold leading-none text-gray-900 dark:text-white mb-0.5">Flowbite</div>
//         <div className="text-sm text-gray-500 dark:text-gray-400">Team plan</div>
//       </div>
//     </div>
//     <svg
//       className="w-5 h-5 text-gray-500 dark:text-gray-400"
//       fill="currentColor"
//       viewBox="0 0 20 20"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         fillRule="evenodd"
//         d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
//         clipRule="evenodd"
//       ></path>
//     </svg>
//   </button>

//   <ul className="mt-5 space-y-2">
//     {['leads', 'counsellors', 'colleges'].map((key) => (
//       <div key={key} className="mb-5">
//         <button
//           type="button"
//           onClick={() => toggleDropdown(key)}
//           className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
//         >
//           <span className="flex-1 ml-3 text-left capitalize">{key}</span>
//           <svg
//             className={`w-5 h-5 transition-transform ${openDropdown === key ? 'rotate-180' : ''}`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//           </svg>
//         </button>
//         {/* Dropdown Options */}
//         {openDropdown === key && (
//           <div className="pl-6 mt-2 space-y-2">
//             {dropdownOptions[key].map((option, index) => (
//               <button
//                 key={index}
//                 onClick={option.action}
//                 className="block text-left w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-200"
//               >
//                 {option.label}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     ))}
//   </ul>
// </div>

// <div className="absolute bottom-0 left-0 justify-center p-4 w-full bg-white dark:bg-gray-800 z-20">
//   <div className="pb-4 pl-2 mb-4 space-y-2 border-b border-gray-200 dark:border-gray-700"></div>
//   <button
//     id="dropdownUserNameButton"
//     data-dropdown-toggle="dropdownUserName"
//     className="flex justify-between items-center p-2 my-4 w-full rounded-lg dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-50 dark:hover-bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
//     type="button"
//   >
//     <span className="sr-only">Open user menu</span>
//     <div className="flex items-center">
//       <img
//         src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
//         className="mr-3 w-8 h-8 rounded-full"
//         alt="Bonnie avatar"
//       />
//       <div className="text-left">
//         <div className="font-semibold leading-none text-gray-900 dark:text-white mb-0.5">Bonnie Green</div>
//         <div className="text-sm text-gray-500 dark:text-gray-400">name@flowbite.com</div>
//       </div>
//     </div>
//     <svg
//       className="w-5 h-5 text-gray-500 dark:text-gray-400"
//       fill="currentColor"
//       viewBox="0 0 20 20"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         fillRule="evenodd"
//         d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
//         clipRule="evenodd"
//       ></path>
//     </svg>
//   </button>
// </div>
// {/* Dropdown Content */}
// </aside>
