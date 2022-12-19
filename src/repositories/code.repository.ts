import { CreateCodeDto } from "../dto/code.dto";
import Code from "../models/code.model";

const createVerCode = async (data: any): Promise<CreateCodeDto> => {
  return await Code.create(data);
};

export default { createVerCode };
