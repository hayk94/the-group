import { Container } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { Person as PersonIcon } from "@material-ui/icons";
import jwt_decode from "jwt-decode";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useHistory } from "react-router-dom";

import {
  getAccessTokenFromLocalStorage,
  setAuthTokensToLocalStorage,
} from "../../helpers/authLocalStorage";
import { formFieldRules } from "../../helpers/formHelpers";
import { setAuthTokens } from "../../services/apiClient";
import { getUser, updateUserProfile } from "../../services/userService";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    color: "red",
  },
}));

const ProfileView = () => {
  const classes = useStyles();

  const { handleSubmit, errors, control, reset: resetForm } = useForm({
    defaultValues: {
      department: "",
      gender: "",
      "job title": "",
      country: "",
      city: "",
    },
  });

  const { sub: userId } = jwt_decode(getAccessTokenFromLocalStorage()) || {};

  const {
    data: profileData,
    error: queryError,
    // failureCount,
    // isError,
    // isFetchedAfterMount,
    // isFetching,
    // isIdle,
    isLoading: isQueryLoading,
    // isPreviousData,
    // isStale,
    // isSuccess,
    // refetch,
    // remove,
    // status,
  } = useQuery(["profileQueryKey", userId], getUser, {
    // cacheTime,
    // enabled,
    // initialData,
    // initialStale,
    // isDataEqual,
    // keepPreviousData,
    // notifyOnStatusChange,
    onError: () => {},
    // onSettled,
    onSuccess: (data) => {
      resetForm(data);
    },
    // queryFnParamsFilter,
    // queryKeySerializerFn,
    // refetchInterval,
    // refetchIntervalInBackground,
    // refetchOnMount,
    // refetchOnReconnect,
    // refetchOnWindowFocus,
    // retry,
    // retryDelay,
    // staleTime,
    // structuralSharing,
    // suspense,
    // useErrorBoundary,
  });

  const history = useHistory();

  const [
    mutate,
    { status, isIdle, isLoading, isSuccess, isError, data, error, reset },
  ] = useMutation(updateUserProfile, {
    // onMutate,
    onSuccess: (data) => {
      console.log("data", data);
      setAuthTokens(data);
      setAuthTokensToLocalStorage(data);
      history.push("/");
    },
    // onSettled,
    // throwOnError,
    // useErrorBoundary,
  });

  const onSubmit = (data) => {
    console.log("data", data);
    mutate({ ...data, id: userId });
  };

  if (isQueryLoading) {
    return <CircularProgress />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PersonIcon />
        </Avatar>
        <Typography component="span" variant="h5">
          Profile
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.form}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                disabled={isLoading}
                error={errors?.["department"]}
                helperText={errors?.["department"]?.message}
                control={control}
                rules={formFieldRules}
                as={TextField}
                variant="outlined"
                required
                fullWidth
                name="department"
                label="Department"
                type="department"
                id="department"
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                disabled={isLoading}
                error={errors?.["job title"]}
                helperText={errors?.["job title"]?.message}
                control={control}
                rules={formFieldRules}
                as={TextField}
                variant="outlined"
                required
                fullWidth
                name="job title"
                label="Job Title"
                type="job title"
                id="job title"
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                disabled={isLoading}
                error={errors?.["country"]}
                helperText={errors?.["country"]?.message}
                control={control}
                rules={formFieldRules}
                as={TextField}
                variant="outlined"
                required
                fullWidth
                name="country"
                label="Country"
                type="country"
                id="country"
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                disabled={isLoading}
                error={errors?.["city"]}
                helperText={errors?.["city"]?.message}
                control={control}
                rules={formFieldRules}
                as={TextField}
                variant="outlined"
                required
                fullWidth
                name="city"
                label="City"
                type="city"
                id="city"
              />
            </Grid>
          </Grid>
          <Button
            disabled={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isLoading ? <CircularProgress size={25} /> : "Save"}
          </Button>
          <Typography className={classes.error} variant="body1" component="p">
            {error?.response?.data}
          </Typography>
        </form>
      </div>
    </Container>
  );
};

export default ProfileView;

// "gender": "Female",
//   "department": "Human Resources",
//   "job title": "Programmer I",
//   "country": "Portugal",
//   "city": "Pedrogão",
