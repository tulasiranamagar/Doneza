import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiCheckSquare,
  FiUser,
} from "react-icons/fi";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -right-32 top-0 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/20 transition duration-300 group-hover:scale-105">
                <FiCheckSquare size={19} />
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                Doneza
              </span>
            </Link>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Organize your tasks, stay focused, and keep moving
              forward one task at a time.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:min-w-40">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Navigate
            </p>

            <div className="flex flex-col gap-2">
              <Link
                to="/"
                className="group inline-flex w-fit items-center gap-2 text-sm text-slate-400 transition duration-300 hover:text-violet-300"
              >
                <FiCheckSquare
                  size={15}
                  className="text-slate-600 transition duration-300 group-hover:text-violet-400"
                />
                Tasks
                <FiArrowUpRight
                  size={13}
                  className="opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                />
              </Link>

              <Link
                to="/profile"
                className="group inline-flex w-fit items-center gap-2 text-sm text-slate-400 transition duration-300 hover:text-violet-300"
              >
                <FiUser
                  size={15}
                  className="text-slate-600 transition duration-300 group-hover:text-violet-400"
                />
                Profile
                <FiArrowUpRight
                  size={13}
                  className="opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Doneza. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

