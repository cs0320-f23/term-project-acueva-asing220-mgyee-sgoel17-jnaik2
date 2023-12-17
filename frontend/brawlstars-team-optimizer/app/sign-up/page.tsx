"use client";
import NavBar from "@/components/NavBar";
import React, { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { team } from "@/components/ReactTable";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./sign-up.css";
import { Link } from "@mui/material";

const defaultTheme = createTheme();

function Signup() {
  const router = useRouter();
  // const navigate = useNavigate();
  // const history = useHistory();
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const db = getFirestore(); // Initialize Firestore
  const addUser = async (userUid: string) => {
    try {
      // Add a new document with a generated ID to the "Users" collection
      console.log(userUid);
      const teamToBeAdded: team = {
        b1: "Shelly",
        b2: "El Primo",
        b3: "Darryl",
        score: 20,
      };
      await setDoc(doc(db, "Users", userUid), {
        uid: userUid,
        email: email,
        playerTag: "",
        pastTeams: [teamToBeAdded],
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("User signed up:", user);

      // Add the user to the "Users" collection in Firestore
      await addUser(user.uid);

      // Redirect to the desired page
      router.replace("/how-to");

      // Set signup success state
      setSignupSuccess(true);
    } catch (error: unknown) {
      const errorCode = (error as any).code;
      const errorMessage = (error as any).message;
      console.error("Signup error:", errorCode, errorMessage);
      alert("The error code is: " + errorMessage);
    }
  };

  return (
    <div className="sign-up-div">
      <NavBar />
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
              Sign up
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={onSubmit}>
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
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="log-in" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default Signup;
