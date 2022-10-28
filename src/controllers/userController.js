import express from "express";
import { comparePassword, hashPassword } from "../libs/hashing";
import { signJwt, verifyJwt } from "../libs/jwt";
import userModel from "../models/userModel";
import passport from "passport";
import local from "../libs/passport";
const userController = express.Router();

// create
userController.post("/user/create", async (req, res) => {
  try {
    const data = await req.body;
    const findUser = await userModel.findUnique({
      where: {
        username: data.username,
      },
    });
    if (findUser) {
      res.status(400).json({
        success: false,
        message: "username sudah terdaftar",
      });
      return;
    }
    const createUser = await userModel.create({
      data: {
        username: data.username,
        password: hashPassword(data.password),
        role: data.role,
      },
    });

    res.status(201).json({
      success: true,
      message: "berhasil buat user",
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
});

// login
userController.post("/user/login", async (req, res) => {
  try {
    const data = await req.body;
    const finduser = await userModel.findUnique({
      where: {
        username: data.username,
      },
    });

    if (!finduser) {
      res.status(400).json({
        success: false,
        msg: "username salah",
      });
      return;
    }

    // CEK PASSWORD
    const cekPassword = await comparePassword(data.password, finduser.password);

    if (!cekPassword) {
      res.status(400).json({
        success: false,
        error: "password salah",
      });
      return;
    }

    const token = signJwt({
      app_name: "test app",
      username: finduser.username,
      role: finduser.role,
    });

    res.status(200).json({
      success: true,
      message: "berhasil login",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
});

//login with passport
userController.post("/user/login/passport", passport.authenticate("local"), async (req, res) => {
  try {
    // console.log(req.user.username);

    const token = signJwt({
      app_name: "test passport",
      username: req.user.username,
      role: req.user.role,
    });

    res.status(200).json({
      success: true,
      msg: "berhasil",
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

userController.get("/", async (req, res) => {
  try {
    if (req.user) {
      console.log(req.user.username);
      const result = await userModel.findUnique({
        where: {
          username: req.user.username,
        },
      });
      // console.log(result);

      res.status(200).send(result);
    } else {
      res.status(403).send({
        msg: "not authenticate",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// logout
userController.get("/logout", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//read
userController.get("/user/read", verifyJwt, async (req, res) => {
  try {
    const readUser = await userModel.findMany();
    res.status(200).json({
      success: true,
      query: readUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// update
userController.put("/user/update/:id", async (req, res) => {
  try {
    const { id } = await req.params;
    const data = await req.body;

    const updateUser = await userModel.update({
      where: {
        id: parseInt(id),
      },
      data: {
        password: data.password,
        role: data.role,
      },
    });

    res.status(201).json({
      success: true,
      message: "berhasil update",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default userController;
