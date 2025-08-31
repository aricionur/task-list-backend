import { Request, Response, NextFunction } from 'express';
import { Schema, ValidationError } from 'joi';

export const validate = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false, // Return all errors instead of just the first one
    allowUnknown: false, // Don't allow unknown fields
  });

  if (error) {
    const errorMessages = error.details.map((detail: ValidationError['details'][0]) => detail.message);
    return res.status(400).json({ errors: errorMessages });
  }

  next();
};

export const validateParams = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages = error.details.map((detail: ValidationError['details'][0]) => detail.message);
    return res.status(400).json({ errors: errorMessages });
  }

  next();
};
