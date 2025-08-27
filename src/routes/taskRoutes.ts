import { Router } from "express"

export const taskRouter = Router()

const mockTasks =[
  {id:1, title:"mock title - 1", description:"mock description - 1", status:"status - 1", dueDate: new Date },
  {id:2, title:"mock title - 2", description:"mock description - 2", status:"status - 2", dueDate: new Date }
]

taskRouter.get("/task", (req, res) => {
 res.json(mockTasks)
})

export default taskRouter