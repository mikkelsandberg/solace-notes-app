import { Card, CardContent, Grid, Typography } from '@mui/material';

interface BlankStateCardProps {
  variant?: 'no notes' | 'empty search';
}

export default function BlankStateCard({ variant = 'no notes' }: BlankStateCardProps) {
  return (
    <Grid item xs={12}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: 240,
        }}
      >
        <CardContent>
          <Typography variant="h4" align="center">
            {variant === 'no notes' ? `No notes yet. Click the \u201C+\u201D button above to add a note.` : 'No notes match your search.'}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}