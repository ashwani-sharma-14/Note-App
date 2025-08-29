"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import CreateNote from "./CreateNote";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Note = {
  _id: string;
  title: string;
  description: string;
};

const DashBoard: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const { user } = useAuthStore();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setEmail(user?.email ?? null);
  }, [user]);

  const fetchNotes = async () => {
    try {
      const response = await api.get("/note");
      const data = response.data;
      const notesArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.notes)
        ? data.notes
        : [];

      setNotes(notesArray);
    } catch{
      toast.error("Internal Server Error");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
  };

  const handleSignOut = async () => {
    try {
      await api.get("/auth/logout");
      useAuthStore.getState().clearAuth();
      navigate("/login");
    } catch{
      toast.error("Internal Server Error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/note/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note deleted");
    } catch{
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-10 h-10">
              <AvatarFallback>
                {email ? email[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
          </div>

          <Button
            onClick={handleSignOut}
            className="text-sm text-blue-600 hover:underline"
          >
            Sign Out
          </Button>
        </div>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Welcome, {email ?? "user"}!
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Email: {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateNote onAddNote={handleAddNote} />
          </CardContent>
        </Card>

        {/* Notes Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Your recent notes
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent>
            {notes && notes.length === 0 ? (
              <p className="text-sm text-gray-500">No notes yet.</p>
            ) : (
              <ul className="space-y-3">
                {notes.map((note) => (
                  <li
                    key={note._id}
                    className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-md px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{note.title}</p>
                      <p className="text-sm text-gray-600">
                        {note.description}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDelete(note._id)}
                      aria-label="Delete note"
                      className="text-gray-500 hover:text-gray-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7L5 7M10 11v6m4-6v6M9 7l1-3h4l1 3"
                        />
                      </svg>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashBoard;
