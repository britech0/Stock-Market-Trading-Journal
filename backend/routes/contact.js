const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message content is required.' });
  }

  try {
    res.status(200).json({ message: 'Successful Message!' });
  } catch (error) {


    console.error('Error msg:', error);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;