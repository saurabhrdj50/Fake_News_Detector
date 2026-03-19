import os
import pandas as pd
import re
import nltk
import pickle
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.preprocessing.text import Tokenizer
from sklearn.model_selection import train_test_split

# Download required NLTK data directly
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('omw-1.4', quiet=True)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words("english"))

def process_text(text):
    # Remove extra white spaces and special characters
    text = re.sub(r'\s+', ' ', text, flags=re.I)
    text = re.sub(r'\W', ' ', str(text))
    # Remove single characters
    text = re.sub(r'\s+[a-zA-Z]\s+', ' ', text)
    # Remove any character that isn't alphabetical
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    text = text.lower()

    # Tokenize
    words = word_tokenize(text)

    # Lemmatize, remove stopwords, and remove short words (length <= 3)
    cleaned_words = [
        lemmatizer.lemmatize(word)
        for word in words
        if word not in stop_words and len(word) > 3
    ]

    # Return as a single string for the Tokenizer
    return ' '.join(cleaned_words)

if __name__ == "__main__":
    print("Loading datasets...")
    fake_df = pd.read_csv("dataset/Fake.csv")
    true_df = pd.read_csv("dataset/True.csv")

    fake_df['label'] = 0
    true_df['label'] = 1

    columns_to_drop = ["title", "date", "subject"]
    fake_df.drop(columns=columns_to_drop, inplace=True)
    true_df.drop(columns=columns_to_drop, inplace=True)

    news_df = pd.concat([fake_df, true_df], ignore_index=True)
    news_df.drop_duplicates(inplace=True)

    print(f"Total rows after removing duplicates: {len(news_df)}")
    print("Cleaning text data... This may take a few minutes.")

    # Apply preprocessing
    news_df['clean_text'] = news_df['text'].apply(process_text)

    X = news_df['clean_text'].values
    y = news_df['label'].values

    # Train/Test Split needs to match notebook (random_state=42) so X_train matches exactly
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Fitting Tokenizer...")
    tokenizer = Tokenizer()
    tokenizer.fit_on_texts(X_train)

    vocab_size = len(tokenizer.word_index) + 1
    print("Size of vocabulary:", vocab_size)

    with open("tokenizer.pkl", "wb") as f:
        pickle.dump(tokenizer, f)
    
    print("Saved tokenizer to tokenizer.pkl successfully.")
