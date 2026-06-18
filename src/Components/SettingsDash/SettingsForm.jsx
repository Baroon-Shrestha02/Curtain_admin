import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { getSettings, updateSettings } from "../../Services/SettingsApi";

const field =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500";

const EMPTY = {
  phones: [""],
  whatsapp: "",
  email: "",
  address: "",
  socials: {
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    twitter: "",
    linkedin: "",
  },
};

export default function SettingsForm() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getSettings()
      .then((data) => {
        if (cancelled || !data) return;
        setForm({
          phones: data.phones?.length ? data.phones : [""],
          whatsapp: data.whatsapp || "",
          email: data.email || "",
          address: data.address || "",
          socials: { ...EMPTY.socials, ...(data.socials || {}) },
        });
      })
      .catch(() => {
        if (!cancelled) setErr("Failed to load settings.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setPhone = (i, v) =>
    setForm((f) => {
      const phones = [...f.phones];
      phones[i] = v;
      return { ...f, phones };
    });

  const addPhone = () =>
    setForm((f) => ({ ...f, phones: [...f.phones, ""] }));

  const removePhone = (i) =>
    setForm((f) => ({ ...f, phones: f.phones.filter((_, idx) => idx !== i) }));

  const setSocial = (k, v) =>
    setForm((f) => ({ ...f, socials: { ...f.socials, [k]: v } }));

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSaving(true);
    try {
      const payload = {
        ...form,
        phones: form.phones.map((p) => p.trim()).filter(Boolean),
      };
      const updated = await updateSettings(payload);
      if (updated) {
        setForm({
          phones: updated.phones?.length ? updated.phones : [""],
          whatsapp: updated.whatsapp || "",
          email: updated.email || "",
          address: updated.address || "",
          socials: { ...EMPTY.socials, ...(updated.socials || {}) },
        });
      }
      setMsg("Settings saved.");
    } catch (e2) {
      setErr(e2.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Site Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage contact details, WhatsApp number, and social media links shown
          on the public website.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        {/* Contact phones */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Contact Phone Numbers
          </h2>
          <div className="space-y-2">
            {form.phones.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="tel"
                  value={p}
                  onChange={(e) => setPhone(i, e.target.value)}
                  placeholder="e.g. 9851349844"
                  className={field}
                />
                <button
                  type="button"
                  onClick={() => removePhone(i)}
                  className="rounded-lg border border-gray-200 px-3 text-gray-500 hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove phone"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addPhone}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            <Plus size={14} /> Add another
          </button>
        </section>

        {/* WhatsApp */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            WhatsApp Number
          </h2>
          <input
            type="tel"
            value={form.whatsapp}
            onChange={(e) =>
              setForm((f) => ({ ...f, whatsapp: e.target.value }))
            }
            placeholder="e.g. 9851349844 (will be sent as 977XXXXXXXXX)"
            className={field}
          />
          <p className="mt-1 text-xs text-gray-500">
            Used for quotations, product inquiries, and WhatsApp links. Enter
            without country code; the site prefixes 977 automatically.
          </p>
        </section>

        {/* Email + Address */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-900">Email</h2>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="hello@example.com"
              className={field}
            />
          </div>
          <div>
            <h2 className="mb-2 text-sm font-semibold text-gray-900">
              Address
            </h2>
            <input
              type="text"
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              placeholder="Street, City"
              className={field}
            />
          </div>
        </section>

        {/* Socials */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            Social Media Links
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["facebook", "Facebook"],
              ["instagram", "Instagram"],
              ["tiktok", "TikTok"],
              ["youtube", "YouTube"],
              ["twitter", "Twitter / X"],
              ["linkedin", "LinkedIn"],
            ].map(([k, label]) => (
              <div key={k}>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  {label}
                </label>
                <input
                  type="url"
                  value={form.socials[k] || ""}
                  onChange={(e) => setSocial(k, e.target.value)}
                  placeholder="https://…"
                  className={field}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Feedback */}
        {msg && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {msg}
          </p>
        )}
        {err && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
