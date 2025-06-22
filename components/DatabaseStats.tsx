// /components/DatabaseStats.tsx
"use client";  /* If interactive features are needed; otherwise, remove this if purely server-rendered */
import * as React from "react";
import { getDatabaseStats } from "@/app/actions/database-stats";

type Stats = {
  users: number;
  events: number;
  formSubmissions: number;
  recipes: number;
  blogPosts: number;
};

export default async function DatabaseStats() {
  // Fetch stats via server action
  const result = await getDatabaseStats();
  let stats: Stats = { users: 0, events: 0, formSubmissions: 0, recipes: 0, blogPosts: 0 };

  if (result.success) {
    stats = result.stats;
  } else {
    // If the database is not connected or an error occurred, we handle it here
    console.error("DatabaseStats: Unable to fetch stats.", result.error || "");
  }

  // Render the stats in a simple dashboard card layout
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-xl font-bold">{stats.users}</p>
        <p className="text-sm text-gray-600">Users</p>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-xl font-bold">{stats.events}</p>
        <p className="text-sm text-gray-600">Events</p>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-xl font-bold">{stats.formSubmissions}</p>
        <p className="text-sm text-gray-600">Form Submissions</p>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-xl font-bold">{stats.recipes}</p>
        <p className="text-sm text-gray-600">Recipes</p>
      </div>
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-xl font-bold">{stats.blogPosts}</p>
        <p className="text-sm text-gray-600">Blog Posts</p>
      </div>
    </div>
  );
}
