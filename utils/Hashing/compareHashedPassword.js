import bcrypt from "bcryptjs";

export const compareHashedPassword = async (password,referenceData) => {
    return await bcrypt.compare(password, referenceData);
};
