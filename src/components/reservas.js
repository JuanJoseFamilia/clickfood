import "../styles/style.css";


function Reservas() {
  return (
    <div className="container">
      <h1>Reservas</h1>
      <form className="form">
        <label>
          Fecha:
          <input type="date" />
        </label>
        <label>
          Hora:
          <input type="time" />
        </label>
        <label>
          Número de personas:
          <input type="number" min="1" />
        </label>
        <button type="submit">Reservar</button>
      </form>
    </div>
  );
}

export default Reservas;
