import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link as RouterLink, useHistory } from "react-router-dom";

import { Copyright } from "../components/shared/CopyrightComponent";
import { setAuthTokensToLocalStorage } from "../helpers/authLocalStorage";
import { LOGIN_PATH } from "../routes";
import { setAuthTokens } from "../services/apiClient";
import { register } from "../services/userService";

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

const formFieldRules = {
  required: "Required",
  maxLength: {
    value: 256,
    message: "Should be less than 256 chars",
  },
};

const emailFieldRules = {
  ...formFieldRules,
  pattern: {
    value: /[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+\.[a-z0-9-]+/,
    message: "Please enter a valid email",
  },
};

const RegisterView = () => {
  const classes = useStyles();

  const { handleSubmit, errors, control } = useForm();

  const history = useHistory();

  const [
    mutate,
    { status, isIdle, isLoading, isSuccess, isError, data, error, reset },
  ] = useMutation(register, {
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
    console.log(data);
    const { firstName: first_name, lastName: last_name, ...rest } = data;
    mutate({ first_name, last_name, ...rest });
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.form}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                disabled={isLoading}
                defaultValue={""}
                error={errors?.["firstName"]}
                helperText={errors?.["firstName"]?.message}
                control={control}
                rules={formFieldRules}
                as={TextField}
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                disabled={isLoading}
                defaultValue={""}
                error={errors?.["lastName"]}
                helperText={errors?.["lastName"]?.message}
                control={control}
                rules={formFieldRules}
                as={TextField}
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                disabled={isLoading}
                defaultValue={""}
                error={errors?.["email"]}
                helperText={errors?.["email"]?.message}
                control={control}
                rules={emailFieldRules}
                as={TextField}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                disabled={isLoading}
                defaultValue={""}
                error={errors?.["password"]}
                helperText={errors?.["password"]?.message}
                control={control}
                rules={formFieldRules}
                as={TextField}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
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
            {isLoading ? <CircularProgress size={25} /> : "Sign Up"}
          </Button>
          <Typography className={classes.error} variant="body1" component="p">
            {error?.response?.data}
          </Typography>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={RouterLink} to={LOGIN_PATH} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default RegisterView;
