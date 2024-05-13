import { useLoggedInUser } from '@/app/hooks/authHooks';
import { Note, searchNotesForUser } from '@/db/schema/notes';
import { yupResolver } from '@hookform/resolvers/yup';
import CancelIcon from '@mui/icons-material/Cancel';
import { Button, Card, CardContent, Grid, IconButton, TextField } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface SearchBarProps {
  onLoadingResults: (loading: boolean) => void;
  onSearchResult: (searchResults: Note[]) => void;
  onClearSearch: () => Promise<void>;
}

interface SearchFormValues {
  searchText?: string;
}

export default function SearchBar({ onLoadingResults, onSearchResult, onClearSearch }: SearchBarProps) {
  const { loadingUser, user } = useLoggedInUser();

  const validationSchema = Yup.object().shape({
    searchText: Yup.string().min(3, 'Search text must be at least 3 characters'),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
  };

  const { register, handleSubmit, reset, formState, watch } = useForm({
    ...formOptions,
    mode: 'all',
    defaultValues: {
      searchText: '',
    }
  });

  const onSubmit = async (formValues: SearchFormValues) => {
    onLoadingResults(true);

    const { searchText } = formValues;
    if (formState.isSubmitting || loadingUser || !user?.id || !searchText) {
      onLoadingResults(false);
      return;
    }

    const searchResult = await searchNotesForUser(user.id, searchText);

    onSearchResult(searchResult);
    onLoadingResults(false);
  };

  const onReset = async () => {
    await onClearSearch();
    reset();
  };

  return (
    <Card>
      <CardContent>
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <TextField
                {...register('searchText')}
                disabled={loadingUser || formState.isSubmitting}
                margin="normal"
                fullWidth
                id="searchText"
                label="Search"
                name="searchText"
                InputLabelProps={{
                  shrink: watch('searchText', '')!.length > 0,
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      disabled={loadingUser || formState.isSubmitting}
                      onClick={onReset}
                    >
                      <CancelIcon />
                    </IconButton>
                  )
                }}
              />
            </Grid>

            <Grid item xs={2}>
              <Button
                disabled={loadingUser || formState.isSubmitting}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
}