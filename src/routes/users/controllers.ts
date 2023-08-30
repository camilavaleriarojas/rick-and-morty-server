import { Request, Response } from 'express';
import { BodyResponse, UserData } from '../../types/index';
import { UserModel } from '../../models';
import { startSession } from 'mongoose';
import firebaseApp from '../../helpers/firebase';
import { CustomError } from '../../helpers/customErrorModel';

// const findUser = async (email: string) => {
//   try {
//     const firebaseUser = await firebaseApp.auth().getUserByEmail(email);
//     return firebaseUser;
//   } catch (error) {
//     return undefined;
//   }
// };

const getUsers = async (req: Request, res: Response<BodyResponse<UserData[]>>) => {
  const allUsers = await UserModel.find(req.query);

  return res.status(200).json({
    message: 'List was successfully get it',
    data: allUsers,
    error: false,
  });
};

const createUser = async (req: Request, res: Response<BodyResponse<UserData>>) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const isUsed = await UserModel.findOne({ email: req.body.email });
    if (isUsed) {
      throw new CustomError(400, `User with email ${req.body.email} is already registered.`);
    }

    const newFirebaseUser = await firebaseApp.auth().createUser({
      email: req.body.email,
      password: req.body.password,
    });

    const newUser = new UserModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      firebaseUid: newFirebaseUser?.uid,
    });

    const successData = await newUser.save();

    return res.status(201).json({
      message: 'User created successfully.',
      data: successData,
      error: false,
    });
  } catch (error: any) {
    throw new CustomError(500, error.message);
  }
};

export default {
  getUsers,
  createUser,
};
