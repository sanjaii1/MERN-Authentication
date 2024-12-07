const User = require("../modal/userModal");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");
const generateOtp = require("../utils/generateOtp");

const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.signToken({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.new() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    ameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
  };
  res.cookie("token", token, cookieOptions);

  user.password = undefined;

  user.passwordConfirm = undefined;

  user.otp = undefined;

  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm, username } = res.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) return next(new AppError("Email already registerd", 400));

  const otp = generateOtp();

  const optExpaires = Date.now() * 24 * 60 * 60 * 1000;

  const newUser = await User.create({
    username,
    email,
    password,
    passwordConfirm,
    otp,
    optExpaires,
  });

  try {
    await sendEmail({
      email: newUser.email,
      subject: "OTP for email verification",
      html: `<h1>Your OTP is : ${otp} </h1> `,
    });

    createSendToken(newUser, 200, res, "Registration successful");
  } catch (error) {
    await User.findByIdAndDelete(newUser.id);
    return next(
      new AppError("There is an error sending the email. Try aggain.", 500)
    );
  }
});
