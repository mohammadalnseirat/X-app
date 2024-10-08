import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { handleErrors } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import cloudinary from "../config/cloudinary.js";

// 1-Function To Get User Profile:
export const getUserProfile = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    // check if there is no user:
    if (!user) {
      return next(handleErrors(404, "User Not Found!"));
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error In Creating Get User Profile Api Route", error.message);
    next(error);
  }
};

// 2-Function to Follow and Un Follow:
export const followUnFollowUser = async (req, res, next) => {
  try {
    const { id } = req.params; // get id to know which user follow or unfollow
    const userToModify = await User.findById(id);
    // find the current user:
    const currentUser = await User.findById(req.user._id);

    if (id.toString() === req.user._id.toString()) {
      return next(handleErrors(400, "You cannot follow yourself!"));
    }

    if (!userToModify || !currentUser) {
      return next(handleErrors(404, "User Not Found!"));
    }

    const isFollowing = currentUser.following.includes(id);
    // check if the user is already following:
    if (isFollowing) {
      // unfollow the user:
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      // Todo return id of the user as response
      res.status(200).json({ message: "User Unfollowed Successfully" });
    } else {
      // follow the user:
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      //TODO: send notification
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      // save notification
      await newNotification.save();

      // Todo: return id of the user as response
      res.status(200).json({ message: "User Followed Successfully" });
    }
  } catch (error) {
    console.log("Error In Creating Follow Un Follow Api Route", error.message);
    next(error);
  }
};

// 3-Function To Get Suggested Users:
export const getSuggestedUsers = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // exclude the current user and following user from the suggested users:
    const usersFollowingByMe = await User.findById(userId).select("following");
    // find users that are not equal to the current user:
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);
    // filter users that are not in the users following by me:
    const filteredUsers = users.filter(
      (user) => !usersFollowingByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    // Loop on suggested users to return with out password:
    suggestedUsers.forEach((user) => (user.password = null));

    // send response back:
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(
      "Error In Creating Get Suggested Users Api Route",
      error.message
    );
    next(error);
  }
};

// 4-Function To Update User Profile:
export const updateUserProfile = async (req, res, next) => {
  // get the data from the body:
  const { fullName, username, email, currentPassword, newPassword, link, bio } =
    req.body;
  let { profileImage, coverImage } = req.body;
  const userId = req.user._id;
  try {
    // find the user:
    const user = await User.findById(userId);
    if (!user) {
      return next(handleErrors(404, "User Not Found!"));
    }
    // check the password:
    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return next(
        handleErrors(
          400,
          "Please Provide both Current Password and New Password!"
        )
      );
    }
    if (newPassword && currentPassword) {
      // check if the current password correct:
      const isMatchPassword = bcryptjs.compareSync(
        currentPassword,
        user.password
      );
      if (!isMatchPassword) {
        return next(handleErrors(400, "Current password is not correct!"));
      }
      if (newPassword.length < 8) {
        return next(
          handleErrors(400, "Password must be at least 8 characters!")
        );
      }

      // hash the new password:
      const salt = bcryptjs.genSaltSync(15);
      user.password = bcryptjs.hashSync(newPassword, salt);
    }

    // profileImage && coverImage:
    if (profileImage) {
      // delete old profile image from cloudinary:
      if (user.profileImage) {
        await cloudinary.uploader.destroy(
          user.profileImage.split("/").pop().split(".")[0]
        );
      }
      const uploadedProfileImage = await cloudinary.uploader.upload(
        profileImage
      );
      profileImage = uploadedProfileImage.secure_url;
    }
    if (coverImage) {
      // delete old cover image from cloudinary:
      if (user.coverImage) {
        await cloudinary.uploader.destroy(
          user.coverImage.split("/").pop().split(".")[0]
        );
      }
      const uploadedCoverImage = await cloudinary.uploader.upload(coverImage);
      coverImage = uploadedCoverImage.secure_url;
    }

    // update the user:
    user.fullName = fullName || user.fullName;
    user.username = username || user.username;
    user.email = email || user.email;
    user.link = link || user.link;
    user.bio = bio || user.bio;
    user.profileImage = profileImage || user.profileImage;
    user.coverImage = coverImage || user.coverImage;

    // save the user:
    const savedUser = await user.save();

    // password shuould be null in the response:
    savedUser.password = null;

    return res.status(200).json(savedUser);
  } catch (error) {
    console.log(
      "Error In Creating Update User Profile Api Route",
      error.message
    );
    next(error);
  }
};
