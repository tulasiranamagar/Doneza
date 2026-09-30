import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiEdit3,
  FiLoader,
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

import api from "../utils/api";
import TaskForm from "../components/TaskForm";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchTask = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/tasks/${id}`);

      setTask(response.data.data.task);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to load task";

      toast.error(message);

      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);

      await api.put(`/tasks/${id}`, formData);

      toast.success("Task updated successfully!");

      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to update task";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute -right-32 top-72 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        </div>

        <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-slate-400 shadow-xl backdrop-blur-xl">
          <FiLoader
            size={20}
            className="animate-spin text-violet-400"
          />
          Loading task...
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

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
              <FiEdit3 size={14} />
              Edit Task
            </div>

            <h1 className="max-w-2xl truncate text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Update your task
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Change the details of your task and save your
              latest updates.
            </p>
          </div>

          <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-400 sm:flex">
            <FiEdit3 size={22} />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="relative overflow-hidden border-b border-white/10 px-6 py-6 sm:px-8">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/15 via-indigo-600/5 to-transparent" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <FiEdit3 size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="text-lg font-bold text-white">
                  Task details
                </h2>

                <p className="mt-1 truncate text-sm text-slate-500">
                  Editing: {task.title}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <TaskForm
              initialData={task}
              onSubmit={handleSubmit}
              loading={saving}
              submitLabel="Save Changes"
              loadingLabel="Saving..."
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-400/10 bg-emerald-500/5 px-4 py-3.5 text-sm text-slate-500">
          <FiCheckCircle
            size={18}
            className="shrink-0 text-emerald-400"
          />

          <p>
            Your existing task information has been loaded.
            Update anything you need and save your changes.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchTask}
          disabled={loading || saving}
          className="mx-auto mt-5 flex items-center gap-2 text-xs font-semibold text-slate-600 transition hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiRefreshCw size={14} />
          Reload task
        </button>
      </div>
    </div>
  );
}

export default EditTask;

