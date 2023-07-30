const express = require('express')
const router = express.Router()
const dataController = require('../controller/dataController')
// router.param('id',dataController.checkId)
router.route('/aggregation-month').get(dataController.getAllMonth)

router.route('/aggregation-AllData').get(dataController.aggregationPipeline)
router.route('/').get(dataController.getAllData).post(dataController.createData)
router.route('/:id').get(dataController.getDataId).delete(dataController.deleteData).patch(dataController.updateData)

module.exports = router