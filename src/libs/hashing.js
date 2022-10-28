import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

export const hashPassword = (pass) => {
  return bcrypt.hashSync(pass, salt);
};

export const comparePassword = (pass, dbPass) => {
  return bcrypt.compareSync(pass, dbPass);
};
