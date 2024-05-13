import { Card, CardContent, Grid, Typography } from '@mui/material';

export default function BlankStateCard() {
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
            No notes yet. Click the &ldquo;+&rdquo; button above to add a note.
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}