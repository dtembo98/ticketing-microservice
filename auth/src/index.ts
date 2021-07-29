import express from 'express'
import 'express-async-errors'
import morgan from 'morgan'
import mongoose from 'mongoose'

import { currentUserRouter } from './routes/current-user'
import { signinRouter} from './routes/signin'
import { signoutRouter} from './routes/signout'
import { signupRouter} from './routes/signup'
import { errorHandler} from './middlewares/error-handlers'
import { NotFoundError } from './errors/not-found-error'


const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*',async (req,re) =>{
    throw new NotFoundError()
})
app.use(errorHandler)


const start = async() =>
{
try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth',{
useNewUrlParser:true,
useUnifiedTopology:true,
useCreateIndex:true
})
console.log("connected to mongo db auth")


} catch (error) {
    console.log(error)
}

app.listen(3000,() =>{
    console.log("listening on port 3000")
})
}

start()