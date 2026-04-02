"""
Script to train and save model with compatible Keras version
Run this to recreate the model file
"""

import pandas as pd
import numpy as np
import pickle
import os
from pathlib import Path
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, GlobalMaxPooling1D, Dropout
from tensorflow.keras.optimizers import Adam

# Paths
DATA_DIR = Path("data")
MODEL_PATH = Path("backend/models/fake_news_lstm_model.keras")
TOKENIZER_PATH = Path("backend/models/tokenizer.pkl")
MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

# Config
MAX_WORDS = 50000
MAX_LEN = 150
EMBEDDING_DIM = 100
LSTM_UNITS = 150
DROPOUT = 0.5
EPOCHS = 5  # Reduced for quick demo

print("Loading data...")
true_df = pd.read_csv(DATA_DIR / "True.csv")
fake_df = pd.read_csv(DATA_DIR / "Fake.csv")

true_df["label"] = 1
fake_df["label"] = 0
df = pd.concat([true_df, fake_df], ignore_index=True)

texts = df["title"] + " " + df["text"]
labels = df["label"]

print(f"Total samples: {len(texts)}")

# Tokenize
print("Tokenizing...")
tokenizer = Tokenizer(num_words=MAX_WORDS)
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
X = pad_sequences(sequences, maxlen=MAX_LEN)
y = labels.values

# Save tokenizer
print(f"Saving tokenizer to {TOKENIZER_PATH}...")
with open(TOKENIZER_PATH, "wb") as f:
    pickle.dump(tokenizer, f)

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build model
print("Building model...")
model = Sequential([
    Embedding(MAX_WORDS, EMBEDDING_DIM, input_length=MAX_LEN),
    Dropout(DROPOUT),
    LSTM(LSTM_UNITS, return_sequences=True),
    Dropout(DROPOUT),
    GlobalMaxPooling1D(),
    Dense(64, activation='relu'),
    Dropout(DROPOUT),
    Dense(1, activation='sigmoid')
])

model.compile(optimizer=Adam(learning_rate=0.0001),
              loss='binary_crossentropy',
              metrics=['accuracy'])

# Train
print(f"Training for {EPOCHS} epochs...")
history = model.fit(X_train, y_train,
                   epochs=EPOCHS,
                   batch_size=32,
                   validation_split=0.1,
                   verbose=1)

# Evaluate
loss, acc = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Accuracy: {acc:.4f}")

# Save model in both formats for compatibility
print(f"Saving model to {MODEL_PATH}...")
model.save(str(MODEL_PATH))
model.save(str(MODEL_PATH.with_suffix('.h5')))

print("Done!")
