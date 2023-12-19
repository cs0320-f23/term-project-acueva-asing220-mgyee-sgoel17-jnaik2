"use client";
import NavBar from "@/components/NavBar";
import React, { useEffect, useState, FormEvent } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link } from "@mui/material";
import "./login.css";

// Creating defaultTheme using Materials Ui
const defaultTheme = createTheme();

/**
 * Defining sign up functional component to return to render
 * @return LogInComponent: Returns Login component to render on screen
 */
const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("Please enter an email address");
  const [password, setPassword] = useState("Please enter a password");

  /**
   * Function that handles the onSubmit function for the button. Checks whether the user exists in our database, and if they do, whether the credentials
   * are correct. If so, we send them to the how-to page, otherwise we alert them with the corresponding error message.
   * @param {FormEvent} e - The form event triggered by the form submission.
   */
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Logged in
        const user = userCredential.user;
        alert("Succesfully logged in");
        router.replace("/how-to");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        switch (errorCode) {
          case "auth/invalid-email":
            alert("Invalid email address");
            break;
          case "auth/user-not-found":
            alert("User not found. Have you made an account yet?");
            break;
          case "auth/wrong-password":
            alert("Wrong password");
            break;
          case "auth/invalid-credential":
            alert("Incorrect email and/or password given. Please try again");
            break;
          case "auth/weak-password":
            alert(
              "Please enter a stronger password. It should be minimum 6 characters"
            );
            break;
          default:
            alert("An error occurred: " + errorCode);
            break;
        }
      });
  };

  // Rendering the LogIn component using MaterialsUi grid
  return (
    <div className="logInDiv">
      {/* <NavBar /> */}
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Log in
            </Typography>
            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                {/* <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                      />
                    </Grid> */}
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      placeholder: email,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      placeholder: password,
                    }}
                  />
                </Grid>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="how-to" variant="body2">
                      Don't want to log in? Continue to main page
                    </Link>
                  </Grid>
                </Grid>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="sign-up" variant="body2">
                      Don't have an account? Sign up here
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
              <Button
                type="submit"
                className="logInButton"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  color: "primary.contrastText",
                  backgroundColor: "primary.main",
                }}
              >
                Log in
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

// Export the LogIn component for rendering
export default Login;
