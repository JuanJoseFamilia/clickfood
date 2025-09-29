const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Ruta inicial
app.get("/", (req, res) => {
    res.send("¡Hola, Express está funcionando en Windows! 🚀");
});

// Levantar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
