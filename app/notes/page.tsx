'use client';

import { useLoggedInUser } from '@/app/hooks/authHooks';
import BlankStateCard from '@/app/notes/blankStateCard';
import LoadingCards from '@/app/notes/loadingCards';
import NoteCard from '@/app/notes/noteCard';
import SearchBar from '@/app/notes/searchBar';
import UpsertNoteDialog from '@/app/notes/upsertNoteDialog';
import { logout } from '@/app/utils/authUtils';
import { getAllNotesForUser, Note } from '@/db/schema/notes';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';

export default function Notes() {
  const { loadingUser, user } = useLoggedInUser();
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false);
  const [notes, setNotes] = useState([] as Note[]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const getNotes = useCallback(async () => {
    setLoading(true);

    const userId = user?.id;

    if (!loadingUser && userId) {
      const notes = await getAllNotesForUser(userId);
      setNotes(notes);
      setLoading(false);
    }
  }, [loadingUser, user?.id]);

  useEffect(() => {
    if (!loadingUser && user?.id) {
      getNotes();
    }
  }, [user, getNotes, loadingUser]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar>
        <Toolbar>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Notes
          </Typography>

          <IconButton
            aria-label="logout"
            title="Logout"
            edge="start"
            color="inherit"
            onClick={() => logout()}
          >
            <LogoutIcon />
          </IconButton>

          <Box sx={{ px: 1 }} />

          <IconButton
            aria-label="add note"
            title="Add Note"
            edge="end"
            color="inherit"
            onClick={() => setAddNoteDialogOpen(true)}
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => theme.palette.grey[100],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <SearchBar
            onLoadingResults={setLoading}
            onClearSearch={getNotes}
            onSearchResult={setNotes}
            searchText={searchText}
            setSearchText={setSearchText}
          />

          <Box sx={{ mb: 4 }} />

          <Grid container spacing={3}>
            {
              loading ? (
                <LoadingCards />
              ) : notes.length === 0
                ? (
                  <BlankStateCard
                    variant={searchText ? 'empty search' : 'no notes'}
                  />
                ) : (
                  notes.map(note => (
                    <Grid key={note.id} item xs={12} sm={6} md={4} lg={3}>
                      <NoteCard
                        note={note}
                        onNoteDelete={getNotes}
                        onUpsertNote={getNotes}
                      />
                    </Grid>
                  ))
                )
            }
          </Grid>
        </Container>
      </Box>

      <UpsertNoteDialog
        handleClose={() => setAddNoteDialogOpen(false)}
        handleUpsertNote={() => {
          setAddNoteDialogOpen(false);
          setSearchText('');
          getNotes();
        }}
        isOpen={addNoteDialogOpen}
      />
    </Box>
  );
}