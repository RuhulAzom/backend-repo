import { Request, Response } from "express";
import { db } from "../config/firebaseConfig";
import { CreateUserType } from "../entities/user";
import * as userRepository from "../repository/userCollection";
import { bcrypt, jwt, sendResponse } from "../lib/utils";
import { config } from "dotenv";
config();
const secretKeyJwt = process.env.JWT_TOKEN_KEY;

export default {
  login: async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) return sendResponse(res, 404, "Data is missing");

      const findUser = await userRepository.findUserByEmail(email);
      if (!findUser) return sendResponse(res, 404, "User is not found");

      const isPasswordCorrect = bcrypt.compareSync(password, findUser.password);

      if (!isPasswordCorrect)
        return sendResponse(res, 401, "Password incorrect");

      if (!secretKeyJwt) throw new Error();

      const token = jwt.sign(
        {
          id: findUser.id,
          name: findUser.name,
          email: findUser.email,
        },
        secretKeyJwt,
        { expiresIn: "24d" }
      );

      return sendResponse(res, 200, "Login is succesfully", { token });
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, "Internal Server Error");
    }
  },

  register: async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, email, password }: CreateUserType = req.body;

      if (!name || !email || !password)
        return sendResponse(res, 404, "Data is missing");

      const check = await userRepository.findUserByEmail(email);
      if (check) return sendResponse(res, 409, "Email is already in used");

      const userData = {
        name,
        email,
        password: bcrypt.hashSync(password, 10),
      };

      const user = await userRepository.createUser({
        ...userData,
      });

      return sendResponse(res, 404, "Register is succesfully", user);
    } catch (error) {
      return sendResponse(res, 500, "Internal Server Error");
    }
  },

  checkToken: async (req: Request, res: Response): Promise<any> => {
    return sendResponse(res, 200, "Authenticated!!", (req as any).user);
  },

  fetchUserData: async (req: Request, res: Response): Promise<any> => {
    try {
      const data = await userRepository.findAll();
      return sendResponse(res, 200, "Succesfully get user data", data);
    } catch (error) {
      return sendResponse(res, 500, "Internal Server Error");
    }
  },

  updateUserData: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id, name, email } = req.body;
      if (!id) return sendResponse(res, 404, "Id is required");
      const findUser = await userRepository.findUserById(id);
      if (!findUser) return sendResponse(res, 404, "User not found");
      await userRepository.update({ id, data: { name, email } });
      return sendResponse(res, 200, "Succesfully update user data");
    } catch (error) {
      console.log({ error });
      return sendResponse(res, 500, "Internal Server Error");
    }
  },
};
