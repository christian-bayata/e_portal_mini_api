import { UserDto } from "../dto/user.dto";
import User from "../models/user.model";

const findEmail = async (where: any): Promise<UserDto | null> => {
  return await User.findOne(where);
};

export default { findEmail };
