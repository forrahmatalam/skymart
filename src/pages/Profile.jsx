import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { currentUser, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  function validateForm() {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required.";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      updateProfile({ name: name.trim(), email: email.trim().toLowerCase() });
      toast.success("Profile updated successfully");
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <User className="h-8 w-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{currentUser.name}</p>
            <p className="text-sm text-gray-500">
              Member since{" "}
              {new Date(currentUser.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 border-t border-gray-100 pt-6">
          <h2 className="text-sm font-semibold text-gray-900">Edit Profile</h2>

          {errors.form && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errors.form}</div>
          )}

          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.name ? "border-red-300 focus:ring-red-100" : "border-gray-300 focus:border-brand-500 focus:ring-brand-100"
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
                errors.email ? "border-red-300 focus:ring-red-100" : "border-gray-300 focus:border-brand-500 focus:ring-brand-100"
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
