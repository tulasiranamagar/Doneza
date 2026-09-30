import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiList,
  FiLoader,
  FiPlus,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import api from "../utils/api";
import TaskCard from "../components/TaskCard";

function Home() {
  const { user } = useSelector((state) => state.user);

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    hasMore: false,
  });

  const fetchStats = async () => {
    try {
      setStatsLoading(true);

      const response = await api.get("/tasks/stats");

      const data = response.data.data;

      setStats({
        total: data.total || 0,
        pending: data.pending || 0,
        inProgress: data.inProgress || 0,
        completed: data.completed || 0,
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load task statistics";

      toast.error(message);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", page);
      params.set("limit", 10);

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await api.get(
        `/tasks?${params.toString()}`
      );

      const data = response.data.data;

      setTasks(data.tasks || []);
      setPagination(
        data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
          hasMore: false,
        }
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load tasks";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(taskId);

      await api.delete(`/tasks/${taskId}`);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId)
      );

      await Promise.all([fetchStats(), fetchTasks()]);

      toast.success("Task deleted successfully");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to delete task";

      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTasks = useMemo(() => {
    if (filter === "pending") {
      return tasks.filter((task) => task.status === "pending");
    }

    if (filter === "in-progress") {
      return tasks.filter(
        (task) => task.status === "in-progress"
      );
    }

    if (filter === "completed") {
      return tasks.filter(
        (task) => task.status === "completed"
      );
    }

    return tasks;
  }, [tasks, filter]);

  const filters = [
    ["all", "All", stats.total],
    ["pending", "Pending", stats.pending],
    ["in-progress", "In Progress", stats.inProgress],
    ["completed", "Completed", stats.completed],
  ];

  const summaryCards = [
    {
      label: "Total Tasks",
      value: stats.total,
      icon: FiList,
      iconStyle: "bg-violet-500/10 text-violet-400",
      hoverStyle: "hover:border-violet-400/20",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: FiClock,
      iconStyle: "bg-amber-500/10 text-amber-400",
      hoverStyle: "hover:border-amber-400/20",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: FiAlertCircle,
      iconStyle: "bg-blue-500/10 text-blue-400",
      hoverStyle: "hover:border-blue-400/20",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: FiCheckCircle,
      iconStyle: "bg-emerald-500/10 text-emerald-400",
      hoverStyle: "hover:border-emerald-400/20",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -right-32 top-72 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 
              bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
              <FiList size={14} />
              Personal Workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Welcome back,{" "}
              {user?.name?.split(" ")[0] || "there"}!
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Stay organized, manage your priorities, and keep
              everything moving forward.
            </p>
          </div>

          <Link
            to="/tasks/create"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r 
            from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 
            transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500"
          >
            <FiPlus
              size={18}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
            Add Task
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map(
            ({
              label,
              value,
              icon: Icon,
              iconStyle,
              hoverStyle,
            }) => (
              <div
                key={label}
                className={`group rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl 
                  shadow-black/10 backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${hoverStyle}`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition duration-300 group-hover:scale-110 ${iconStyle}`}
                  >
                    <Icon size={21} />
                  </div>

                  <span className="text-2xl font-bold text-white">
                    {statsLoading ? (
                      <FiLoader
                        size={20}
                        className="animate-spin text-slate-500"
                      />
                    ) : (
                      value
                    )}
                  </span>
                </div>

                <p className="mt-4 text-sm font-medium text-slate-500">
                  {label}
                </p>
              </div>
            )
          )}
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="relative overflow-hidden border-b border-white/10 px-5 py-6 sm:px-6">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-transparent" />

            <div className="relative">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                    Task Management
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-white">
                    Your Tasks
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Search, filter, and manage your current work.
                  </p>
                </div>

                <div className="relative w-full lg:max-w-sm">
                  <FiSearch
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search your tasks..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm 
                    text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-violet-400/40 
                    focus:bg-violet-500/5 focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {filters.map(([value, label, count]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition duration-300 ${
                      filter === value
                        ? "border-violet-400/30 bg-violet-500/15 text-violet-300 shadow-lg shadow-violet-900/10"
                        : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:bg-white/10 hover:text-slate-200"
                    }`}
                  >
                    {label}

                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                        filter === value
                          ? "bg-violet-400/10 text-violet-300"
                          : "bg-white/5 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex min-h-72 items-center justify-center">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 
              px-5 py-4 text-sm font-medium text-slate-400 shadow-xl backdrop-blur-xl">
                <FiLoader
                  size={20}
                  className="animate-spin text-violet-400"
                />
                Loading your tasks...
              </div>
            </div>
          )}

          {!loading && filteredTasks.length === 0 && (
            <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl 
              border border-violet-400/20 bg-violet-500/10 text-violet-400">
                <FiCheckCircle size={28} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-white">
                {search
                  ? "No tasks found"
                  : filter === "all"
                  ? "No tasks yet"
                  : `No ${filter === "in-progress" ? "in progress" : filter} tasks`}
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {search
                  ? "Try a different search term and see if your task is there."
                  : tasks.length === 0
                  ? "Create your first task and start organizing your work."
                  : "Try selecting another filter to see your tasks."}
              </p>

              {tasks.length === 0 && !search && (
                <Link
                  to="/tasks/create"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r 
                  from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg 
                  shadow-violet-900/20 transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500"
                >
                  <FiPlus size={17} />
                  Create your first task
                </Link>
              )}
            </div>
          )}

          {!loading && filteredTasks.length > 0 && (
            <>
              <div>
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDelete}
                    deletingId={deletingId}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-5 
              sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-slate-500">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages || 1}
                  <span className="mx-2 text-slate-700">•</span>
                  {pagination.total || 0} total tasks
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) =>
                        Math.max(1, current - 1)
                      )
                    }
                    disabled={page === 1 || loading}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs 
                    font-semibold text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-slate-200 
                    disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((current) => current + 1)
                    }
                    disabled={!pagination.hasMore || loading}
                    className="rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs 
                    font-semibold text-violet-300 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {!loading && tasks.length > 0 && filteredTasks.length === 0 && (
            <div className="border-t border-white/10 px-5 py-5 sm:px-6">
              <button
                type="button"
                onClick={() => {
                  setFilter("all");
                  setSearch("");
                  setPage(1);
                }}
                className="mx-auto flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs 
                font-semibold text-slate-400 transition hover:border-violet-400/20 hover:bg-violet-500/10 hover:text-violet-300"
              >
                <FiRefreshCw size={15} />
                Reset task view
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;

