"""
Quick model retrain - using subset of data to save memory
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
MODEL_PATH = Path("backend/models/fake_news_lstm_model.keras")
TOKENIZER_PATH = Path("backend/models/tokenizer.pkl")
MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)

MAX_WORDS = 30000
MAX_LEN = 150
SAMPLE_SIZE = 10000

print("Loading data...")
true_df = pd.read_csv(DATA_DIR / "True.csv")
fake_df = pd.read_csv(DATA_DIR / "Fake.csv")
true_df["label"] = 1
fake_df["label"] = 0
df = pd.concat([true_df, fake_df], ignore_index=True)

# Sample data to reduce memory usage
if len(df) > SAMPLE_SIZE:
    df = df.sample(n=SAMPLE_SIZE, random_state=42)
    print(f"Sampled to {SAMPLE_SIZE} rows")

texts = df["title"].fillna("") + " " + df["text"].fillna("")
labels = df["label"]

print(f"Total: {len(texts)} samples")

print("Tokenizing...")
tokenizer = Tokenizer(num_words=MAX_WORDS)
tokenizer.fit_on_texts(texts.tolist())
sequences = tokenizer.texts_to_sequences(texts.tolist())
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
    LSTM(64, return_sequences=True),
    GlobalMaxPooling1D(),
    Dense(32, activation='relu'),
    Dense(1, activation='sigmoid')
])
model.compile(optimizer=Adam(0.001), loss='binary_crossentropy', metrics=['accuracy'])

print("Training for 1 epoch...")
model.fit(X_train, y_train, epochs=1, batch_size=32, validation_split=0.1, verbose=1)

loss, acc = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Accuracy: {acc:.4f}")

print("Saving model...")
model.save(str(MODEL_PATH))
model.save(str(MODEL_PATH.with_suffix('.h5')))
print(f"Model saved to {MODEL_PATH}")
print("Done!")
