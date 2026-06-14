import { useState } from "react";
import { Loader2, Mail, Phone, Shield, User, KeyRound } from "lucide-react";
import { useAuth } from "../../Utils/AuthContext";
import { changePassword } from "../../Services/AuthApi";

const fullName = (u) =>
  [u?.firstname, u?.lastname].filter(Boolean).join(" ").trim() || "—";

const field =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500";

export default function ProfileMain() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    if (!form.currentPassword || !form.password || !form.confirmPassword) {
      setErr("All password fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErr("New password and confirmation do not match.");
      return;
    }
    if (form.password.length < 6) {
      setErr("New password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    try {
      await changePassword(form);
      setMsg("Password updated successfully.");
      setForm({ currentPassword: "", password: "", confirmPassword: "" });
    } catch (e2) {
      setErr(
        e2.response?.data?.message ||
          "Failed to update password. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl space-y-8 p-6 sm:p-8">
        {/* Header */}
        <header>
          <div className="flex items-center gap-2 text-red-600">
            <User className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Account
            </span>
          </div>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Profile
          </h1>
          <p className="mt-1 text-gray-500">
            View your account details and update your password.
          </p>
        </header>

        {/* User card */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 text-2xl font-black text-white">
              {(user?.firstname?.[0] || "U").toUpperCase()}
              {(user?.lastname?.[0] || "").toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {fullName(user)}
              </p>
              <p className="text-sm text-gray-500">
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : ""}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoRow icon={Mail} label="Email" value={user?.email} />
            <InfoRow icon={Phone} label="Phone" value={user?.phone} />
            <InfoRow icon={Shield} label="Role" value={user?.role} />
            <InfoRow icon={User} label="User ID" value={user?.id} mono />
          </div>
        </section>

        {/* Change password */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-red-600" />
            <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
          </div>

          {err && (
            <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {err}
            </div>
          )}
          {msg && (
            <div className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {msg}
            </div>
          )}

          <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={change}
                autoComplete="current-password"
                className={field}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={change}
                autoComplete="new-password"
                className={field}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={change}
                autoComplete="new-password"
                className={field}
                required
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Password
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="rounded-xl bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p
        className={[
          "mt-1 text-sm text-gray-900 break-all",
          mono ? "font-mono text-xs" : "font-medium",
        ].join(" ")}
      >
        {value || "—"}
      </p>
    </div>
  );
}
