"""
Quick model retrain - save in .h5 format for maximum compatibility
"""
import pandas as pd
import pickle
from pathlib import Path
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, GlobalMaxPooling1D, Dropout
from tensorflow.keras.optimizers import Adam

DATA_DIR = Path("data")
MODEL_PATH = Path("backend/models/fake_news_lstm_model.h5")
TOKENIZER_PATH = Path("backend/models/tokenizer.pkl")
MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

MAX_WORDS = 50000
MAX_LEN = 150

print("Loading data...")
true_df = pd.read_csv(DATA_DIR / "True.csv")
fake_df = pd.read_csv(DATA_DIR / "Fake.csv")
true_df["label"] = 1
fake_df["label"] = 0
df = pd.concat([true_df, fake_df], ignore_index=True)
texts = df["title"] + " " + df["text"]
labels = df["label"]

print(f"Total: {len(texts)} samples")

print("Tokenizing...")
tokenizer = Tokenizer(num_words=MAX_WORDS)
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
X = pad_sequences(sequences, maxlen=MAX_LEN)
y = labels.values

print("Saving tokenizer...")
with open(TOKENIZER_PATH, "wb") as f:
    pickle.dump(tokenizer, f)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Building model...")
model = Sequential([
    Embedding(MAX_WORDS, 100, input_length=MAX_LEN),
    Dropout(0.5),
    LSTM(150, return_sequences=True),
    GlobalMaxPooling1D(),
    Dense(64, activation='relu'),
    Dense(1, activation='sigmoid')
])
model.compile(optimizer=Adam(0.0001), loss='binary_crossentropy', metrics=['accuracy'])

print("Training for 1 epoch...")
model.fit(X_train, y_train, epochs=1, batch_size=64, validation_split=0.1, verbose=1)

loss, acc = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Accuracy: {acc:.4f}")

print("Saving model in .h5 format...")
model.save(MODEL_PATH)
print(f"Model saved to {MODEL_PATH}")
print("Done!")
