import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { Link as RouterLink, useHistory } from "react-router-dom";

import { Copyright } from "../components/shared/CopyrightComponent";
import { setAuthTokensToLocalStorage } from "../helpers/authLocalStorage";
import { REGISTER_PATH } from "../routes";
import { setAuthTokens } from "../services/apiClient";
import { loginUser } from "../services/userService";

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error: {
    color: "red",
  },
}));

const LoginView = () => {
  const classes = useStyles();

  const { t } = useTranslation();

  const { handleSubmit, errors, control } = useForm();

  const history = useHistory();

  const [
    mutate,
    { status, isIdle, isLoading, isSuccess, isError, data, error, reset },
  ] = useMutation(loginUser, {
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
    mutate(data);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {t("loginViewFormTitle")}
        </Typography>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.form}
          noValidate
        >
          <Controller
            disabled={isLoading}
            defaultValue={""}
            control={control}
            as={TextField}
            helperText={errors?.email?.message}
            error={errors?.email}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <Controller
            disabled={isLoading}
            defaultValue={""}
            control={control}
            as={TextField}
            helperText={errors?.password?.message}
            error={errors?.password}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Typography className={classes.error} variant="body1" component="p">
            {error?.response?.data}
          </Typography>
          <Button
            disabled={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isLoading ? <CircularProgress size={25} /> : "Sign In"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to={REGISTER_PATH} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default LoginView;
