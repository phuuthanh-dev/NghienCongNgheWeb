const express = require('express')
const router = express.Router()
const storageMulter = require('../../helpers/storageMulter')
const upload = storageMulter()

const controller = require('../../controllers/admin/product.controller')

router.get('/', controller.index)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

router.delete('/delete/:id', controller.deleteItem)

router.get('/create', controller.create)

router.post('/create', upload.single('thumbnail'), controller.createPost)

module.exports = router