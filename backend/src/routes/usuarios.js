import express from 'express';
import {
  getAllUsuarios,   
  getUsuarioById,   
  updateUsuario,    
  deleteUsuario,    
  registrarUsuario, 
  loginUsuario      
} from '../controllers/usuarioController.js'; 

const router = express.Router();


router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);


router.route('/')
  .get(getAllUsuarios)      
  .post(registrarUsuario); 


router.route('/:id')
  .get(getUsuarioById)    
  .patch(updateUsuario)   
  .delete(deleteUsuario); 

export default router;