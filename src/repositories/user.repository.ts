import { UserDataInput, UserDto } from "../dto/user.dto";
import User from "../models/user.model";

/**
 *
 * @param where
 * @returns {Promise<UserDto | null>}
 */

const findUser = async (where: UserDataInput): Promise<UserDto | null> => {
  return await User.findOne(where);
};

/**
 *
 * @param data
 * @returns {Promise<Partial<UserDto>>}
 */

const createUser = async (data: UserDataInput): Promise<Partial<UserDto>> => {
  return await User.create(data);
};

export default { findUser, createUser };
