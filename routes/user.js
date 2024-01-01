const express = require("express")
const User = require("../models/user.model")
const router = express.Router()
const config = require("../config")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const newUser = require("../models/user.model")
const { body, validationResult } = require("express-validator")

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
    const newUser = User.findOne({ username: "David" });
    // res.send.json(newUser)
    console.log(newUser);
})
// router.route("/register").post(async (req, res) => {
//     try {
//         hashedPassword = await bcrypt.hash(req.body.password, 10);
//         const user = new User({
//             userName: req.body.userName,
//             email: req.body.email,
//             password: req.body.password,
//             joined: req.body.joined,
//         });
//         await user.save()
//             .then(() => {
//                 console.log("user registered");
//                 res.status(200).json('User Registered');
//                 // res.send.json(user)
//             })
//     } catch (err) {
//         console.error(err);
//         res.status(403).json({ msg: err })

//     }
// })
router.route('/signup', [body('username').isLength({ min: 5 }),

body("password").isLength({ min: 5 })]).post(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: "User already exist" });
        }
        user = new User({ username, password });
        await user.save();
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload.user, process.env.JWT_SECRET, { expiresIn: 10000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        )
    }
    catch (err) {

        console.error(err.message);

        res.status(200).send('user registered');
    }
})

router.route("/log").post(async (req, res) => {

    try {
        const { username, password } = req.body;

        const user = await User.find({ username, password });

        const pass = await User.findOne({ password });


        if (!user) return res.status(400).send("user not found");

        // const isValidPassword = User.comparePassword({password});
        const isValidPassword = user.comparePassword(password);

        if (!isValidPassword) {

            return res.status(400).send('incorrect password');
        }

        res.send(user);

    } catch (err) {

        res.status(400).send(err.message);

    }
})
router.route("/login").post((req, res) => {

    const { username, password } = req.body;

    User.findOne({ username: username, password: password }).then((err, result) => {

        console.log(err)


        if (!result) return res.status(403).json({ msg: "User not found" })

        bcrypt.compare(password, result.password).then(isMatch => {

            if (isMatch) {

                let token = jwt.sign({ userName: username }, config.key, {
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
        if (err) return res.status(500).json({ msg: err })
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