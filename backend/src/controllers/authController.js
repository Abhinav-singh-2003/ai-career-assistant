"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
//register...
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({
                message: "All fields are required"
            });
            return;
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                message: "User already exists"
            });
            return;
        }
        const hashedpassword = await bcryptjs_1.default.hash(password, 10); //10 time hashing.
        const user = await User_1.default.create({
            name,
            email,
            password: hashedpassword
        });
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: "server error"
        });
    }
};
exports.register = register;
//login...
const login = async (req, res) => {
    try {
        //1-get email and password from request body
        const { email, password } = req.body;
        //2-validate credentials
        if (!email || !password) {
            res.status(400).json({
                message: "All fields are required"
            });
            return;
        }
        // 3-find user by email
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({
                message: "Invalid credentials"
            });
            return;
        }
        //4-compare entered password with hashed password
        const ispasswordcorrect = await bcryptjs_1.default.compare(password, user.password);
        if (!ispasswordcorrect) {
            res.status(400).json({
                message: "Invalid email or password"
            });
            return;
        }
        //5-generate jwt token
        const token = jsonwebtoken_1.default.sign({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        //6-send response with token
        res.status(200).json({
            message: "Login successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({
            message: "server error"
        });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map