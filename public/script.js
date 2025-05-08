const upload = document.getElementById('upload');
const preview = document.getElementById('preview');
const removeBtn = document.getElementById('remove-bg');
const result = document.getElementById('result');
const outputImage = document.getElementById('output-image');
const downloadBtn = document.getElementById('download-btn');

// Replace this URL with your actual Render backend URL
const BACKEND_URL = 'https://image-background-remover-k2kz.onrender.com'; // <-- CHANGE THIS

let selectedFile;

upload.addEventListener('change', () => {
  const file = upload.files[0];
  if (file) {
    selectedFile = file;
    preview.src = URL.createObjectURL(file);
    preview.hidden = false;
    removeBtn.disabled = false;
  }
});

removeBtn.addEventListener('click', async () => {
  const formData = new FormData();
  formData.append('image', selectedFile);

  try {
    const response = await fetch(`${BACKEND_URL}/remove-bg`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to remove background.');
    }

    const data = await response.json();
    outputImage.src = `${BACKEND_URL}${data.url}`; // Use absolute URL
    downloadBtn.href = `${BACKEND_URL}${data.url}`;
    result.hidden = false;
  } catch (err) {
    alert('Error removing background. Please try again.');
    console.error(err);
  }
});
