# 🔍 Real-Time Fake News Detection using Deep Learning

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/saurabhrdj50/Fake_News_Detector)

> **Tech Stack:** Python · TensorFlow / Keras · LSTM Neural Networks · NLTK · Streamlit

---

## 📁 Project Structure

```
Fake_News_Detector/
├── fake_news_lstm.py          # Jupyter-to-Python script for LSTM training
├── fake_news_lstm.ipynb       # Original Notebook with EDA & Model Training
├── build_tokenizer.py         # Script to generate the tokenizer artifact
├── app.py                     # Streamlit web app for real-time inference
├── requirements.txt           # Python dependencies
├── README.md                  # This file
├── fake_news_lstm_model.keras # Pre-trained Keras LSTM model
└── tokenizer.pkl              # ← generated after running build_tokenizer.py
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Python 3.9 – 3.11

### 2. Create a virtual environment (recommended)
```bash
python -m venv venv

# Activate
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Download datasets (if not already present)
Ensure `Fake.csv` and `True.csv` are present in the `dataset/` folder.
If missing, download from Kaggle:
- https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset

---

## 🚀 Running the Project

### Step A – Build the Tokenizer
Before running the Streamlit app, you must generate the missing `tokenizer.pkl` file so the app knows how to convert words to integer sequences (matching the vocabulary learned by the model).
```bash
python build_tokenizer.py
```
**This will:**
1. Load `Fake.csv` and `True.csv` from the `dataset/` directory.
2. Clean and preprocess the text using NLTK (Stopwords removal, Lemmatization).
3. Fit a Keras `Tokenizer` on the training dataset to build the vocabulary.
4. Save `tokenizer.pkl` to the root directory for the app to use.

### Step B – Launch the Streamlit App
```bash
streamlit run app.py
```
Open your browser at **http://localhost:8501**

---

## 🧪 Sample Test Inputs

### Fake News Example
```
SHOCKING: Scientists CONFIRM that 5G towers are secretly spreading a new
virus to control the population! Government hiding the TRUTH from you.
Share before deleted!
```
Expected: **FAKE ❌** with very high confidence

### Real News Example
```
The Federal Reserve raised interest rates by 25 basis points on Wednesday,
citing persistent inflation concerns. Fed Chair stated officials remain
data-dependent going forward and did not rule out further hikes.
```
Expected: **REAL ✅** with high confidence

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FAKE NEWS DETECTION SYSTEM                   │
└─────────────────────────────────────────────────────────────────┘

  [NEWS SOURCES]        [INGESTION]       [PROCESSING]
  ┌──────────┐         ┌─────────┐       ┌──────────────────┐
  │ Web APIs │──────►  │  Kafka  │──────►│  Spark Streaming │
  │ RSS Feed │         │ Broker  │       │  (micro-batches) │
  │ Scrapers │         └─────────┘       └────────┬─────────┘
  └──────────┘                                    │
                                                  ▼
                                    ┌─────────────────────────┐
                                    │    NLP PIPELINE          │
                                    │  lowercase → remove      │
                                    │  punct → tokenize →      │
                                    │  remove stopwords →      │
                                    │  pad_sequences (150)     │
                                    └────────────┬────────────┘
                                                 │
                                                 ▼
                                    ┌────────────────────────┐
                                    │     ML MODEL           │
                                    │  Keras LSTM Network    │
                                    │  (Embedding + LSTM)    │
                                    └────────────┬───────────┘
                                                 │
                             ┌───────────────────┼──────────────────┐
                             ▼                   ▼                  ▼
                      ┌──────────┐        ┌──────────┐      ┌────────────┐
                      │Cassandra │        │Dashboard │      │  Alerts /  │
                      │  Store   │        │(Streamlit│      │  Email     │
                      └──────────┘        └──────────┘      └────────────┘

  OFFLINE TRAINING PATH:
  Fake.csv + True.csv → Pandas ETL → Tokenizer → Deep Learning (LSTM) → fake_news_lstm_model.keras
```

---

## ⚠️ Limitations

| # | Limitation | Detail |
|---|-----------|--------|
| 1 | Sequence Length Bounds | We pad/truncate sequences to exactly 150 tokens. Unusually long articles may lose context towards the very end. |
| 2 | Domain shift | A model trained on political/world news may fail on strictly health or sports misinformation. |
| 3 | Adversarial text | Bad actors can attempt to fool the embeddings by paraphrasing context aggressively. |
| 4 | Satire vs. lies | Satirical articles are factually false but not malicious; models often misclassify them as fake news. |
| 5 | English only | This model only handles English text. |
| 6 | No source verification | The prediction relies purely on textual content rather than the credibility of the news source URL. |
| 7 | Dataset bias | Training data reflects the inherent biases of the humans who sourced and labeled it. |

---

## 🚀 Future Improvements

1. **BERT / RoBERTa** – Utilizing Transformer-based bidirectional embeddings could capture deeper context than LSTMs.
2. **Real Kafka Integration** – Replace the simulated stream with a fully active Kafka producer/consumer and Spark Structured Streaming loop.
3. **Multimodal Analysis** – Combine text with image analysis (deepfake/metadata detection) for articles with featured media.
4. **Explainability (SHAP / LIME)** – Provide a visual heat map to users indicating which tokens influenced the prediction most heavily.
5. **Cross-lingual Models** – Use mBERT or XLM-R to flag fake news in multiple languages.

---

## 🎓 Viva Q&A

See the **Streamlit app** → expand the "Viva Questions & Answers" section directly within the user interface for 10 detailed Q&A pairs covering LSTMs, Embeddings, NLTK constraints, and ethics.

---

## 📜 License
MIT — for educational purposes.
