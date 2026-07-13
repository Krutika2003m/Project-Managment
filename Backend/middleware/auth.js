const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send({
                success: false,
                msg: "Please login"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        console.log(req.user);

        next();

    } catch (error) {
        return res.status(401).send({
            success: false,
            msg: "Invalid Token"
        });
    }
}

function admin(req, res, next) {

    if (req.user.role === "admin" || req.user.role === "HOD") {
        return next();
    }

    return res.status(403).send({
        success: false,
        msg: "Not authorized"
    });
}

function hod(req, res, next) {

    // Allow both Admin and HOD
    if (req.user.role === "admin" || req.user.role === "HOD") {
        return next();
    }

    return res.status(403).send({
        success: false,
        msg: "Not authorized"
    });
}

module.exports = {
    auth,
    admin,
    hod
};