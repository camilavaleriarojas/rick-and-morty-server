import axios from 'axios';
import { CustomError } from '../../helpers/customErrorModel';
import { Request, Response } from 'express';
import { BodyResponse, Characters, UserData } from '../../types';

const characters = 'https://rickandmortyapi.com/api/character';

const getCharacters = async (req: Request, res: Response<BodyResponse<Characters[]>>) => {
  try {
    const response = await axios.get(characters);
    const data: Characters[] = response.data.results;
    console.log(data);

    const sortBy = req.params.sortBy;

    const sortFunction = (() => {
      if (sortBy === 'planet') {
        return (a: Characters, b: Characters) => a.location.name.localeCompare(b.location.name);
      } else if (sortBy === 'gender') {
        return (a: Characters, b: Characters) => a.gender.localeCompare(b.gender);
      } else {
        return (a: Characters, b: Characters) => a.name.localeCompare(b.name);
      }
    })();

    data.sort(sortFunction);

    return res.status(200).json({
      message: 'Characters obtained successfully.',
      data: data,
      error: false,
    });
  } catch (error: any) {
    throw new CustomError(500, error.message);
  }
};

export default { getCharacters };
