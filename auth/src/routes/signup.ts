import express,{Request,Response} from 'express'
import { body,validationResult } from 'express-validator'
import { User } from '../models/user'
import jwt from 'jsonwebtoken'

const router = express.Router()
import { validateRequest } from '../middlewares/validate-request'
import {RequestValidationError} from '../errors/request-validation'
import { BadRequestError } from '../errors/Bad-request-error'


router.post('/api/users/signup',[body('email').isEmail().withMessage("Email must be valid"),
body('password').trim().isLength({min:4,max:20}).withMessage('Password must be between 4 and 20 characters')
],validateRequest,async(req:Request,res:Response) =>
{
    
     
    const { email,password } = req.body
    const existingUser = await User.findOne({email})

    if(existingUser)
    {
        throw new BadRequestError('Email in use')
    }
    const user = User.build({email,password})
    await user.save()
    //Generar JWT
    const userJwt = jwt.sign({
        id:user.id,
        email:user.email
     
    },process.env.JWT_KEY!)
    
    req.session = {
        jwt: userJwt
    }
    //store it on session
    res.status(201).send(user)

})

export { router as signupRouter}
