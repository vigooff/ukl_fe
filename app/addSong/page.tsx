"use client";
import React, { useState } from "react";

export default function AddSong() {
  const [form, setForm] = useState({
    title: "",
    artist: "",
    description: "",
    source: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setMessage({ text: "Thumbnail must be PNG, JPG, or JPEG", type: "error" });
        e.target.value = "";
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ text: "Thumbnail must be smaller than 2MB", type: "error" });
        e.target.value = "";
        return;
      }
      setThumbnail(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!thumbnail) {
      setMessage({ text: "Please upload a thumbnail", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("artist", form.artist);
    formData.append("description", form.description);
    formData.append("source", form.source);
    formData.append("thumbnail", thumbnail);

    try {
      const res = await fetch("https://learn.smktelkom-mlg.sch.id/ukl2/playlists/song", {
        method: "POST",
        body: formData,
        // Tambahkan headers jika diperlukan
        headers: {
          // 'Authorization': 'Bearer your_token_here', // Uncomment jika perlu auth
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setMessage({ text: data.message || "Song added successfully", type: "success" });
        setForm({ title: "", artist: "", description: "", source: "" });
        setThumbnail(null);
        const thumbnailInput = document.getElementById("thumbnail") as HTMLInputElement;
        if (thumbnailInput) thumbnailInput.value = "";
      } else {
        throw new Error(data.message || "Failed to create song");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage({ 
        text: error instanceof Error ? error.message : "Error submitting form", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      maxWidth: 600,
      margin: "2rem auto",
      padding: "2rem",
      backgroundColor: "#f9fafb",
      borderRadius: 12,
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#111827",
    }}>
      <h1 style={{ textAlign: "center", marginBottom: 24, color: "#1e40af" }}>Add New Song</h1>
      
      {message && (
        <div style={{
          padding: "12px",
          marginBottom: "20px",
          borderRadius: "6px",
          backgroundColor: message.type === "error" ? "#fee2e2" : "#dcfce7",
          color: message.type === "error" ? "#b91c1c" : "#166534",
          border: `1px solid ${message.type === "error" ? "#fca5a5" : "#86efac"}`,
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: "600", marginBottom: 6 }}>
            Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 6,
              border: "1.5px solid #d1d5db",
              fontSize: 16,
              outlineColor: "#3b82f6",
              transition: "border-color 0.3s",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: "600", marginBottom: 6 }}>
            Artist
          </label>
          <input
            type="text"
            name="artist"
            value={form.artist}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 6,
              border: "1.5px solid #d1d5db",
              fontSize: 16,
              outlineColor: "#3b82f6",
              transition: "border-color 0.3s",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: "600", marginBottom: 6 }}>
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 6,
              border: "1.5px solid #d1d5db",
              fontSize: 16,
              resize: "vertical",
              outlineColor: "#3b82f6",
              transition: "border-color 0.3s",
            }}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: "600", marginBottom: 6 }}>
            Source (URL)
          </label>
          <input
            type="url"
            name="source"
            value={form.source}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 6,
              border: "1.5px solid #d1d5db",
              fontSize: 16,
              outlineColor: "#3b82f6",
              transition: "border-color 0.3s",
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontWeight: "600", marginBottom: 6 }}>
            Thumbnail (PNG, JPG, JPEG max 2MB)
          </label>
          <input
            id="thumbnail"
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 6,
              border: "1.5px solid #d1d5db",
              fontSize: 16,
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#93c5fd" : "#2563eb",
            color: "white",
            fontWeight: "600",
            fontSize: 18,
            borderRadius: 8,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 8px rgba(37, 99, 235, 0.4)",
            transition: "background-color 0.3s",
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ marginRight: "8px" }}>Submitting...</span>
              <span className="spinner"></span>
            </span>
          ) : (
            "Add Song"
          )}
        </button>
      </form>
    </div>
  );
}