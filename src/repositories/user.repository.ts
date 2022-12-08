import { UserDto } from "../dto/user.dto";
import { CreateCodeDto } from "../dto/code.dto";
import models from "../models/index.model";

const findEmail = async (where: any): Promise<UserDto | null> => {
  return await models.User.findOne({ where });
};

const createVerCode = async (data: any): Promise<CreateCodeDto> => {
  return await models.Code.create(data);
};

export default { findEmail, createVerCode };
