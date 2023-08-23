import { useState } from "react";
import axios from "axios";
import { Inter } from "next/font/google";
import Appbar from "@/components/Appbar";
import Hero from "@/components/Hero";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8000/").then((res) => {
      setData(res.data);
    });
  }, []);
  return (
    <div>
      <Appbar />
      <Hero data={data} />
    </div>
  );
}
