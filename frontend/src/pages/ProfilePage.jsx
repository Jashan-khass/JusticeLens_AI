import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { getProfileAPI, updateProfileAPI } from "../services/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const nav = useNavigate();
  const { user, login, logout } = useAuth();
  const [profile, setProfile] = useState({ email: "", name: "", bio: "", avatar_url: "" });
  const [saving, setSaving] = useState(false);
  const [unauth, setUnauth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jl_token");
    if (!token) { setUnauth(true); return; }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfileAPI();
      if (res && res.profile) setProfile(res.profile);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) {
        logout();
        setUnauth(true);
        toast.error("Your session expired. Please login again.");
      } else {
        toast.error("Failed to load profile");
      }
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfileAPI({ name: profile.name, bio: profile.bio, avatar_url: profile.avatar_url });
      toast.success(res.message || "Profile updated");
      // Update stored user name in localStorage and context
      const storedUser = JSON.parse(localStorage.getItem("jl_user") || "{}");
      const updatedUser = { ...storedUser, name: profile.name };
      localStorage.setItem("jl_user", JSON.stringify(updatedUser));
      login(updatedUser, localStorage.getItem("jl_token"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (unauth) {
    return (
      <div className="panel">
        <h2>Profile</h2>
        <p style={{ marginTop: 8 }}>You are not logged in. Please login or register to view and edit your profile.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="btn btn-g" onClick={() => nav('/login')}>Login</button>
          <button className="btn btn-o" onClick={() => nav('/register')}>Register</button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2>Profile</h2>
      <form onSubmit={onSave} style={{ maxWidth: 680 }}>
        <div className="form-row">
          <label>Email (read-only)</label>
          <input type="email" value={profile.email} readOnly />
        </div>
        <div className="form-row">
          <label>Name</label>
          <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} required />
        </div>
        <div className="form-row">
          <label>Bio</label>
          <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={4} />
        </div>
        <div className="form-row">
          <label>Avatar URL</label>
          <input value={profile.avatar_url} onChange={e => setProfile(p => ({ ...p, avatar_url: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="btn btn-g" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
