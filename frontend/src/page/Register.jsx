import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiKey,
  FiLoader,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import api from "../utils/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/auth/register", formData);

      toast.success(
        "Account created! Please check your email to verify your account."
      );

      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Registration failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl 
        shadow-black/40 backdrop-blur-xl lg:grid-cols-2">
          <div className="relative flex min-h-[650px] items-center justify-center p-6 sm:p-10 lg:order-2 lg:p-12">
            <div className="w-full max-w-md">
              <div className="mb-8 lg:hidden">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2.5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white">
                    <FiCheckCircle size={19} />
                  </div>

                  <span className="text-xl font-bold text-white">
                    Doneza
                  </span>
                </Link>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                  Get started
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                  Create your account
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Set up your Doneza workspace and start
                  organizing what matters.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
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
                      placeholder="Your name"
                      autoComplete="name"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white 
                      outline-none transition duration-300 placeholder:text-slate-600 focus:border-violet-400/40 focus:bg-violet-500/5 
                      focus:ring-4 focus:ring-violet-500/10"
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
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white 
                      outline-none transition duration-300 placeholder:text-slate-600 focus:border-violet-400/40 
                      focus:bg-violet-500/5 focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>
                </div>

                <div className="group">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <FiLock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-violet-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-12 text-sm 
                      text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-violet-400/40 
                      focus:bg-violet-500/5 focus:ring-4 focus:ring-violet-500/10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
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

                <div className="rounded-2xl border border-violet-400/10 bg-violet-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <FiKey
                      size={18}
                      className="mt-0.5 shrink-0 text-violet-400"
                    />

                    <p className="text-xs leading-5 text-slate-500">
                      After registration, you'll receive an
                      email verification link before you can
                      sign in.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl 
                  bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg 
                  shadow-violet-900/20 transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 
                  disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <FiLoader
                        size={18}
                        className="animate-spin"
                      />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <FiArrowRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-white/10 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{" "}
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

          <div className="relative hidden min-h-[650px] overflow-hidden border-r border-white/10 lg:order-1 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-indigo-600/10 to-transparent" />

            <div className="absolute -left-24 bottom-20 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

            <div className="relative p-10 xl:p-14">
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br 
                from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/20">
                  <FiCheckCircle size={21} />
                </div>

                <span className="text-xl font-bold tracking-tight text-white">
                  Doneza
                </span>
              </Link>

              <div className="mt-24 max-w-md">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                  One simple workspace
                </p>

                <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                  Plan it.
                  <span className="block bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Do it.
                  </span>
                </h2>

                <p className="mt-6 text-base leading-7 text-slate-500">
                  Doneza keeps your daily tasks, priorities,
                  deadlines, and progress together so you can
                  focus on getting things done.
                </p>
              </div>
            </div>

            <div className="relative grid grid-cols-2 gap-3 p-10 xl:p-14">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <FiCheckCircle
                  size={19}
                  className="text-emerald-400"
                />

                <p className="mt-3 text-sm font-semibold text-white">
                  Track progress
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  See what's done and what's next.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <FiLock
                  size={19}
                  className="text-violet-400"
                />

                <p className="mt-3 text-sm font-semibold text-white">
                  Stay secure
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Your account stays protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

