const express = require("express")
const User = require("../models/user.model")
const router = express.Router()
const config = require("../config")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const newUser = require("../models/user.model")

router.get("/", (req, res) => {

})
router.route("/:username").get((req, res) => {
    User.findOne(
        { userName: req.params.username },
    ).then((err, result) => {
        if (err) res.status(500).json({ msg: err })
        res.json({
            data: result,
            userName: req.params.username

        })
    })
})
router.route("/getusers").post((req, res) => {
    const newUser = User.findOne({ userName: "David" });
    // res.send.json(newUser)
    console.log(newUser);
})
router.route("/register").post(async (req, res) => {
    try {
        hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            joined: req.body.joined,
        });
        await user.save()
            .then(() => {
                console.log("user registered");
                res.status(200).json('User Registered');
                // res.send.json(user)
            })
    } catch (err) {
        console.error(err);
        res.status(403).json({ msg: err })

    }
})
router.route("/login").post((req, res) => {
    User.findOne({ username: req.body.userName }).then((err, result) => {
        if (err) return res.status(500).json({ msg: err })
        if (!result) return res.status(403).json({ msg: "User not found" })
        bcrypt.compare(req.body.password, result.password).then(isMatch => {
            if (isMatch) {
                let token = jwt.sign({ userName: req.body.userName }, config.key, {
                    expiresIn: "24h"
                })
                res.json({
                    token: token,
                    msg: "successful"
                })
            } else {
                res.status(403).json("password is incorrect")
            }
        })
    }

    )
})
router.route("/update/:username").patch((req, res) => {
    User.findOneAndUpdate(
        { userName: req.params.username },
        { $set: { password: req.params.password } },
    ).then((err, result) => {
        if (err) return res.status(400).json({ msg: err });
        const msg = {
            msg: "password successfully updated",
            userName: req.params.username,

        };
        return res.json(msg);

    })
})
router.route("./update/:delete").delete((req, res) => {
    User.findOneAndDelete(
        { userName: req.params.userName },
    ).then((err, result) => {
        if (err) return res.status(500).json({ msg: err });
        const msg = {
            msg: "Username deleted",
            userName: req.params.userName
        }
        return res.json(msg)
    })
})
module.exports = router