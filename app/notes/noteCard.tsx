import UpsertNoteDialog from '@/app/notes/upsertNoteDialog';
import { deleteNoteById, Note } from '@/db/schema/notes';
import { Card, CardContent, Typography } from '@mui/material';
import { useState } from 'react';

interface NoteCardProps {
  note: Note;
  onNoteDelete: () => void;
  onUpsertNote: () => void;
}

export default function NoteCard({ note, onNoteDelete, onUpsertNote }: NoteCardProps) {
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null);
  const [editNoteDialogOpen, setEditNoteDialogOpen] = useState(false);

  const deleteNote = async (id: number) => {
    await deleteNoteById(id);
    onNoteDelete();
  };

  const editNote = (note: Note) => {
    setNoteToEdit(note);
    setEditNoteDialogOpen(true);
  };

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 240,
          cursor: 'pointer',
        }}
        onClick={() => editNote(note)}
      >
        <CardContent
          sx={{
            maxHeight: '100%',
            overflow: 'auto',
          }}
        >
          <Typography
            sx={{
              wordBreak: 'break-word',
            }}
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        </CardContent>
      </Card>

      <UpsertNoteDialog
        note={noteToEdit}
        handleClose={() => setEditNoteDialogOpen(false)}
        handleUpsertNote={onUpsertNote}
        handleDeleteNote={deleteNote}
        isOpen={editNoteDialogOpen}
      />
    </>
  );
}