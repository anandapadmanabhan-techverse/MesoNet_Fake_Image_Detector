from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.preprocessing import image
import numpy as np
from io import BytesIO
from meso import model  # This should run meso.py, which loads the model

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def preprocess_image(file):
    # Convert the file stream to a BytesIO object
    file_bytes = BytesIO(file.read())
    file_bytes.seek(0)
    
    # Load the image with the right target size from the BytesIO object
    img = image.load_img(file_bytes, target_size=(256, 256))
    
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # add batch dimension
    img_array /= 255.0  # normalize pixel values
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    try:
        img_array = preprocess_image(file)
        prediction = model.predict(img_array)
        # Convert prediction to a label and compute confidence
        result = "Real" if prediction[0][0] > 0.5 else "Fake"
        confidence = float(prediction[0][0]) if result == "Real" else 1 - float(prediction[0][0])
        
        # For demonstration, metadata is left empty
        metadata = {}

        return jsonify({
            'result': result,
            'accuracy': round(confidence * 100, 2),
            'metadata': metadata
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
