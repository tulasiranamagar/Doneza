import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiKey,
  FiLoader,
  FiMail,
  FiSend,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import api from "../utils/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setSent(true);

      toast.success(
        response.data.message ||
          "Password reset email sent successfully"
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to send reset email";

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
            className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition duration-300 hover:text-violet-300"
          >
            <FiArrowLeft
              size={17}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to Login
          </Link>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="relative overflow-hidden border-b border-white/10 px-6 py-8 text-center sm:px-8">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-fuchsia-600/5 to-transparent" />

              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-400 shadow-lg shadow-violet-900/10">
                {sent ? (
                  <FiCheckCircle size={29} />
                ) : (
                  <FiKey size={29} />
                )}
              </div>

              <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                Account Recovery
              </p>

              <h1 className="relative mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {sent
                  ? "Check your inbox"
                  : "Forgot your password?"}
              </h1>

              <p className="relative mt-3 text-sm leading-6 text-slate-500">
                {sent
                  ? "We've sent a password reset link to your email address. Check your inbox and follow the link to continue."
                  : "Enter your email address and we'll send you a secure link to reset your password."}
              </p>
            </div>

            <div className="p-6 sm:p-8">
              {sent ? (
                <div className="text-center">
                  <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/5 p-5">
                    <div className="flex items-start gap-3 text-left">
                      <FiMail
                        size={19}
                        className="mt-0.5 shrink-0 text-emerald-400"
                      />

                      <div>
                        <p className="text-sm font-semibold text-emerald-300">
                          Reset email sent
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Check your email.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500"
                  >
                    <FiArrowLeft size={17} />
                    Return to Login
                  </Link>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
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
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-violet-400/40 focus:bg-violet-500/5 focus:ring-4 focus:ring-violet-500/10"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <FiLoader
                          size={18}
                          className="animate-spin"
                        />
                        Sending reset link...
                      </>
                    ) : (
                      <>
                        <FiSend
                          size={18}
                          className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-7 border-t border-white/10 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-violet-400 transition hover:text-violet-300"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-600">
            <FiKey size={14} />
            Your reset link is time-limited for security.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

