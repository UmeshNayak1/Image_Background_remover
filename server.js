const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use('/output', express.static('output'));

app.post('/remove-bg', upload.single('image'), async (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `output/${req.file.filename}.png`;

  try {
    const formData = new FormData();
    formData.append('image_file', fs.createReadStream(inputPath));
    formData.append('size', 'auto');

    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': process.env.REMOVE_BG_API_KEY,
        },
        responseType: 'arraybuffer',
      }
    );

    fs.writeFileSync(outputPath, response.data);
    res.json({ url: `/${outputPath}` });
  } catch (error) {
    console.error('Background removal failed:', error.message);
    res.status(500).json({ error: 'Failed to remove background' });
  } finally {
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath); // clean up
    }
  }
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
