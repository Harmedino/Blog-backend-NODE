const yup = require("yup");

const userSchemaValidate = yup.object().shape({
  fullName: yup.string().required(),
  userName: yup.string().required,
  email: yup
    .string()
    .email()
    .required()
    .regex(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    ),
  password: yup
    .string()
    .required()
    .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/),
});

module.exports = {
  userSchemaValidate,
};
