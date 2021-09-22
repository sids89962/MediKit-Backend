const express = require('express')
const router =  express.Router()
const categoryController =  require('../controllers/categoryController')
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')


router.route('/category')
    .get(categoryController.getCategories)
    .post(auth, authAdmin, categoryController.createCategory)

router.route('/category/:id')
    .delete(auth,authAdmin,categoryController.deleteCategory)
     .put(auth,authAdmin,categoryController.updateCategory)

module.exports = router