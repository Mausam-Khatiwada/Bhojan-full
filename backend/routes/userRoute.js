import express from "express"
import {  getAllUsers, loginUser, registerUser, deleteUser, updateUser } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get('/users',getAllUsers)
userRouter.route('/users/:id')
  .delete(deleteUser)
  .put(updateUser);
export default userRouter;