from tensorflow.keras.models import load_model
from meso_model import build_meso_model  # Import the model

# Load the model architecture
model = build_meso_model()

# Load the pretrained weights
model.load_weights("Meso4_DF.h5")

print("✅ Pretrained MesoNet model loaded successfully!")
