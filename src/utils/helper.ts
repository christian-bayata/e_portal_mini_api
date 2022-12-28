import * as CryptoJS from "crypto-js";
import * as crypto from "crypto";
import { UserDto } from "../dto/user.dto";

const formatUserData = (data: UserDto) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), "!@#109Tyuuryfqowp085rjf{}[])_+.//||").toString();
  return ciphertext;
};

const resetToken = async (user: UserDto) => {
  const token = crypto.randomBytes(20).toString("hex");

  //Encrypt the token and set it to resetPasswordToken
  user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  // user.resetPasswordDate = Date.now();
  await user.save();

  return user.resetPasswordToken;
};

export default {
  formatUserData,
  resetToken,
};
