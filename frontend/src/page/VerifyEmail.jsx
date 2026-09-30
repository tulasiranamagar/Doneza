import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowRight,
  FiCheckCircle,
  FiLoader,
  FiMail,
  FiShield,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import api from "../utils/api";

function VerifyEmail() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setMessage("Verification token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/auth/verify-email/${token}`
        );

        setVerified(true);
        setMessage(
          response.data.message ||
            "Email verified successfully"
        );

        toast.success(
          response.data.message ||
            "Email verified successfully"
        );
      } catch (error) {
        setVerified(false);

        const errorMessage =
          error.response?.data?.message ||
          "Email verification failed";

        setMessage(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute -left-32 top-20 h-72 w-72 rounded-full blur-3xl ${
            verified
              ? "bg-emerald-600/15"
              : "bg-violet-600/20"
          }`}
        />

        <div className="absolute -right-32 top-64 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] 
          shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="relative overflow-hidden border-b border-white/10 px-6 py-10 text-center sm:px-8">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-indigo-600/5 to-transparent" />

              <div
                className={`relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border shadow-xl ${
                  loading
                    ? "border-violet-400/20 bg-violet-500/10 text-violet-400"
                    : verified
                    ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-400"
                    : "border-rose-400/20 bg-rose-500/10 text-rose-400"
                }`}
              >
                {loading ? (
                  <FiLoader
                    size={34}
                    className="animate-spin"
                  />
                ) : verified ? (
                  <FiCheckCircle size={34} />
                ) : (
                  <FiXCircle size={34} />
                )}
              </div>

              <p className="relative mt-6 text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                Email Verification
              </p>

              <h1 className="relative mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {loading
                  ? "Verifying your email"
                  : verified
                  ? "Email verified!"
                  : "Verification failed"}
              </h1>

              <p className="relative mt-3 text-sm leading-6 text-slate-500">
                {loading
                  ? "Please wait while we confirm your email address."
                  : verified
                  ? "Your Doneza account is now verified and ready to use."
                  : message ||
                    "This verification link may be invalid or expired."}
              </p>
            </div>

            <div className="p-6 sm:p-8">
              {loading ? (
                <div className="flex items-center justify-center gap-3 rounded-2xl 
                border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-400">
                  <FiLoader
                    size={18}
                    className="animate-spin text-violet-400"
                  />
                  Checking verification link...
                </div>
              ) : verified ? (
                <>
                  <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/5 p-5">
                    <div className="flex items-start gap-3">
                      <FiShield
                        size={19}
                        className="mt-0.5 shrink-0 text-emerald-400"
                      />

                      <div>
                        <p className="text-sm font-semibold text-emerald-300">
                          Your account is verified
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Sign in with your email and password
                          to continue to your Doneza workspace.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="group mt-6 flex w-full items-center justify-center gap-2 
                    rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 
                    text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition 
                    duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500"
                  >
                    Continue to Login
                    <FiArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-rose-400/15 bg-rose-500/5 p-5">
                    <div className="flex items-start gap-3">
                      <FiMail
                        size={19}
                        className="mt-0.5 shrink-0 text-rose-400"
                      />

                      <div>
                        <p className="text-sm font-semibold text-rose-300">
                          Unable to verify your email
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          The link may have expired or already
                          been used. You can return to Login and
                          continue from there.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="group mt-6 flex w-full items-center justify-center gap-2 
                    rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-semibold 
                    text-slate-300 transition duration-300 hover:-translate-y-0.5 
                    hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-violet-300"
                  >
                    <FiMail size={18} />
                    Back to Login
                  </Link>
                </>
              )}
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            Doneza · Simple task management workspace
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;

