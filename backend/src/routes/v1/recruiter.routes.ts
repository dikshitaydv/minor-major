import { Router } from 'express'
import { authenticate } from '../../middleware/auth.middleware.js'
import { requireRole } from '../../middleware/rbac.middleware.js'

const router = Router()

router.get(
  '/dashboard',
  authenticate,
  requireRole('RECRUITER'),
  (_req, res) => {
    return res.status(200).json({
      success: true,
      message: 'Welcome to the recruiter dashboard',
    })
  },
)

export default router