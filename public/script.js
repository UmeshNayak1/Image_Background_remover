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
    const formData = new FormData();
    formData.append('image', selectedFile);
  
    try {
      const response = await fetch(`${BACKEND_URL}/remove-bg`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove background');
      }
  
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      outputImage.src = imageUrl;
      downloadBtn.href = imageUrl;
      downloadBtn.download = 'no-bg.png';
      result.hidden = false;
    } catch (err) {
      alert('Error removing background. Please try again.');
      console.error(err);
    }
  });
  