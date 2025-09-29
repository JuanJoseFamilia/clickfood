import React, { useEffect, useState } from "react";

function App() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then((res) => res.json())
      .then((data) => setMensaje(data.mensaje));
  }, []);

  return (
    <div>
      <h1>Frontend con React ⚛️</h1>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;
