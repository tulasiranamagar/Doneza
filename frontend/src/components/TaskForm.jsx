import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiFlag,
  FiSave,
  FiTag,
} from "react-icons/fi";

const emptyTaskData = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  category: "Other",
  isImportant: false,
  dueDate: "",
};

function TaskForm({
  initialData = emptyTaskData,
  onSubmit,
  submitLabel = "Save Task",
  loading = false,
}) {
  const [formData, setFormData] = useState(emptyTaskData);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      title: initialData.title || "",
      description: initialData.description || "",
      status: initialData.status || "pending",
      priority: initialData.priority || "medium",
      category: initialData.category || "Other",
      isImportant: initialData.isImportant || false,
      dueDate: initialData.dueDate
        ? new Date(initialData.dueDate).toISOString().split("T")[0]
        : "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "title") {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    if (formData.title.trim().length < 2) {
      setError("Task title must be at least 2 characters");
      return;
    }

    setError("");

    await onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate || null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7"
    >
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
          Task Details
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">
          {submitLabel}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Keep the details clear so your next action is easy to follow.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Task title
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/40 focus:bg-violet-500/5 focus:ring-2 focus:ring-violet-500/10"
          />

          {error && (
            <div className="mt-2 flex items-center gap-2 text-xs text-rose-300">
              <FiAlertCircle size={14} />
              {error}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Add some details about this task..."
            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/40 focus:bg-violet-500/5 focus:ring-2 focus:ring-violet-500/10"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
            >
              <FiTag size={14} className="text-violet-400" />
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/10"
            >
              <option value="Study">Study</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Project">Project</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
            >
              <FiFlag size={14} className="text-violet-400" />
              Priority
            </label>

            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/10"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
            >
              <FiCheckCircle size={14} className="text-violet-400" />
              Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/10"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
            >
              <FiCalendar size={14} className="text-violet-400" />
              Due date
            </label>

            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/10"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              isImportant: !prev.isImportant,
            }))
          }
          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition duration-300 ${
            formData.isImportant
              ? "border-amber-400/20 bg-amber-500/10"
              : "border-white/10 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                formData.isImportant
                  ? "bg-amber-500/15 text-amber-300"
                  : "bg-white/5 text-slate-500"
              }`}
            >
              <FiFlag size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Important task
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Keep this task visible as a priority.
              </p>
            </div>
          </div>

          <div
            className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
              formData.isImportant ? "bg-amber-500" : "bg-white/10"
            }`}
          >
            <div
              className={`h-4 w-4 rounded-full bg-white transition ${
                formData.isImportant ? "translate-x-5" : ""
              }`}
            />
          </div>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <FiSave size={17} />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;

