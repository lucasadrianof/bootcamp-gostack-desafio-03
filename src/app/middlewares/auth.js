import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';
import User from '../models/User';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authorization.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;

    if (!(await User.findByPk(req.userId))) {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Bad token provided' });
  }

  return next();
};
