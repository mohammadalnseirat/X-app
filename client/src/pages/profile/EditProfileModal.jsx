import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditProfileModal = ({ authUser }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    bio: "",
    link: "",
    currentPassword: "",
    newPassword: "",
  });

  // Use Mutation to update the profile:
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/v1/users/updateprofile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to update profile");
        }
        if (res.ok) {
          return data;
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // handle Input Change:
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // useEffect to get the authenticated User:
  useEffect(()=>{
    if(authUser){
      setFormData({
        username:authUser.username,
        fullName:authUser.fullName,
        email:authUser.email,
        bio:authUser.bio,
        link:authUser.link,
        currentPassword:"",
        newPassword:""
      })
    }
  },[authUser])
  return (
    <>
      <button
        onClick={() => document.getElementById("editProfileModal").showModal()}
        className="btn btn-outline border-2 capitalize border-green-600 hover:bg-green-600 hover:text-gray-50 rounded-full btn-sm"
      >
        Edit Profile
      </button>
      {/* We are using dialog from daisy ui */}
      <dialog id="editProfileModal" className="modal">
        <div className="modal-box mx-auto max-w-xl border border-sky-500 rounded-md shadow-md">
          <h3 className="text-xl font-bold capitalize font-mono text-center my-3 italic">
            update profile:
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile();
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="flex-1 input p-2 input-md border border-sky-500 rounded-xl focus:outline-sky-500"
              />
              <input
                type="text"
                name="username"
                placeholder="User Name"
                value={formData.username}
                onChange={handleInputChange}
                className="flex-1 input p-2 input-md border border-sky-500 rounded-xl focus:outline-sky-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="email"
                name="email"
                placeholder="Enter your Email..."
                value={formData.email}
                onChange={handleInputChange}
                className="flex-1 input p-2 input-md border border-sky-500 rounded-xl focus:outline-sky-500"
              />
              <textarea
                type="text"
                name="bio"
                placeholder="Enter your Bio..."
                value={formData.bio}
                onChange={handleInputChange}
                className="flex-1 input p-2 resize-none input-md border border-sky-500 rounded-xl focus:outline-sky-500"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="password"
                name="currentPassword"
                placeholder="Enter your current password..."
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="flex-1 input p-2 input-md border border-sky-500 rounded-xl focus:outline-sky-500"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password..."
                value={formData.newPassword}
                onChange={handleInputChange}
                className="flex-1 input p-2 input-md border border-sky-500 rounded-xl focus:outline-sky-500 "
              />
            </div>
            <input
              type="text"
              name="link"
              placeholder="Enter your link..."
              value={formData.link}
              onChange={handleInputChange}
              className="flex-1 input p-4 input-md border border-sky-500 rounded-xl focus:outline-sky-500"
            />
            <button className="uppercase btn btn-outline border-1 border-sky-500 hover:bg-sky-400 rounded hover:rounded-full transition-all duration-150">
              {isUpdatingProfile ? (
                <>
                  <span className="loading loading-infinity loading-md text-sky-500"></span>
                </>
              ) : (
                "Update"
              )}
            </button>
          </form>
          <form method="dialog" className="modal-action">
            <button className="border border-red-500 w-8 h-8 rounded-full text-xl bg-gray-50 text-red-500 font-bold hover:bg-red-500 hover:text-gray-50 ">
              X
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default EditProfileModal;
