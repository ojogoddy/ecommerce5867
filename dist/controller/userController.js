"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUser = exports.getSingleUser = exports.logOut = exports.verifyUser = exports.LoginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const authModel_1 = __importDefault(require("../model/authModel"));
const profileModle_1 = __importDefault(require("../model/profileModle"));
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    service: "gmail",
    auth: {
        user: "goddy4aceu@gmail.com",
        pass: "mval wpud wpxn ksys"
    }
});
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password, role } = req.body;
        if (!userName || !email || !password) {
            return res.status(401).json({
                message: "input all required field"
            });
        }
        const checkEmail = yield authModel_1.default.findOne({ email: email });
        if (checkEmail) {
            return res.status(401).json({
                message: "email already exist"
            });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const creteData = yield authModel_1.default.create({
            userName, email, password: hashed, role
        });
        const createProfile = yield profileModle_1.default.create({
            _id: creteData._id,
            firstName: "",
            lastName: "",
            gender: "",
            avatar: "",
        });
        creteData.profile = createProfile._id;
        creteData.save();
        createProfile.user = creteData._id;
        createProfile.save();
        let mailOption = {
            from: ' "Ojogoddy" <foo@example.com>',
            to: email,
            subject: "Ojogoddy Store",
            text: "hello world",
            html: `<b>Hello world? follow this link to verify your email address <a href="https://localhost:9002/api/v1/account-verify/${creteData._id}"\>link</a> if you didn't ask to verify this address, you can ignore this email. </b> `,
        };
        yield transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log("error");
            }
            else {
                console.log("message sent: ", info.messageId);
            }
        });
        return res.status(201).json({
            message: "registration successfully check email to verify account"
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "failed to register user",
            error: error.message
        });
    }
});
exports.registerUser = registerUser;
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield authModel_1.default.findOne({ email: email });
        if (user) {
            const checkPassword = yield bcrypt_1.default.compare(password, user.password);
            if (checkPassword) {
                if (user.verify) {
                    const _a = user._doc, { password } = _a, info = __rest(_a, ["password"]);
                    let options = {
                        expiresIn: "86400"
                    };
                    const token = jsonwebtoken_1.default.sign({
                        id: user._id,
                        email: user.email,
                        userName: user.userName,
                        role: user.role
                    }, "mySecretKey", { expiresIn: "86400" });
                    res.cookie("sessionId", token, options);
                    console.log("cookie", req.headers['cookie']);
                    return res.status(200).json({
                        message: "login success",
                        data: info,
                        token: token
                    });
                }
                else {
                    let mailOption = {
                        from: ' "Ojogoddy" <foo@example.com>',
                        to: email,
                        subject: "Ojogoddy Store",
                        text: "hello world",
                        html: `<b>Hello world? follow this link to verify your email address <a href="https://localhost:9002/api/v1/account-verify/${user._id}"\>link</a> if you didn't ask to verify this address, you can ignore this email. </b> `,
                    };
                    yield transporter.sendMail(mailOption, (error, info) => {
                        if (error) {
                            console.log("error");
                        }
                        else {
                            console.log("message sent: ", info.messageId);
                        }
                    });
                    return res.status(404).json({
                        message: "please check your email to verify account",
                    });
                }
            }
            else {
                return res.status(404).json({
                    message: "account not found"
                });
            }
        }
    }
    catch (error) {
        return error;
    }
});
exports.LoginUser = LoginUser;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield authModel_1.default.findById(req.params.id);
        console.log(user);
        const verifyData = yield authModel_1.default.findByIdAndUpdate(req.params.id, {
            verify: true
        }, { new: true });
        return res.status(201).json({
            message: "account has been verified, therefore proceed to login"
        });
    }
    catch (error) {
        return error;
    }
});
exports.verifyUser = verifyUser;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("sessionId");
        res.setHeader('Clear-Site-Data', '"cookies", "storage"');
        return res.status(200).json({
            mesaage: "Signout successfully"
        });
    }
    catch (error) {
        return res.status(404).json({
            message: error.message,
        });
    }
});
exports.logOut = logOut;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getSingle = yield authModel_1.default.findById(req.params.id).populate({
            path: "profile",
            select: "firstName lastName gender avatar"
        });
        return res.status(201).json({
            message: "successfull",
            data: getSingle
        });
    }
    catch (error) {
        return error;
    }
});
exports.getSingleUser = getSingleUser;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAll = yield authModel_1.default.find().populate({
            path: "profile",
            select: "firstName, lastName, gender, avatar"
        });
        return res.status(201).json({
            message: "successfull",
            data: getAll
        });
    }
    catch (error) {
        return error;
    }
});
exports.getAllUser = getAllUser;
