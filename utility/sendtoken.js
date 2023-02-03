export const sendToken = (resp, user, statuscode, message) => {
  const token = user.getJWTtoken();

  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 60* 60 * 1000),
  };

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,    // this fo ronly showing to terminal
    avatar: user.avatar,
    tasks: user.tasks,
    verified : user.verified
  };

  resp
    .status(statuscode)
    .cookie("token", token, options)
    .json({ success: true, message, user: userData });
};
