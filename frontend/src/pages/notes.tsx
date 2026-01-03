import { useState } from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
  Plus,
  StickyNote,
  Lock,
  Search,
  Calendar,
  Tag,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react"

/* =========================
   Types (backend-ready)
   ========================= */
export interface Note {
  id: string
  title: string
  content: string
  date: string
  tags: string[]
  encrypted: boolean
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tags: "",
  })
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set())

  /* =========================
     Derived data
     ========================= */
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  /* =========================
     Handlers (UI only)
     ========================= */
  const handleCreateNote = () => {
    if (!newNote.title.trim()) return

    const tagsArray = newNote.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      date: new Date().toISOString(),
      tags: tagsArray,
      encrypted: true,
    }

    setNotes((prev) => [note, ...prev])
    setNewNote({ title: "", content: "", tags: "" })
    setIsDialogOpen(false)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setNewNote({
      title: note.title,
      content: note.content,
      tags: note.tags.join(", "),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateNote = () => {
    if (!editingNote) return

    const tagsArray = newNote.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    setNotes((prev) =>
      prev.map((n) =>
        n.id === editingNote.id
          ? {
              ...n,
              title: newNote.title,
              content: newNote.content,
              tags: tagsArray,
            }
          : n
      )
    )

    setEditingNote(null)
    setNewNote({ title: "", content: "", tags: "" })
    setIsEditDialogOpen(false)
  }

  const handleDeleteNote = (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
  }

  const toggleExpand = (noteId: string) => {
    setExpandedNotes((prev) => {
      const set = new Set(prev)
      set.has(noteId) ? set.delete(noteId) : set.add(noteId)
      return set
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Secure Notes</h2>
          <p className="text-muted-foreground">
            Keep encrypted notes about your health, appointments, and medical
            information
          </p>
        </div>

        {/* Create Note Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
              <DialogDescription>
                Add a secure note to your health journal.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <Input
                placeholder="Note title"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
              />
              <Textarea
                placeholder="Note content"
                rows={6}
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
              />
              <Input
                placeholder="Tags (comma-separated)"
                value={newNote.tags}
                onChange={(e) =>
                  setNewNote({ ...newNote, tags: e.target.value })
                }
              />
              <Button className="w-full" onClick={handleCreateNote}>
                Create Note
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Notes list */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {filteredNotes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12">
                <StickyNote className="h-12 w-12 mb-4 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No notes found matching your search"
                    : "No notes yet. Create your first note!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotes.map((note) => {
              const expanded = expandedNotes.has(note.id)

              return (
                <Card key={note.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle>{note.title}</CardTitle>
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(note.date).toLocaleDateString()}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="border px-2 py-1">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditNote(note)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p
                      className={`text-sm text-muted-foreground ${
                        expanded ? "" : "line-clamp-3"
                      }`}
                    >
                      {note.content}
                    </p>

                    {note.content.length > 150 && (
                      <Button
                        className="mt-2 border px-3 py-1"
                        onClick={() => toggleExpand(note.id)}
                      >
                        {expanded ? "Show less" : "Show more"}
                      </Button>
                    )}

                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {note.tags.map((tag, idx) => (
                          <Badge key={idx} className="border">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </ScrollArea>

      {/* Security info */}
      <Card>
        <CardHeader>
          <CardTitle>Security & Privacy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> End-to-end encrypted notes
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Accessible only by you
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Secure cloud storage
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
