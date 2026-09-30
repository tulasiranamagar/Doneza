import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiKey,
  FiLoader,
  FiLock,
  FiShield,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import api from "../utils/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      );

      toast.success(
        response.data.message ||
          "Password reset successfully"
      );

      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to reset password";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -right-32 top-64 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <Link
            to="/login"
            className="group mb-6 inline-flex items-center gap-2 text-sm font-medium 
            text-slate-500 transition duration-300 hover:text-violet-300"
          >
            <FiArrowLeft
              size={17}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to Login
          </Link>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] 
          shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="relative overflow-hidden border-b border-white/10 px-6 py-8 text-center sm:px-8">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-indigo-600/5 to-transparent" />

              <div className="relative mx-auto flex h-16 w-16 items-center justify-center 
              rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-400 shadow-lg shadow-violet-900/10">
                <FiLock size={29} />
              </div>

              <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                Secure Recovery
              </p>

              <h1 className="relative mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Create a new password
              </h1>

              <p className="relative mt-3 text-sm leading-6 text-slate-500">
                Choose a strong new password for your Doneza
                account.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="group">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    New Password
                  </label>

                  <div className="relative">
                    <FiLock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 
                      transition group-focus-within:text-violet-400"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 
                      py-3.5 pl-11 pr-12 text-sm text-white outline-none transition duration-300 
                      placeholder:text-slate-600 focus:border-violet-400/40 focus:bg-violet-500/5 
                      focus:ring-4 focus:ring-violet-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="group">
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <FiCheckCircle
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 
                      transition group-focus-within:text-violet-400"
                    />

                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Enter your password again"
                      autoComplete="new-password"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 
                      py-3.5 pl-11 pr-12 text-sm text-white outline-none transition duration-300 
                      placeholder:text-slate-600 focus:border-violet-400/40 focus:bg-violet-500/5 
                      focus:ring-4 focus:ring-violet-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-violet-400/10 bg-violet-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <FiShield
                      size={18}
                      className="mt-0.5 shrink-0 text-violet-400"
                    />

                    <div>
                      <p className="text-xs font-semibold text-violet-300">
                        Password security
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Use at least 6 characters and avoid
                        using an easily guessed password.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r 
                  from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg 
                  shadow-violet-900/20 transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 
                  hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <FiLoader
                        size={18}
                        className="animate-spin"
                      />
                      Resetting password...
                    </>
                  ) : (
                    <>
                      <FiKey
                        size={18}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
