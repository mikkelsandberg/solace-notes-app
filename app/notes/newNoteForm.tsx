import { createNoteForUser } from '@/db/schema/notes';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface NewNoteFormProps {
  afterSubmit: () => void;
  userId: string;
}

interface NewNoteFormValues {
  content: string;
}

export default function NewNoteForm({ afterSubmit, userId }: NewNoteFormProps) {
  const validationSchema = Yup.object().shape({
    content: Yup.string().min(20).max(300).required('Content is required'),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const { register, handleSubmit, reset, watch, formState } = useForm(formOptions);

  const { errors } = formState;

  const onSubmit = async (formValues: NewNoteFormValues) => {
    console.log(errors);
    console.log('formValues', formValues);
    await createNoteForUser(userId, formValues.content);
    afterSubmit();
    reset({ content: '' });
  };

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register('content')}
        margin="normal"
        required
        fullWidth
        id="content"
        label="Note"
        name="content"
        autoFocus
        multiline
        minRows={2}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Add Note
      </Button>
    </form>
  );
}