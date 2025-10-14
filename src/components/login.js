import '../screens/styles/login.css';
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="login-container">
      <h1>Página de Login</h1>

      <p>Bienvenido al sistema ClickFood </p>

      <form className="login-form">
        <label>
          Usuario:
          <input type="text" name="usuario" placeholder="Ingresa tu usuario" />
        </label>

        <label>
          Contraseña:
          <input type="password" name="password" placeholder="Ingresa tu contraseña" />
        </label>

        <button type="submit">Iniciar Sesión</button>

        <a href="/registrarse" target="_blank" rel="noopener noreferrer">
         <button type="button">
           ¿Aún no tienes cuenta? Regístrate ahora
         </button>
        </a>


      </form>

      <footer>
        <p>© 2025 ClickFood</p>
      </footer>
    </div>
  );
}
export default Login;