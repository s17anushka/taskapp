import { Router } from 'express'
import { body } from 'express-validator'
import { getTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/tasks.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

// All task routes require authentication
router.use(authenticate)

router.get('/', getTasks)
router.get('/:id', getTask)

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  createTask
)

router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty(),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
    body('dueDate').optional({ nullable: true }).isISO8601(),
  ],
  validate,
  updateTask
)

router.delete('/:id', deleteTask)

export default router
