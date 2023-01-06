const { Router } = require("express");
const crypto = require("crypto");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const router = Router();

router.get("/", async (req, res) => {
    let username = Buffer.from(req.query.username, 'base64').toString('ascii');
    let passcode = Buffer.from(req.query.passcode, 'base64').toString('ascii');
    let newPasscode = crypto.createHash('sha256').update(passcode).digest('base64');

    const user = await User.count({
        where: {
            [Op.or]: [
                { name: username },
                { mail: username }
            ],
            password: newPasscode
        }
    });

    if (user > 0) {
        const userData = await User.findOne({
            where: {
                [Op.or]: [
                    { name: username },
                    { mail: username }
                ],
                password: newPasscode
            },
            attributes: ['name', 'mail', 'admin', 'role']
        });
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            name: userData.name,
            mail: userData.mail,
            isAdmin: userData.admin,
            role: userData.role
        }
        const token = jwt.sign(data, jwtSecretKey);

        res.json({"login": token});
    } else {
        res.json({ message: "Usuário não encontrado no sistema" });
    }
});

module.exports = router;