import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Appbar from "@/components/Appbar";

function Details() {
  const [train, setTrain] = useState([]);
  const router = useRouter();
  const { trainNumber } = router.query;

  useEffect(() => {
    if (trainNumber) {
      fetchTrainData();
    }
  }, [trainNumber]);

  const fetchTrainData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/getTrain/${trainNumber}`
      );
      setTrain([response.data]);
      console.log([response.data]);
    } catch (error) {
      console.error("Error fetching train data:", error);
    }
  };

  return (
    <div>
      <Appbar />
      <div className="w-full md:w-4/5 mx-auto text-white my-5">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-500">
              <th className="border-r-2 p-5">Train Number</th>
              <th className="border-r-2 p-5">Train Name</th>
              <th className="border-r-2 p-5">Departure Time</th>
              <th className="border-r-2 p-5" colSpan={2}>
                Seats Available
              </th>
              <th className="border-r-2" colSpan={2}>
                Price
              </th>
              <th className="border-r-2">Delayed By</th>
            </tr>
            <tr className="border-b-2 bg-blue-500">
              <th />
              <th />
              <th />
              <th className="border-l-2 border-r-2">AC</th>
              <th className="border-r-2">Sleeper</th>
              <th className="border-r-2">AC</th>
              <th className="border-r-2">Sleeper</th>
              <th />
            </tr>
          </thead>
          <tbody className="text-black">
            {train.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-blue-500 hover:text-white hover:rounded"
              >
                <td className="border-r-2 p-5" align="center">
                  {row.trainNumber}
                </td>
                <td className="border-r-2 p-5" align="center">
                  <a
                    href={`/${row.trainNumber}`}
                    className="hover:rounded-full hover:bg-white hover:text-black p-5"
                  >
                    {row.trainName}
                  </a>
                </td>
                <td className="border-r-2 p-5" align="center">
                  {`${row.departureTime.Hours}:${row.departureTime.Minutes}:${row.departureTime.Seconds}`}
                </td>
                <td className="border-r-2 p-5" align="center">
                  {row.seatsAvailable.AC}
                </td>
                <td className="border-r-2 p-5" align="center">
                  {row.seatsAvailable.sleeper}
                </td>
                <td className="border-r-2 p-5" align="center">
                  {row.price.AC}
                </td>
                <td className="border-r-2 p-5" align="center">
                  {row.price.sleeper}
                </td>
                <td className="border-r-2 p-5" align="center">
                  {row.delayedBy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Details;
