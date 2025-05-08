const upload = document.getElementById('upload');
const preview = document.getElementById('preview');
const removeBtn = document.getElementById('remove-bg');
const result = document.getElementById('result');
const outputImage = document.getElementById('output-image');
const downloadBtn = document.getElementById('download-btn');

// ✅ Set your Render backend URL here (do not include trailing slash)
const BACKEND_URL = 'https://image-background-remover-k2kz.onrender.com';

let selectedFile = null;

upload.addEventListener('change', () => {
  const file = upload.files[0];
  if (file) {
    selectedFile = file;
    preview.src = URL.createObjectURL(file);
    preview.hidden = false;
    removeBtn.disabled = false;
    result.hidden = true;
    outputImage.src = '';
    downloadBtn.href = '';
  }
});

removeBtn.addEventListener('click', async () => {
  if (!selectedFile) {
    alert('Please upload an image first.');
    return;
  }

  const formData = new FormData();
  formData.append('image', selectedFile);

  try {
    removeBtn.disabled = true;
    removeBtn.textContent = 'Removing...';

    const response = await fetch(`${BACKEND_URL}/remove-bg`, {
      method: 'POST',
      body: formData,
    });

    removeBtn.textContent = 'Remove Background';

    if (!response.ok) {
      const errText = await response.text();
      console.error('Server response:', errText);
      throw new Error('Failed to remove background.');
    }

    const data = await response.json();
    outputImage.src = `${BACKEND_URL}${data.url}`;
    downloadBtn.href = `${BACKEND_URL}${data.url}`;
    result.hidden = false;
  } catch (err) {
    alert('Error removing background. Please try again.');
    console.error(err);
  } finally {
    removeBtn.disabled = false;
  }
});
