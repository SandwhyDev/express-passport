import express from "express";
import cors from "cors";
import path from "path";
import env from "dotenv";
import userController from "./controllers/userController";
import passport from "passport";
env.config();
import session from "express-session";
const app = express();
const PORT = process.env.PORT;
const store = new session.MemoryStore();

//MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    resave: false,
    secret: "secret",
    cookie: { maxAge: 60000 },
    saveUninitialized: false,
    store,
  })
);

//ROUTES
app.use("/api", userController);

//LISTENER
app.listen(PORT, "0.0.0.0", () => {
  console.log(`
    SERVER RUNNING TO PORT ${PORT}
    `);
});
