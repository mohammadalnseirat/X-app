import Notification from "../models/notification.model.js";
import { handleErrors } from "../utils/error.js";

// 1-Function to get Notifications:
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // get all the notification that send to us:
    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImage",
    });
    // update the notification:
    await Notification.updateMany({ to: userId }, { read: true });
    // send the response back:
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error In Creating Get Notifications Api Route", error.message);
    next(error);
  }
};

// 2-Function to delete Notifications:
export const deleteAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    // send the response back:
    res.status(200).json({ message: "All Notifications Deleted Successfully" });
  } catch (error) {
    console.log(
      "Error In Creating delete Notifications Api Route",
      error.message
    );
    next(error);
  }
};

// 3-Function to delete single Notification:
export const deleteNotification = async (req, res, next) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;
    // find the notification:
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return next(handleErrors(404, "Notification Not Found!"));
    }
    // check if you are the owner of the notification to delete the single notification:
    if (notification.to.toString() !== userId.toString()) {
      return next(
        handleErrors(403, "You are not authorized to delete this notification!")
      );
    }
    // after theses checks delete the notification:
    await Notification.findByIdAndDelete(notificationId);

    // send the response back:
    res.status(200).json({ message: "Notification Deleted Successfully" });
  } catch (error) {
    console.log(
      "Error In Creating delete Notification Api Route",
      error.message
    );
    next(error);
  }
};
