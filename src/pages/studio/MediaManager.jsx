import { useRef, useState } from "react";
import { uploadMedia, setMediaCover, deleteMedia, adminGetProject } from "../../services/admin";
import { colors, fonts } from "../../styles/theme";

// Infer the media_type enum from a file's extension; user can override.
function detectType(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (["glb", "gltf"].includes(ext)) return "model_3d";
  if (["mp4", "webm", "mov", "m4v"].includes(ext)) return "video";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"].includes(ext)) return "image";
  if (["js", "ts", "py", "php", "json", "txt", "md"].includes(ext)) return "code_snippet";
  return "document";
}

const TYPES = ["image", "video", "model_3d", "code_snippet", "document"];

export default function MediaManager({ project, onChanged }) {
  const fileRef = useRef(null);
  const [pending, setPending] = useState(null); // { file, type, caption }
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const media = project.media ?? [];

  const pickFile = (file) => {
    if (!file) return;
    setError("");
    setPending({ file, type: detectType(file), caption: "", isCover: false });
  };

  const refresh = async () => {
    const full = await adminGetProject(project.slug);
    onChanged(full);
  };

  const submit = async () => {
    if (!pending) return;
    setBusy(true);
    setError("");
    setProgress(0);
    try {
      await uploadMedia(project.slug, {
        file: pending.file,
        type: pending.type,
        caption: pending.caption,
        isCover: pending.isCover,
        onProgress: setProgress,
      });
      setPending(null);
      await refresh();
    } catch (e) {
      setError(e.response?.data?.message || "Upload failed (check file size / type).");
    } finally {
      setBusy(false);
    }
  };

  const makeCover = async (id) => { await setMediaCover(id); await refresh(); };
  const remove = async (id) => { await deleteMedia(id); await refresh(); };

  return (
    <div>
      <h2 style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 3, color: colors.accentText, margin: "0 0 16px" }}>MEDIA</h2>

      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFile(e.dataTransfer.files?.[0]); }}
        onClick={() => fileRef.current?.click()}
        data-hover
        style={{
          border: `1px dashed ${dragOver ? colors.accent : colors.border}`,
          background: dragOver ? colors.accent + "11" : colors.surface,
          borderRadius: 12, padding: "28px 20px", textAlign: "center", cursor: "pointer", marginBottom: 16,
        }}
      >
        <input ref={fileRef} type="file" hidden onChange={(e) => pickFile(e.target.files?.[0])} />
        <div style={{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1, color: colors.textMuted }}>
          DROP A FILE OR CLICK — images · video · .glb/.gltf 3D · docs
        </div>
      </div>

      {/* Pending upload config */}
      {pending && (
        <div style={{ border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16, marginBottom: 20, background: colors.surface }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.text, marginBottom: 12 }}>
            {pending.file.name} <span style={{ color: colors.textFaint }}>({Math.ceil(pending.file.size / 1024)} KB)</span>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
            <select value={pending.type} onChange={(e) => setPending({ ...pending, type: e.target.value })}
              style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "8px 10px", fontFamily: fonts.mono, fontSize: 11 }}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input value={pending.caption} placeholder="Caption (optional)"
              onChange={(e) => setPending({ ...pending, caption: e.target.value })}
              style={{ flex: "1 1 180px", background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "8px 10px", fontFamily: fonts.mono, fontSize: 11 }} />
            <label style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" checked={pending.isCover} onChange={(e) => setPending({ ...pending, isCover: e.target.checked })} /> cover
            </label>
          </div>
          {busy && <ProgressBar value={progress} />}
          {error && <p style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.pink, margin: "0 0 10px" }}>{error}</p>}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={submit} disabled={busy} data-hover
              style={{ background: colors.accent, color: "#000", border: "none", borderRadius: 6, padding: "9px 16px", fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, letterSpacing: 1, cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
              {busy ? `UPLOADING ${progress}%` : "UPLOAD"}
            </button>
            <button onClick={() => setPending(null)} disabled={busy} data-hover
              style={{ background: "transparent", color: colors.textMuted, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "9px 16px", fontFamily: fonts.mono, fontSize: 11, cursor: "pointer" }}>
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Existing media */}
      {media.length === 0 ? (
        <p style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted }}>No media yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {media.map((m) => (
            <div key={m.id} style={{ border: `1px solid ${m.is_cover ? colors.accent + "66" : colors.border}`, borderRadius: 10, overflow: "hidden", background: colors.surface }}>
              <div style={{ aspectRatio: "4 / 3", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
                {m.type === "image"
                  ? <img src={m.url} alt={m.alt_text || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.textMuted, letterSpacing: 1 }}>{m.type === "model_3d" ? "◈ 3D" : m.type.toUpperCase()}</span>}
              </div>
              <div style={{ padding: 8 }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {m.caption || m.type}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  {!m.is_cover && m.type === "image" && (
                    <Mini onClick={() => makeCover(m.id)} text="COVER" />
                  )}
                  {m.is_cover && <span style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.accentText, alignSelf: "center" }}>★ COVER</span>}
                  <Mini onClick={() => remove(m.id)} text="DEL" danger />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Mini({ onClick, text, danger }) {
  return (
    <button onClick={onClick} data-hover
      style={{ background: "transparent", color: danger ? colors.pink : colors.textMuted, border: `1px solid ${danger ? colors.pink + "55" : colors.border}`, borderRadius: 5, padding: "4px 8px", fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1, cursor: "pointer" }}>
      {text}
    </button>
  );
}

function ProgressBar({ value }) {
  return (
    <div style={{ height: 4, background: colors.border, borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
      <div style={{ width: `${value}%`, height: "100%", background: colors.accent, transition: "width 0.2s" }} />
    </div>
  );
}
