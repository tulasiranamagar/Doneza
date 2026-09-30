import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCamera,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiImage,
  FiLogOut,
  FiMail,
  FiSave,
  FiSettings,
  FiShield,
  FiTrash2,
  FiUser,
  FiLoader,
  FiX,
  FiUploadCloud,
  FiStar,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import api from "../utils/api";
import { login, logout } from "../utils/userSlice";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { user, token } = useSelector((state) => state.user);

  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me");
        const currentUser = response.data.user;

        setProfile(currentUser);

        setFormData({
          name: currentUser.name || "",
          email: currentUser.email || "",
        });
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Failed to load profile";

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateReduxUser = (updatedUser) => {
    dispatch(
      login({
        token,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          profileImage: updatedUser.profileImage,
          verify: updatedUser.verify,
        },
      })
    );
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setSelectedImage(file);

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
    setPreviewImage("");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setFormData({
      name: profile?.name || "",
      email: profile?.email || "",
    });

    setSelectedImage(null);
    setPreviewImage("");
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: profile?.name || "",
      email: profile?.email || "",
    });

    setSelectedImage(null);
    setPreviewImage("");
    setEditing(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setSaving(true);

      let updatedUser = profile;

      const profileResponse = await api.put("/auth/profile", {
        name: formData.name.trim(),
        email: formData.email.trim(),
      });

      updatedUser = profileResponse.data.user;

      if (selectedImage) {
        setUploading(true);

        const imageData = new FormData();
        imageData.append("profileImage", selectedImage);

        const imageResponse = await api.post(
          "/auth/profile-picture",
          imageData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        updatedUser = imageResponse.data.user;
      }

      setProfile(updatedUser);
      updateReduxUser(updatedUser);

      setSelectedImage(null);
      setPreviewImage("");
      setEditing(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update profile";

      toast.error(message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await api.delete("/auth/account");

      dispatch(logout());

      toast.success("Account deleted successfully");

      navigate("/register");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to delete account";

      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());

    toast.success("Logged out successfully");

    navigate("/login");
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 
        text-sm font-medium text-slate-300 shadow-xl backdrop-blur-xl">
          <FiLoader
            size={20}
            className="animate-spin text-violet-400"
          />
          Loading your profile...
        </div>
      </div>
    );
  }

  const displayedImage =
    previewImage || profile?.profileImage || "";

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -right-32 top-72 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 
            bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
              <FiStar size={14} />
              Personal Workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Your Profile
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Manage your identity, account information, and
              profile appearance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!editing && (
              <button
                type="button"
                onClick={handleEdit}
                className="group inline-flex items-center justify-center gap-2 rounded-xl border 
                border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 shadow-lg 
                backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300"
              >
                <FiEdit3
                  size={17}
                  className="transition-transform duration-300 group-hover:rotate-[-8deg]"
                />
                Edit Profile
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setShowSettings((current) => !current)
              }
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm 
                font-semibold shadow-lg backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 ${
                showSettings
                  ? "border-violet-400/30 bg-violet-500/15 text-violet-300"
                  : "border-white/10 bg-white/5 text-slate-200 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300"
              }`}
            >
              <FiSettings
                size={17}
                className={
                  showSettings
                    ? "animate-spin"
                    : ""
                }
              />
              Settings
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="relative overflow-hidden border-b border-white/10 px-6 py-10 sm:px-10">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-transparent" />

            <div className="relative flex flex-col items-center gap-6 sm:flex-row">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-30 blur-md" />

                <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full 
                border-4 border-slate-950 bg-slate-900 text-violet-300 shadow-2xl">
                  {displayedImage ? (
                    <img
                      src={displayedImage}
                      alt={profile?.name}
                      className="h-full w-full object-cover transition duration-500"
                    />
                  ) : (
                    <FiUser size={45} />
                  )}

                  {editing && previewImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                      <span className="rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        Preview
                      </span>
                    </div>
                  )}
                </div>

                {editing && (
                  <div className="absolute -bottom-2 -right-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-950 
                      bg-violet-600 text-white shadow-lg transition duration-300 hover:scale-110 hover:bg-violet-500"
                      title="Change profile picture"
                    >
                      <FiCamera size={17} />
                    </button>

                    {displayedImage && (
                      <button
                        type="button"
                        onClick={handleRemoveSelectedImage}
                        disabled={!selectedImage}
                        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-950 
                        bg-rose-500 text-white shadow-lg transition duration-300 hover:scale-110 hover:bg-rose-400 
                        disabled:cursor-not-allowed disabled:opacity-50"
                        title="Remove selected image"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              <div className="text-center sm:text-left">
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    {profile?.name}
                  </h2>

                  {profile?.verify && (
                    <span className="inline-flex items-center gap-1 rounded-full border 
                    border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                      <FiCheckCircle size={13} />
                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  {profile?.email}
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 
                  bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                    <FiShield
                      size={14}
                      className="text-violet-400"
                    />
                    {profile?.verify
                      ? "Account secured"
                      : "Email pending"}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-lg border 
                  border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                    <FiClock
                      size={14}
                      className="text-fuchsia-400"
                    />
                    Member since{" "}
                    {formatDate(profile?.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {editing && (
              <div className="relative mt-7 flex items-center gap-3 rounded-2xl border 
              border-violet-400/15 bg-violet-500/5 px-4 py-3 text-sm text-slate-400">
                <FiImage
                  size={18}
                  className="shrink-0 text-violet-400"
                />
                <span>
                  Profile picture changes will be uploaded when
                  you click Save Changes.
                </span>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-10">
            {editing ? (
              <form
                onSubmit={handleSaveProfile}
                className="animate-[fadeIn_0.35s_ease-out]"
              >
                <div className="mb-7">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                    Edit details
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-white">
                    Update your profile
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Make your changes and save everything together.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                      Full Name
                    </label>

                    <div className="relative">
                      <FiUser
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-violet-400"
                      />

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 
                        text-sm text-white outline-none transition duration-300 placeholder:text-slate-600 
                        focus:border-violet-400/40 focus:bg-violet-500/5 focus:ring-4 focus:ring-violet-500/10"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-300"
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <FiMail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-violet-400"
                      />

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 
                        text-sm text-white outline-none transition duration-300 placeholder:text-slate-600
                         focus:border-violet-400/40 focus:bg-violet-500/5 focus:ring-4 focus:ring-violet-500/10"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 
                    bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition duration-300 hover:border-white/20 
                    hover:bg-white/10 disabled:opacity-50"
                  >
                    <FiX size={17} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 
                    to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition duration-300 
                    hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <FiLoader
                          size={17}
                          className="animate-spin"
                        />
                        {uploading
                          ? "Uploading image..."
                          : "Saving..."}
                      </>
                    ) : (
                      <>
                        <FiSave
                          size={17}
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 
                hover:-translate-y-1 hover:border-violet-400/20 hover:bg-violet-500/[0.04]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 
                    transition duration-300 group-hover:scale-110">
                      <FiUser size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500">
                        Full Name
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-white">
                        {profile?.name}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 
                hover:-translate-y-1 hover:border-fuchsia-400/20 hover:bg-fuchsia-500/[0.04]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400 
                    transition duration-300 group-hover:scale-110">
                      <FiMail size={19} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500">
                        Email Address
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-white">
                        {profile?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 
                hover:-translate-y-1 hover:border-emerald-400/20 hover:bg-emerald-500/[0.04]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 
                    transition duration-300 group-hover:scale-110">
                      <FiShield size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Account Status
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {profile?.verify
                          ? "Verified"
                          : "Unverified"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-300 
                hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-indigo-500/[0.04]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 
                    transition duration-300 group-hover:scale-110">
                      <FiClock size={19} />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        Member Since
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {formatDate(profile?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showSettings && (
              <div className="mt-8 animate-[fadeIn_0.35s_ease-out] border-t border-white/10 pt-8">
                <div className="mb-5">
                  <div className="flex items-center gap-2">
                    <FiSettings
                      size={19}
                      className="text-violet-400"
                    />

                    <h2 className="text-xl font-bold text-white">
                      Account Settings
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    Manage your account and security options.
                  </p>
                </div>

                <div className="rounded-2xl border border-rose-400/20 bg-rose-500/5 p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-rose-300">
                        Delete Account
                      </h3>

                      <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
                        Permanently delete your Doneza account
                        and profile information. This action cannot
                        be undone.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border 
                      border-rose-400/20 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-300 transition duration-300 
                      hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deleting ? (
                        <FiLoader
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <FiTrash2 size={17} />
                      )}

                      {deleting
                        ? "Deleting..."
                        : "Delete Account"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center border-t border-white/10 pt-7 sm:justify-start">
              <button
                type="button"
                onClick={handleLogout}
                className="group inline-flex items-center justify-center gap-2 rounded-xl border 
                border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-400 transition duration-300 
                hover:border-rose-400/20 hover:bg-rose-500/10 hover:text-rose-300"
              >
                <FiLogOut
                  size={18}
                  className="transition-transform duration-300 group-hover:-translate-x-0.5"
                />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Profile;

