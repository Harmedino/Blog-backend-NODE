const yup = require("yup");

const userSchemaValidate = yup.object().shape({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  username: yup.string().required(),
  email: yup.string().email().required(),

  password: yup.string().required("Password is required"),
});

module.exports = {
  userSchemaValidate,
};
