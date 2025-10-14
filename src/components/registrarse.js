import '../styles/style.css';

function Registrarse() {
  return (
    <div className="login-container">
      <h1>Página de Registro</h1>

      <p>Registrate ahora en ClickFood </p>

      <form className="login-form">
        <label>
          Usuario:
          <input type="text" name="usuario" placeholder="Ingresa nombre de usuario" />
        </label>

        <label>
          Email:
          <input type="text" name="usuario" placeholder="Ingresa tu email" />
        </label>

        <label>
          Contraseña:
          <input type="password" name="password" placeholder="Ingresa tu contraseña" />
        </label>
        
        <button type="submit">Registrarse</button>


      </form>

      <footer>
        <p>© 2025 ClickFood</p>
      </footer>
    </div>
  );
}
export default Registrarse;