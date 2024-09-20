import Post from "../models/post.model.js";
import { handleErrors } from "../utils/error.js";
import User from "../models/user.model.js";
import cloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";

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

// 2-Function to Delete Post:
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Find The Post:
    const post = await Post.findById(id);
    if (!post) {
      return next(handleErrors(404, "Post Not Found!"));
    }
    // check if you can delete the post or not || if you are the owner of the post:
    if (post.user.toString() !== req.user._id.toString()) {
      return next(
        handleErrors(401, "You are not authorized to delete this post!")
      );
    }
    // delete image from cloudinary:
    if (post.image) {
      const imageID = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imageID);
    }
    // delete the post:
    await Post.findByIdAndDelete(id);
    return res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (error) {
    console.log("Error In Creating Delete Post Api Route", error.message);
    next(error);
  }
};

// 3-Function to Comment On Post:
export const commentOnPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    // Find The Post:
    const post = await Post.findById(postId);
    if (!post) {
      return next(handleErrors(404, "Post Not Found!"));
    }
    if (!text) {
      return next(handleErrors(400, "Text Field Is Required!"));
    }
    // create a comment:
    const newComment = {
      user: userId,
      text,
    };
    // update the comment array of the post:
    post.comments.push(newComment);
    // save the post:
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log("Error In Creating Comment On Post Api Route", error.message);
    next(error);
  }
};

// 4-Function to Like Or Unlike Post:
export const likeUnlikePost = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(handleErrors(404, "Post not Found!"));
    }
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      // unlike the post:
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likesPost: postId } });
      res.status(200).json({ message: "Post Unliked Successfully" });
    } else {
      // like the post:
      // await Post.updateOne({_id:postId},{$push:{likes:userId}}) // first way to like on the post
      post.likes.push(userId); // second way to like on the post
      await User.updateOne({ _id: userId }, { $push: { likesPost: postId } });
      await post.save();
      // create notification:
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      // save the notification:
      await notification.save();
      res.status(200).json({ message: "Post Liked Successfully" });
    }
  } catch (error) {
    console.log(
      "Error In Creating Like Or Unlike Post Api Route",
      error.message
    );
    next(error);
  }
};
