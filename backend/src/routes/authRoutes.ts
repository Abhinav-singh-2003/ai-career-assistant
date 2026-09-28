import express from "express";//5,8
import { register,login } from "../controllers/authController";

const router = express.Router();//express.Router() is used to create a new router instance, which allows us to define routes for handling HTTP requests related to authentication.

router.post("/register", register);
router.post("/login",login);//router.post() is used to define a route for handling POST requests to the /register and /login endpoints. The register and login functions from the authController are passed as callback functions to handle the respective requests.

export default router;
