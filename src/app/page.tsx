"use client";

import TableComponent from "@/components/TableComponent";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState();

  useEffect(() => {
    (async () => {
      setData(
        (await axios.get("https://dummyjson.com/users?limit=100")).data.users
      );
    })();
  }, []);

  if (!data) return <h1>Loading...</h1>;

  return (
    <main className="max-w-7xl m-auto space-y-4 py-12">
      <h1 className="font-extrabold text-3xl ">Task Description</h1>

      <p>
        The objective of this task is to evaluate the candidate&apos;s
        proficiency in utilizing React hooks.
      </p>

      <p>
        The task involves implementing several features for a table rendered
        using a custom React component. The table should support dynamic data
        structures, allowing for the rendering of data of any shape passed into
        the component via props. The following features are to be implemented:
      </p>
      <ul className="list-disc list-inside">
        <li>
          Pagination: Enable pagination functionality for the provided data.
          Users should be able to select both the page size and page number,
          with the table updating accordingly. All records to be displayed are
          assumed to be provided, and the pagination logic should be implemented
          on the frontend.
        </li>
        <li>
          Sorting: Enable users to sort the displayed data in either ascending
          or descending order based on a selected column. This functionality
          should be triggered by clicking on the column header.
        </li>
        <li>
          Searching: Allow users to search for a specific term within the table
          data. The search logic can be a simple string match, but users should
          have the ability to select which columns to search against.
        </li>
      </ul>

      <p>
        Candidates will be evaluated based on their understanding of React,
        understanding and usage of react hooks and cleanliness of their code.
      </p>

      <TableComponent data={data} />
    </main>
  );
}
