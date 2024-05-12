import { Grid, Skeleton } from '@mui/material';

export default function LoadingCards() {
  return (
    <>
      <Grid item xs={6} md={4} lg={3}>
        <Skeleton variant="rectangular" height={240} />
      </Grid>

      <Grid item xs={6} md={4} lg={3}>
        <Skeleton variant="rectangular" height={240} />
      </Grid>

      <Grid item xs={6} md={4} lg={3}>
        <Skeleton variant="rectangular" height={240} />
      </Grid>
    </>
  );
}