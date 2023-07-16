import { useState } from "react";
// import { Socket, io } from "socket.io-client";
import Header from "./Components/Header";

export default function App() {  
  const [foundRoomIDs, setFoundRoomIDs] = useState<string[]>([]);

  return ( <>
    <Header />
    
  </> );
}
