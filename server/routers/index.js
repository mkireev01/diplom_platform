const express = require('express')
const router = express.Router()

const applicationRouter = require("./applicationRouter")
const chatRouter = require("./chatRouter")
const companyRouter = require("./companyRouter")
const messageRouter = require("./messageRouter")
const resumeRouter = require("./resumeRouter")
const userRouter = require("./userRouter")
const vacancyRouter = require("./vacancyRouter")

router.use('/application', applicationRouter)
router.use('/chat', chatRouter)
router.use('/company', companyRouter)
router.use('/message', messageRouter)
router.use('/resume', resumeRouter)
router.use('/user', userRouter)
router.use('/vacancy', vacancyRouter)

module.exports = router