import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckSquare,
  FiImage,
  FiPlus,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import api from "../utils/api";
import TaskForm from "../components/TaskForm";

function CreateTask() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      await api.post("/tasks", formData);

      toast.success("Task created successfully!");

      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to create task";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -right-32 top-72 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition duration-300 hover:text-violet-300"
        >
          <FiArrowLeft
            size={17}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Back to dashboard
        </Link>

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-300">
              <FiPlus size={14} />
              New Task
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Create a new task
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Add the details you need to keep your work
              organized and on track.
            </p>
          </div>

          <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-400 sm:flex">
            <FiCheckSquare size={23} />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="relative overflow-hidden border-b border-white/10 px-6 py-6 sm:px-8">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-indigo-600/5 to-transparent" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <FiCheckSquare size={20} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  Task details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Give your task a clear title and set its
                  priority, status, and due date.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <TaskForm
              onSubmit={handleSubmit}
              loading={loading}
              submitLabel="Create Task"
              loadingLabel="Creating..."
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-violet-400/10 bg-violet-500/5 px-4 py-3.5 text-sm text-slate-500">
          <FiImage
            size={18}
            className="shrink-0 text-violet-400"
          />

          <p>
            You can organize your task with a title,
            description, priority, status, and due date.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;

