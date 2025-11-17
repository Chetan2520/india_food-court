const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

const router = express.Router(); 

// Public: GET all/single
router.get('/', getAllItems);
router.get('/:id', getItem);

// Protected: POST/PUT/DELETE
router.post('/',  createItem);
router.put('/:id',  updateItem);
router.delete('/:id',  deleteItem);

module.exports = router;