import Joi from 'joi';
import { Status } from '../types';

// Schema for creating a new task
export const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .required(),
  dueDate: Joi.date().iso().optional(),
});

// Schema for updating an existing task
export const updateTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .optional(),
  dueDate: Joi.date().iso().optional(),
});

// Schema for validating the task ID in the URL
export const taskIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
});
