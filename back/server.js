import cors from "cors";
import express from "express";
import axios from "axios";

const app = express();
app.use(cors());

const api_data = {
  companyName: "Alfaaz",
  clientID: "96011094-f9db-4226-bea4-b501fef1af88",
  ownerName: "Azam",
  ownerEmail: "mohammedazam651@gmail.com",
  rollNo: "21BD5A0504",
  clientSecret: "FCqrhOGVehnNZfAR",
};
let auth_token = "";
async function getToken(api_data) {
  try {
    const response = await axios.post(
      "http://20.244.56.144/train/auth",
      api_data
    );
    const token = response.data.access_token;
    return token;
  } catch (error) {
    console.error("Error generatin token:", error);
    throw error;
  }
}
setInterval(async () => {
  auth_token = await getToken({
    companyName: "Alfaaz",
    clientID: "96011094-f9db-4226-bea4-b501fef1af88",
    ownerName: "Azam",
    ownerEmail: "mohammedazam651@gmail.com",
    rollNo: "21BD5A0504",
    clientSecret: "FCqrhOGVehnNZfAR",
  });
}, 35000);

async function fetchTrains() {
  const AUTH_TOKEN = await getToken(api_data);
  try {
    const headers = {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    };
    const res = await axios.get("http://20.244.56.144/train/trains", {
      headers,
    });
    const trainsData = res.data;
    return trainsData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
function sortingTrains(trains_data) {
  // Custom sorting function
  function customSort(a, b) {
    // Sort by price in ascending order
    const priceComp = a.price.AC - b.price.AC;
    if (priceComp !== 0) {
      return priceComp;
    }

    // If price is the same, sort by seatsAvailable in descending order
    const seatsAvailableComp = b.seatsAvailable.AC - a.seatsAvailable.AC;
    if (seatsAvailableComp !== 0) {
      return seatsAvailableComp;
    }

    // If price and seatsAvailable are the same, sort by departureTime in descending order
    const departureTimeA = a.departureTime.Hours * 60 + a.departureTime.Minutes;
    const departureTimeB = b.departureTime.Hours * 60 + b.departureTime.Minutes;
    return departureTimeB - departureTimeA;
  }

  // Bubble sort implementation
  for (let i = 0; i < trains_data.length - 1; i++) {
    for (let j = 0; j < trains_data.length - i - 1; j++) {
      if (customSort(trains_data[j], trains_data[j + 1]) > 0) {
        // Swap trains_data[j] and trains_data[j + 1]
        const temp = trains_data[j];
        trains_data[j] = trains_data[j + 1];
        trains_data[j + 1] = temp;
      }
    }
  }

  // Filter trains with departureTime.Minutes > 30
  const sortedTrains = [];
  for (const train of trains_data) {
    if (train.departureTime.Minutes > 30) {
      sortedTrains.push(train);
    }
  }

  return sortedTrains;
}
app.get("/", async (req, res) => {
  try {
    const trainsData = await fetchTrains();
    const sortedTrains = sortingTrains(trainsData);
    res.json(sortedTrains);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get("/getTrain/:trainId", async (req, res) => {
  try {
    const train_num = req.params.trainId;
    const AUTH_TKN = await getToken(api_data);

    const headers = {
      Authorization: `Bearer ${AUTH_TKN}`,
    };

    const train_data = await axios.get(
      `http://20.244.56.144/train/trains/${train_num}`,
      { headers }
    );
    res.json(train_data.data);
  } catch (error) {
    console.error("Unable to fetch data", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//
app.listen(8000, () => {
  console.log("Server is running on port http://localhost:8000");
});
