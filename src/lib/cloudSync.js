/**
 * cloudSync.js — Supabase-backed state sync
 *
 * Schema (run once in Supabase SQL editor):
 *
 *   create table user_state (
 *     user_id  uuid primary key references auth.users(id) on delete cascade,
 *     state    jsonb not null default '{}',
 *     updated_at timestamptz default now()
 *   );
 *   alter table user_state enable row level security;
 *   create policy "Users own their state"
 *     on user_state for all using (auth.uid() = user_id);
 */

import { supabase, isSupabaseEnabled } from "./supabase.js";

// Save full state to Supabase (debounced — call after every store update)
export async function pushState(state) {
  if (!isSupabaseEnabled) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Strip non-serializable / ephemeral state before pushing
  const persistable = { ...state };
  delete persistable.achievementQueue;

  await supabase
    .from("user_state")
    .upsert({ user_id: user.id, state: persistable, updated_at: new Date().toISOString() });
}

// Load state from Supabase on app start
export async function pullState() {
  if (!isSupabaseEnabled) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_state")
    .select("state")
    .eq("user_id", user.id)
    .single();

  if (error || !data) return null;
  return data.state;
}

// Auth helpers
export async function signInWithEmail(email) {
  if (!isSupabaseEnabled) return { error: new Error("Supabase not configured") };
  return supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
}

export async function signOut() {
  if (!isSupabaseEnabled) return;
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!isSupabaseEnabled) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthChange(callback) {
  if (!isSupabaseEnabled) return () => {};
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  return () => subscription.unsubscribe();
}
