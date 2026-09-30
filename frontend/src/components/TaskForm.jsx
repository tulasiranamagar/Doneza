import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCheckSquare,
  FiFileText,
  FiFlag,
  FiLoader,
  FiSave,
  FiType,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

function TaskForm({
  initialData,
  onSubmit,
  loading,
  submitLabel = "Save Task",
  loadingLabel = "Saving...",
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
  });

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      title: initialData.title || "",
      description: initialData.description || "",
      priority: initialData.priority || "medium",
      status: initialData.status || "pending",
      dueDate: initialData.dueDate
        ? new Date(initialData.dueDate)
            .toISOString()
            .split("T")[0]
        : "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    onSubmit({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <div className="group">
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            Task Title
          </label>

          <div className="relative">
            <FiType
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-violet-400"
            />

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Complete MERN project"
              maxLength={100}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-violet-400/40 focus:bg-violet-500/5 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>
        </div>

        <div className="group">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            Description
          </label>

          <div className="relative">
            <FiFileText
              size={18}
              className="absolute left-4 top-4 text-slate-500 transition group-focus-within:text-violet-400"
            />

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add some details about this task..."
              rows={5}
              maxLength={1000}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm leading-6 text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-violet-400/40 focus:bg-violet-500/5 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          <p className="mt-1.5 text-right text-xs text-slate-600">
            {formData.description.length}/1000
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="group">
            <label
              htmlFor="priority"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Priority
            </label>

            <div className="relative">
              <FiFlag
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-violet-400"
              />

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition duration-300 focus:border-violet-400/40 focus:bg-violet-500/5 focus:ring-4 focus:ring-violet-500/10"
              >
                <option value="low" className="bg-slate-900">
                  Low
                </option>
                <option value="medium" className="bg-slate-900">
                  Medium
                </option>
                <option value="high" className="bg-slate-900">
                  High
                </option>
              </select>
            </div>
          </div>

          <div className="group">
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Status
            </label>

            <div className="relative">
              <FiCheckSquare
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-violet-400"
              />

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition duration-300 focus:border-violet-400/40 focus:bg-violet-500/5 focus:ring-4 focus:ring-violet-500/10"
              >
                <option value="pending" className="bg-slate-900">
                  Pending
                </option>
                <option
                  value="in-progress"
                  className="bg-slate-900"
                >
                  In Progress
                </option>
                <option value="completed" className="bg-slate-900">
                  Completed
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="group">
          <label
            htmlFor="dueDate"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            Due Date
          </label>

          <div className="relative">
            <FiCalendar
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition group-focus-within:text-violet-400"
            />

            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition duration-300 focus:border-violet-400/40 focus:bg-violet-500/5 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end border-t border-white/10 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {loading ? (
            <>
              <FiLoader size={18} className="animate-spin" />
              {loadingLabel}
            </>
          ) : (
            <>
              <FiSave
                size={18}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;

