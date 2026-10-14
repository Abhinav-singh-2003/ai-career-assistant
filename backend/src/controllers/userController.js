"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = void 0;
const getProfile = (req, res) => {
    res.status(200).json({
        message: "profile fetched successfully",
        user: req.user
    });
};
exports.getProfile = getProfile;
//# sourceMappingURL=userController.js.map