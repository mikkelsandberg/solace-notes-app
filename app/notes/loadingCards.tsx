import { Grid, Skeleton } from '@mui/material';

export default function LoadingCards() {
  return (
    <>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Skeleton animation="wave" variant="rectangular" height={240} />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Skeleton animation="wave" variant="rectangular" height={240} />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Skeleton animation="wave" variant="rectangular" height={240} />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Skeleton animation="wave" variant="rectangular" height={240} />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Skeleton animation="wave" variant="rectangular" height={240} />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Skeleton animation="wave" variant="rectangular" height={240} />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Skeleton animation="wave" variant="rectangular" height={240} />
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Skeleton animation="wave" variant="rectangular" height={240} />
      </Grid>
    </>
  );
}