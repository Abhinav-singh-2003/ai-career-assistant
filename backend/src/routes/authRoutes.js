"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); //5,8
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router(); //express.Router() is used to create a new router instance, which allows us to define routes for handling HTTP requests related to authentication.
router.post("/register", authController_1.register);
router.post("/login", authController_1.login); //router.post() is used to define a route for handling POST requests to the /register and /login endpoints. The register and login functions from the authController are passed as callback functions to handle the respective requests.
exports.default = router;
//# sourceMappingURL=authRoutes.js.map