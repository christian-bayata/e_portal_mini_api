import * as CryptoJS from "crypto-js";
// const crypto = require("crypto");
import { UserDto } from "../dto/user.dto";

const formatUserData = (data: UserDto) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), "!@#109Tyuuryfqowp085rjf{}[])_+.//||").toString();
  return ciphertext;
};

export default {
  formatUserData,
};
