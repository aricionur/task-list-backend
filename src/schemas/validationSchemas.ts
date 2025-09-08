import Joi from "joi";
import { Status } from "../types";

export const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(null).optional(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .required(),
  dueDate: Joi.date().iso().allow(null).optional(),
});

export const updateTaskSchema = Joi.object({
  id: Joi.number().integer().min(1).optional(),
  title: Joi.string().optional(),
  description: Joi.string().allow(null).optional(),
  status: Joi.string()
    .valid(...Object.values(Status))
    .optional(),
  dueDate: Joi.date().iso().allow(null).optional(),
});

export const taskIdSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
});
