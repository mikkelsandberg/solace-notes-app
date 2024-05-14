import { useLoggedInUser } from '@/app/hooks/authHooks';
import { Note, searchNotesForUser } from '@/db/schema/notes';
import { yupResolver } from '@hookform/resolvers/yup';
import CancelIcon from '@mui/icons-material/Cancel';
import { Button, Card, CardContent, FormHelperText, Grid, IconButton, TextField } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface SearchBarProps {
  onLoadingResults: (loading: boolean) => void;
  onSearchResult: (searchResults: Note[]) => void;
  onClearSearch: () => Promise<void>;
  searchText: string;
  setSearchText: (searchText: string) => void;
}

interface SearchFormValues {
  searchText?: string;
}

export default function SearchBar({ onLoadingResults, onSearchResult, onClearSearch, searchText, setSearchText }: SearchBarProps) {
  const { loadingUser, user } = useLoggedInUser();

  const validationSchema = Yup.object().shape({
    searchText: Yup.string().min(3, 'Search text must be at least 3 characters'),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
  };

  const { register, handleSubmit, reset, formState, watch, setError } = useForm({
    ...formOptions,
    mode: 'onSubmit',
    defaultValues: {
      searchText,
    }
  });

  const onSubmit = async (formValues: SearchFormValues) => {
    onLoadingResults(true);

    const { searchText } = formValues;
    if (formState.isSubmitting || loadingUser || !user?.id || !searchText) {
      onLoadingResults(false);
      return;
    }

    setSearchText(searchText);
    const searchResult = await searchNotesForUser(user.id, searchText);
    
    onSearchResult(searchResult);
    onLoadingResults(false);
  };

  const onReset = async () => {
    setSearchText('');
    await onClearSearch();
    reset();
  };

  useEffect(() => {
    reset({ searchText });
  }, [reset, searchText]);

  useEffect(() => {
    setError('searchText', {});
  }, [setError]);

  return (
    <Card>
      <CardContent>
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item sm={10} xs={8}>
              <TextField
                {...register('searchText')}
                size="small"
                disabled={loadingUser || formState.isSubmitting}
                margin="none"
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
                      aria-label="clear search"
                      title="Clear Search"
                      disabled={loadingUser || formState.isSubmitting}
                      onClick={onReset}
                    >
                      <CancelIcon />
                    </IconButton>
                  )
                }}
              />

              {
                formState.errors.searchText?.message && (
                  <FormHelperText error>{formState.errors.searchText.message}</FormHelperText>
                )
              }
            </Grid>

            <Grid item sm={2} xs={4}>
              <Button
                disabled={loadingUser || formState.isSubmitting}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ p: 1 }}
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