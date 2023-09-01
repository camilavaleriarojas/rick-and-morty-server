import { Request, Response } from 'express';
import { BodyResponse, UserData } from '../../types/index';
import { UserModel } from '../../models';
import { startSession } from 'mongoose';
import firebaseApp from '../../helpers/firebase/index';
import { CustomError } from '../../helpers/customErrorModel';

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
    res.status(500).json({
      message: 'There was an error!',
      data: undefined,
      error: true,
    });
  }
};

const favoriteCharacters = async (req: Request, res: Response<BodyResponse<UserData>>) => {
  try {
    const userById = await UserModel.findOne({ _id: req.params.id });

    if (!userById) {
      throw new Error(`No user found with ID ${req.params.id}.`);
    }

    const characterFound = userById.favoriteCharacters?.some(
      (id) => id === req.body.favoriteCharacters,
    );

    const response = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        [characterFound ? '$pull' : '$push']: {
          favoriteCharacters: req.body.favoriteCharacters,
        },
      },
      {
        new: true,
      },
    );
    return res.status(200).json({
      message: `Favorite character ${characterFound ? 'deleted' : 'added'} successfully`,
      data: response || ({} as UserData),
      error: false,
    });
  } catch (error: any) {
    throw new CustomError(500, error.message);
  }
};

export default {
  getUsers,
  createUser,
  favoriteCharacters,
};
