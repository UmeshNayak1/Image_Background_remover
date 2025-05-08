const upload = document.getElementById('upload');
const preview = document.getElementById('preview');
const removeBtn = document.getElementById('remove-bg');
const result = document.getElementById('result');
const outputImage = document.getElementById('output-image');
const downloadBtn = document.getElementById('download-btn');

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

  const response = await fetch('/remove-bg', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  outputImage.src = data.url;
  downloadBtn.href = data.url;
  result.hidden = false;
});
