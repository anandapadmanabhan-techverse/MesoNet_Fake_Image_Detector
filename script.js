// Trigger the hidden file input when the user clicks "Upload Image"
function triggerFileInput() {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  }
  
  // Called after the user selects a file, we update the preview
  document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const preview = document.getElementById('preview');
        preview.src = e.target.result;
        preview.classList.remove('hidden');
        // Show the predict button and container
        document.getElementById('predictionSection').classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });
  
  function uploadImage() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
  
    if (!file) {
      alert("Please select an image first.");
      return;
    }
  
    const formData = new FormData();
    formData.append('image', file);
  
    fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Reveal results section
      const resultsSection = document.getElementById('resultsSection');
      resultsSection.classList.remove('hidden');
  
      if (data.error) {
        document.getElementById('result').innerText = `Error: ${data.error}`;
        document.getElementById('confidence').innerText = '';
        document.getElementById('metadata').innerText = '';
      } else {
        document.getElementById('result').innerText = `Prediction: ${data.result}`;
        document.getElementById('confidence').innerText = `Accuracy: ${data.accuracy}%`;
        document.getElementById('metadata').innerText = `Metadata: ${JSON.stringify(data.metadata, null, 2)}`;
      }
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById('result').innerText = "Error processing the image.";
    });
  }
  