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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export default function Notes() {
  const { loadingUser, user } = useLoggedInUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addNoteDialogOpen, setAddNoteDialogOpen] = useState(false);
  const [notes, setNotes] = useState([] as Note[]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

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
      <AppBar position="absolute" open={drawerOpen}>
        <Toolbar
          sx={{
            pr: '24px',
          }}
        >
          <IconButton
            aria-label="open drawer"
            title="Open Drawer"
            edge="start"
            color="inherit"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(drawerOpen && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
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
      <Drawer variant="permanent" open={drawerOpen}>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton
            aria-label="close drawer"
            onClick={toggleDrawer}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <ListItemButton
            aria-label="logout"
            onClick={() => logout()}
          >
            <ListItemIcon title="Logout">
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                    <Grid key={note.id} item xs={6} md={4} lg={3}>
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