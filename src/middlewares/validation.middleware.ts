import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

export const validate = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req.body); // validate ONLY the body
      req.body = data; // assign validated data
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
      
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });
        console.error('Zod validation errors:', error.errors);
        next(new ValidationError(errors));
      
      
      } else {
        next(error);
      }
    }
  };
};

//function that will help us validate out data 
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path].push(err.message);
        });
  
        throw new ValidationError(errors);
      }
      throw error;
    }
  };