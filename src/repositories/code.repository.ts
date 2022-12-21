import { CodeInputData, CreateCodeDto, ConfirmCodeDto } from "../dto/code.dto";
import Code from "../models/code.model";

/**
 *
 * @param data
 * @returns {Promise<CreateCodeDto>}
 */

const createVerCode = async (data: CodeInputData): Promise<CreateCodeDto> => {
  return await Code.create(data);
};

/**
 *
 * @param where
 * @returns {Promise<ConfirmCodeDto | null>}
 */

const confirmVerCode = async (where: CodeInputData): Promise<ConfirmCodeDto | null> => {
  return await Code.findOne(where);
};

/**
 *
 * @param data
 * @returns {Promise<void>}
 */

const deleteVerCode = async (data: CodeInputData) => {
  return await Code.deleteOne(data);
};

export default { createVerCode, confirmVerCode, deleteVerCode };
