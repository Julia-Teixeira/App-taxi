"use client";
import { useRouter } from "next/navigation";
import "./header.css";
import { FaTaxi } from "react-icons/fa6";

export default function Header() {
  const router = useRouter();
  return (
    <div className="header-box">
      <header className="content">
        <h1>
          <FaTaxi color="#fb9403" />
          AppTaxi
        </h1>

        <ul>
          <li onClick={() => router.push("/")}>Corridas</li>
          <li onClick={() => router.push("/historyRides")}>Históricos</li>
        </ul>
      </header>
    </div>
  );
}
