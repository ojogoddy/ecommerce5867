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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
// const oAuth = new google.auth.OAuth2()
const GOOGLE_SECRET = "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";
const GOOGLE_ID = "1027370869399-ikd9krv78l2m9u8h0q72u7lhlo1q9n08.apps.googleusercontent.com";
const GOOGLE_REDIRECT = "https://developers.google.com/oauthplayground";
const GOOGLE_REFRESHTOKEN = "";
const oAuth = new googleapis_1.google.auth.OAuth2(GOOGLE_ID, GOOGLE_REFRESHTOKEN, GOOGLE_ID);
oAuth.setCredentials({ refresh_token: GOOGLE_REFRESHTOKEN });
const verifyUser = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield oAuth.getAccessToken();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                type: "OAuth2",
                user: "goddy4aceu@gmail.com",
                refreshToken: GOOGLE_REFRESHTOKEN,
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                accessToken: accessToken
            }
        });
        const buildFile = path_1.default.join(__dirname, "../views/VerifyAccount.ejs");
        // const data = 
    }
    catch (error) {
        return error;
    }
});
exports.verifyUser = verifyUser;
