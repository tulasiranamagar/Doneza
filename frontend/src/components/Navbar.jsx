import { Link, useNavigate } from "react-router-dom";
import {
  FiCheckSquare,
  FiLogOut,
  FiPlus,
  FiUser,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { logout } from "../utils/userSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());

    toast.success("Logged out successfully");

    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-3 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between gap-3">
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/20 transition duration-300 group-hover:scale-105">
              <FiCheckSquare size={19} />
            </div>

            <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
              Doneza
            </span>
          </Link>

          <div className="flex min-w-0 items-center gap-2">
            <Link
              to="/tasks/create"
              className="group flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/10 transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 sm:px-4"
              title="Add Task"
            >
              <FiPlus
                size={18}
                className="group-hover:rotate-90"
              />

              <span className="hidden sm:inline">
                Add Task
              </span>
            </Link>

            <Link
              to="/profile"
              className="group flex h-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-2 transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/20 hover:bg-violet-500/10 sm:gap-2 sm:px-3"
              title="Profile"
            >
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-violet-500/10 text-violet-400">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiUser size={17} />
                )}
              </div>

              <div className="hidden max-w-32 sm:block">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.name}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {user?.email}
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 hover:-translate-y-0.5 hover:border-rose-400/20 hover:bg-rose-500/10 hover:text-rose-300 sm:w-auto sm:gap-2 sm:px-3"
              title="Logout"
            >
              <FiLogOut size={18} />

              <span className="hidden text-sm font-medium sm:inline">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

