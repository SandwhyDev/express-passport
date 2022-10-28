import { comparePassword } from "./hashing";
const LocalStragey = require("passport-local");
const passport = require("passport");
const { default: userModel } = require("../models/userModel");

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  try {
    const result = await userModel.findUnique({
      where: {
        username: username,
      },
    });

    // console.log(result);
    if (result) {
      done(null, result);
      return;
    }
  } catch (error) {
    done(error, null);
    return;
  }
});

const local = passport.use(
  new LocalStragey(async (username, password, done) => {
    try {
      const result = await userModel.findUnique({
        where: {
          username: username,
        },
      });

      // console.log(result);
      const cekPassword = comparePassword(password, result.password);

      if (cekPassword) {
        done(null, result);
        return;
      } else {
        done(null, false);
        return;
      }
    } catch (error) {
      done(error, false);
    }
  })
);

export default local;
