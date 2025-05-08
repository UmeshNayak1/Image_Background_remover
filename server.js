const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.post('/remove-bg', upload.single('image'), async (req, res) => {
  const inputPath = req.file.path;

  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      throw new Error('REMOVE_BG_API_KEY not set in environment');
    }

    const formData = new FormData();
    formData.append('image_file', fs.createReadStream(inputPath));
    formData.append('size', 'auto');

    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': apiKey,
        },
        responseType: 'arraybuffer',
      }
    );

    res.set('Content-Type', 'image/png');
    res.send(response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to remove background' });
  } finally {
    // Cleanup uploaded file
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
