import React from "react";
import Navbar from "../Components/Header";
import CollapsableSidebar from "../Components/CollapsableSidebar";
import DataGovTable from "../Components/DataGovTable";

function DataGov() {
  return (
    <div className="bg-gray-200 dark:bg-gray-900 antialiased min-h-full">
      <Navbar />
      <div className="flex h-screen">
        <CollapsableSidebar className="h-full" />

        <main className="bg-gray-200 dark:bg-gray-900  h-full w-full flex flex-col">
          <div className="flex-grow mt-16 overflow-hidden">
            <DataGovTable />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DataGov;
