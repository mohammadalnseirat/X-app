import Post from "../models/post.model.js";
import { handleErrors } from "../utils/error.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";

// 1-Function To Create Post:
export const createPost = async (req, res, next) => {
  try {
    const { title } = req.body;
    let { image } = req.body;
    const userId = req.user._id.toString();

    // Find The User:
    const user = await User.findById(userId);

    if (!user) {
      return next(handleErrors(404, "User Not Found!"));
    }

    if ((!title && !image) || (title === "" && image === "")) {
      return next(handleErrors(400, "Please Enter All Required Fields!"));
    }
    // check if there is an image and upload it to cloudinary:
    if (image) {
      const uploadedPostImage = await cloudinary.uploader.upload(image);
      image = uploadedPostImage.secure_url;
    }

    // create a new post:
    const newPost = new Post({
      user: userId,
      title,
      image,
    });

    // save the post:
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error In Creating Create Post Api Route", error.message);
    next(error);
  }
};
