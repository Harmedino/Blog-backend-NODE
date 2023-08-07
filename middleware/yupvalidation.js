const yup = require("yup");

const userSchemaValidate = yup.object().shape({
  fullName: yup.string().required(),
  userName: yup.string().required(),
  email: yup.string().email().required(),

  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
      "Password must contain at least one digit and one special character"
    ),
});

module.exports = {
  userSchemaValidate,
};
