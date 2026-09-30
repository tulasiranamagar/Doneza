import { Link } from "react-router-dom";
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiEdit3,
  FiFlag,
  FiLoader,
  FiTag,
  FiTrash2,
} from "react-icons/fi";

function TaskCard({ task, onDelete, deletingId }) {
  const formatDate = (date) => {
    if (!date) return "No due date";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDueDateState = (date) => {
    if (!date || task.status === "completed") {
      return "normal";
    }

    const dueDate = new Date(date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (dueDate < today) {
      return "overdue";
    }

    if (dueDate >= today && dueDate < tomorrow) {
      return "today";
    }

    return "normal";
  };

  const getDueDateStyle = (state) => {
    if (state === "overdue") {
      return "text-rose-300";
    }

    if (state === "today") {
      return "text-amber-300";
    }

    return "text-slate-500";
  };

  const getPriorityStyle = (priority) => {
    if (priority === "high") {
      return "border-rose-400/20 bg-rose-500/10 text-rose-300";
    }

    if (priority === "low") {
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
    }

    return "border-amber-400/20 bg-amber-500/10 text-amber-300";
  };

  const getStatusStyle = (status) => {
    if (status === "completed") {
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";
    }

    if (status === "in-progress") {
      return "border-blue-400/20 bg-blue-500/10 text-blue-300";
    }

    return "border-white/10 bg-white/5 text-slate-400";
  };

  const formatStatus = (status) => {
    if (status === "in-progress") {
      return "In Progress";
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const dueDateState = getDueDateState(task.dueDate);

  const StatusIcon =
    task.status === "completed"
      ? FiCheckCircle
      : task.status === "in-progress"
      ? FiAlertCircle
      : FiClock;

  return (
    <div className="group relative overflow-hidden border-b border-white/10 px-5 py-5 transition duration-300 hover:bg-white/[0.025] sm:px-6">
      <div className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-violet-500 to-fuchsia-500 opacity-0 transition duration-300 group-hover:opacity-100" />

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                task.status === "completed"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : task.status === "in-progress"
                  ? "bg-blue-500/10 text-blue-400"
                  : "bg-violet-500/10 text-violet-400"
              }`}
            >
              <StatusIcon size={16} />
            </div>

            <h3
              className={`min-w-0 max-w-full truncate text-sm font-semibold ${
                task.status === "completed"
                  ? "text-slate-500 line-through"
                  : "text-white"
              }`}
            >
              {task.title}
            </h3>

            {task.isImportant && (
              <span
                className="inline-flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-300"
                title="Important task"
              >
                <FiFlag size={11} />
                Important
              </span>
            )}

            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getPriorityStyle(
                task.priority
              )}`}
            >
              {task.priority}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/20 bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold text-violet-300">
              <FiTag size={11} />
              {task.category || "Other"}
            </span>

            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                task.status
              )}`}
            >
              {formatStatus(task.status)}
            </span>
          </div>

          {task.description && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
            <span
              className={`inline-flex items-center gap-1.5 ${getDueDateStyle(
                dueDateState
              )}`}
            >
              <FiCalendar size={14} />

              {dueDateState === "overdue"
                ? `Overdue · ${formatDate(task.dueDate)}`
                : dueDateState === "today"
                ? "Due today"
                : formatDate(task.dueDate)}
            </span>

            {task.image && (
              <span className="inline-flex items-center gap-1.5 text-fuchsia-400">
                <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
                Attachment
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to={`/tasks/${task._id}`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-violet-300"
            title="Edit task"
          >
            <FiEdit3 size={16} />
          </Link>

          <button
            type="button"
            onClick={() => onDelete(task._id)}
            disabled={deletingId === task._id}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 hover:-translate-y-0.5 hover:border-rose-400/20 hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-50"
            title="Delete task"
          >
            {deletingId === task._id ? (
              <FiLoader size={16} className="animate-spin" />
            ) : (
              <FiTrash2 size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;

