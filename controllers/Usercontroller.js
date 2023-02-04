import { User } from "../models/users.js";
import { sendToken } from "../utility/sendtoken.js";
import { sendMail } from "../utility/senMail.js";
import cloudinary from "cloudinary";
import fs from "fs";

export const register = async (req, resp) => {
  const { name, email, password } = req.body;
  const avatar = req.files.avatar.tempFilePath;
  try {
    let user = await User.findOne({ email });
    if (user) {
      resp.status(400).json({ success: false, message: "user already axist" });
    } else {
      const otp = Math.floor(Math.random() * 1000000);
      const mycloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "TodpApp-ReactNative",
      });

      fs.rmSync("./tmp", { recursive: true });

      user = await User.create({
        name,
        email,
        password,
        avatar: { public_id: mycloud.public_id, url: mycloud.secure_url },
        otp,
        otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
      });

      await sendMail(email, "Verify your account", `Your otp is ${otp}`);
      sendToken(resp, user, 200, "OTP sent to your email , please verify");
    }
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};

////////------------------------------------------------------/////////

export const verify = async (req, resp) => {
  try {
    const otp = Number(req.body.otp); //wiill take input as otp
    const user = await User.findById(req.user._id);

    if (user.otp !== otp || user.otp_expiry < Date.now()) {
      resp
        .status(400)
        .json({ success: false, message: "Invald OTP or has been expire" });
    } else {
      user.verified = true;
      user.otp = null;
      user.otp_expiry = null;

      await user.save();
      sendToken(resp, user, 200, "Account verified");
    }
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};

////////------------------------------------------------------/////////

export const Login = async (req, resp) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      resp
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    } else {
      const ismatch = await user.comparePassword(password);
      if (!ismatch) {
        resp
          .status(400)
          .json({ success: false, message: "Invalid email or password" });
      } else {
        sendToken(resp, user, 200, "Login successfull");
      }
    }
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};

////////------------------------------------------------------/////////

export const Logout = async (req, resp) => {
  const { email, password } = req.body;
  try {
    resp
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()) })
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};

////////------------------------------------------------------/////////

export const addtask = async (req, resp) => {
  try {
    const { title, description } = req.body;

    const user = await User.findById(req.user._id);

    user.task.push({
      title,
      description,
      completed: false,
      createdAt: new Date(Date.now()),
    });

    await user.save();
    resp
      .status(200)
      .json({ success: true, message: "task added successfully" });
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};

////////------------------------------------------------------/////////

export const removetask = async (req, resp) => {
  try {
    const { taskId } = req.params;

    const user = await User.findById(req.user._id);

    user.task = user.task.filter(
      (task) => task._id.toString() !== taskId.toString()
    );
    await user.save();
    resp
      .status(200)
      .json({ success: true, message: "task deleted successfully" });
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};

////////------------------------------------------------------/////////

export const updatetask = async (req, resp) => {
  try {
    const { taskId } = req.params;

    const user = await User.findById(req.user._id);

    user.tak = user.task.find(
      (task) => task._id.toString() === taskId.toString()
    );
    user.tak.completed = !user.tak.completed;

    await user.save();
    resp
      .status(200)
      .json({ success: true, message: "task updated successfully" });
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};

////////------------------------------------------------------/////////

export const getMyProfile = async (req, resp) => {
  try {
    const user = await User.findById(req.user._id);
    sendToken(resp, user, 200, "Welcom back");
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};

////////------------------------------------------------------/////////

export const updateProfile = async (req, resp) => {
  try {
    const user = await User.findById(req.user._id);
    const { name } = req.body;
    const avatar = req.files.avatar.tempFilePath;

    if (name) {
      user.name = name;
    }

    if (avatar) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      const mycloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "TodpApp-ReactNative",
      });

      fs.rmSync("./tmp", { recursive: true });
      user.avatar = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      };
    }
    await user.save(); // Save must required
    resp
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};

////////------------------------------------------------------/////////

export const updatePassword = async (req, resp) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      resp.status(400).json({
        success: false,
        message: "oldPassword or new password not available",
      });
    } else {
      const isMatch = await user.comparePassword(oldPassword);

      if (!isMatch) {
        resp
          .status(400)
          .json({ success: false, message: "Invalid old password" });
      } else {
        user.password = newPassword;
        await user.save();
        resp
          .status(200)
          .json({ success: true, message: "Password updated successfully" });
      }
    }
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};

////////------------------------------------------------------/////////

export const forgotPassword = async (req, resp) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      resp.status(400).json({
        success: false,
        message: "Invalid email id",
      });
    } else {
      const otp = Math.floor(Math.random() * 1000000);
      user.resetpasswordotp = otp;
      user.resetpasswordotpExpiry = Date.now() + 10 * 60 * 1000;
      await sendMail(email, "Reset your password", `Your otp is ${otp}`);
      await user.save();

      resp
        .status(200)
        .json({ success: true, message: `Sent otp to ${email} ` });
    }
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};

////////------------------------------------------------------/////////

export const resetPassword = async (req, resp) => {
  try {
    const { otp, newPassword } = req.body;

    const user = await User.findOne({
      resetpasswordotp: otp,
      resetpasswordotpExpiry: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      resp
        .status(400)
        .json({ success: false, message: "Otp invalid or has benn expired" });
    } else {
      user.resetpasswordotp = null;
      user.resetpasswordotpExpiry = null;
      user.password = newPassword;
      await user.save();

      resp
        .status(200)
        .json({ success: true, message: "Your password has updated " });
    }
  } catch (error) {
    resp.status(500).json({ success: false, message: error.message });
  }
};
