# =============================================================================
# Real-Time Fake News Detection using Big Data Analytics
# FILE: app.py
# DESCRIPTION: Streamlit web application with real-time prediction,
#              confidence scores, and simulated streaming.
# =============================================================================

import re
import time
import pickle
import random
import numpy as np
import nltk
import streamlit as st

nltk.download("stopwords", quiet=True)
nltk.download("punkt",     quiet=True)
nltk.download("punkt_tab", quiet=True)
nltk.download("wordnet",   quiet=True)
nltk.download("omw-1.4",   quiet=True)

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

STOP_WORDS = set(stopwords.words("english"))
lemmatizer = WordNetLemmatizer()

# ─────────────────────────────────────────────
# Page config  (must be first Streamlit call)
# ─────────────────────────────────────────────
st.set_page_config(
    page_title="Fake News Detector",
    page_icon="🔍",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─────────────────────────────────────────────
# Custom CSS
# ─────────────────────────────────────────────
st.markdown("""
<style>
  /* ── Global ───────────────────────── */
  html, body, [class*="css"] { font-family: 'Segoe UI', sans-serif; }

  /* ── Header banner ────────────────── */
  .header-banner {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white; border-radius: 16px; padding: 2rem 2.5rem; margin-bottom: 1.5rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .header-banner h1 { font-size: 2.2rem; margin: 0; }
  .header-banner p  { color: #a0aec0; margin: 0.4rem 0 0; font-size: 1rem; }

  /* ── Result boxes ─────────────────── */
  .result-fake {
      background: linear-gradient(135deg, #ff416c, #ff4b2b);
      color: white; border-radius: 14px; padding: 1.5rem 2rem;
      font-size: 1.5rem; font-weight: 700; text-align: center;
      box-shadow: 0 4px 20px rgba(255,65,108,0.4); margin-top: 1rem;
  }
  .result-real {
      background: linear-gradient(135deg, #11998e, #38ef7d);
      color: white; border-radius: 14px; padding: 1.5rem 2rem;
      font-size: 1.5rem; font-weight: 700; text-align: center;
      box-shadow: 0 4px 20px rgba(56,239,125,0.4); margin-top: 1rem;
  }

  /* ── Metric cards ─────────────────── */
  .metric-card {
      background: #f8fafc; border: 1px solid #e2e8f0;
      border-radius: 12px; padding: 1rem 1.2rem; text-align: center;
  }
  .metric-card .label { font-size: 0.8rem; color: #718096; text-transform: uppercase; }
  .metric-card .value { font-size: 1.6rem; font-weight: 700; color: #1a202c; }

  /* ── Stream log ───────────────────── */
  .stream-box {
      background: #0d1117; color: #39d353; font-family: 'Courier New', monospace;
      font-size: 0.82rem; border-radius: 10px; padding: 1rem 1.2rem;
      height: 180px; overflow-y: auto; border: 1px solid #30363d;
  }
  
  /* ── Info pills ───────────────────── */
  .pill {
      display: inline-block; padding: 0.25rem 0.75rem;
      border-radius: 999px; font-size: 0.78rem; font-weight: 600;
      margin: 0.2rem;
  }
  .pill-blue  { background: #ebf8ff; color: #2b6cb0; }
  .pill-green { background: #f0fff4; color: #276749; }
  .pill-red   { background: #fff5f5; color: #9b2335; }
</style>
""", unsafe_allow_html=True)


# =============================================================================
# Helpers
# =============================================================================
@st.cache_resource(show_spinner="Loading ML artifacts…")
def load_artifacts():
    """Load the saved Keras model and tokenizer (cached across sessions)."""
    try:
        model = load_model("fake_news_lstm_model.keras")
        with open("tokenizer.pkl", "rb") as f:
            vec = pickle.load(f)
        return model, vec, None
    except Exception as e:
        return None, None, str(e)


def clean_text(text: str) -> str:
    """Same cleaning pipeline used during training."""
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
        if word not in STOP_WORDS and len(word) > 3
    ]

    return " ".join(cleaned_words)


def predict(text: str, model, vectorizer):
    """
    Returns (label_str, confidence_pct, proba_fake, proba_real).
    """
    cleaned   = clean_text(text)
    sequences = vectorizer.texts_to_sequences([cleaned])
    features  = pad_sequences(sequences, maxlen=150)
    
    # LSTM returns single sigmoid prediction for shape (1,1)
    # The output is probability of being REAL (label=1)
    pred_val = float(model.predict(features)[0][0])
    
    label_str = "REAL ✅" if pred_val > 0.5 else "FAKE ❌"
    
    proba_real = pred_val * 100.0
    proba_fake = (1.0 - pred_val) * 100.0
    
    confidence = max(proba_real, proba_fake)
    return label_str, confidence, proba_fake, proba_real


# =============================================================================
# STEP 8 – Simulated Real-Time Streaming
# =============================================================================
def simulate_stream(text: str, placeholder):
    """
    Simulates a Kafka → Spark Streaming pipeline by processing the input
    word-by-word with a small delay and printing log messages.

    In a real deployment:
      Producer  : news-scraper → Kafka topic 'news-stream'
      Consumer  : Spark Structured Streaming reads from Kafka
      Transform : apply clean_text() per micro-batch
      Predict   : broadcast model to executors, call model.predict()
      Sink      : write results to Cassandra / dashboard
    """
    words   = text.split()
    log     = []
    n       = len(words)

    for i, word in enumerate(words[:20]):   # cap demo at 20 tokens
        log.append(f"[Kafka offset {random.randint(1000,9999)}] token received → '{word}'")
        stream_html = "<br>".join(log[-8:])   # show last 8 lines
        placeholder.markdown(
            f'<div class="stream-box">{stream_html}</div>',
            unsafe_allow_html=True)
        time.sleep(0.07)

    log.append(f"── Micro-batch complete: {min(n,20)} tokens processed ──")
    log.append("── Sending to Spark executor for prediction … ──")
    stream_html = "<br>".join(log[-8:])
    placeholder.markdown(
        f'<div class="stream-box">{stream_html}</div>',
        unsafe_allow_html=True)


# =============================================================================
# SIDEBAR
# =============================================================================
with st.sidebar:
    st.image("https://img.icons8.com/fluency/96/news.png", width=64)
    st.markdown("## ⚙️ Settings")

    show_stream = st.toggle("Simulate Kafka Streaming", value=True)
    show_arch   = st.toggle("Show System Architecture", value=False)

    st.markdown("---")
    st.markdown("### 📋 Sample Inputs")

    sample_fake = (
        "SHOCKING: Scientists CONFIRM that 5G towers are secretly "
        "spreading a new virus to control the population! "
        "Government hiding the TRUTH from you. Share before deleted!"
    )
    sample_real = (
        "The Federal Reserve raised interest rates by 25 basis points "
        "on Wednesday, citing persistent inflation concerns. "
        "Fed Chair stated officials remain data-dependent going forward."
    )

    if st.button("📰 Load Fake Sample"):
        st.session_state["news_input"] = sample_fake
    if st.button("📰 Load Real Sample"):
        st.session_state["news_input"] = sample_real

    st.markdown("---")
    st.markdown("### ℹ️ About")
    st.markdown("""
    **Tech Stack**  
    <span class='pill pill-blue'>TensorFlow/Keras</span>
    <span class='pill pill-blue'>LSTM Network</span>
    <span class='pill pill-green'>Word Embeddings</span>
    <span class='pill pill-green'>Python NLTK</span>
    <span class='pill pill-red'>Streamlit</span>
    """, unsafe_allow_html=True)


# =============================================================================
# MAIN PAGE
# =============================================================================
st.markdown("""
<div class="header-banner">
  <h1>🔍 Real-Time Fake News Detector</h1>
  <p>Powered by Deep Learning · LSTM Neural Networks · TensorFlow · Streamlit</p>
</div>
""", unsafe_allow_html=True)

# ── Load model ────────────────────────────────────────────────────────────────
model, vectorizer, load_error = load_artifacts()

if load_error:
    st.error(f"⚠️ Could not load model artifacts: **{load_error}**\n\n"
             "Please run `python build_tokenizer.py` first to generate "
             "`tokenizer.pkl`.")
    st.stop()

st.success("✅ Model loaded successfully!", icon="🤖")

# ── Input area ────────────────────────────────────────────────────────────────
st.markdown("### 📝 Enter News Article")
default_val = st.session_state.get("news_input", "")
news_input  = st.text_area(
    label="Paste a news headline or full article below:",
    value=default_val,
    height=160,
    placeholder="e.g. 'Scientists discover new treatment for Alzheimer's disease …'",
    key="news_input",
)

col_btn, col_clear = st.columns([1, 5])
with col_btn:
    check = st.button("🔍 Check News", type="primary", use_container_width=True)
with col_clear:
    if st.button("🗑️ Clear", use_container_width=False):
        st.session_state["news_input"] = ""
        st.rerun()

# ── Prediction ────────────────────────────────────────────────────────────────
if check:
    if not news_input.strip():
        st.warning("⚠️ Please enter some text before clicking 'Check News'.")
    else:
        # ── Streaming simulation ──────────────────────────────────────────
        if show_stream:
            st.markdown("#### 📡 Simulated Kafka → Spark Stream")
            stream_placeholder = st.empty()
            simulate_stream(news_input, stream_placeholder)

        # ── Run prediction ────────────────────────────────────────────────
        with st.spinner("Analysing article …"):
            time.sleep(0.4)   # small UX pause
            label, confidence, prob_fake, prob_real = predict(
                news_input, model, vectorizer)

        # ── Result banner ─────────────────────────────────────────────────
        css_class = "result-real" if "REAL" in label else "result-fake"
        st.markdown(
            f'<div class="{css_class}">Prediction: {label}</div>',
            unsafe_allow_html=True)

        # ── Metrics row ───────────────────────────────────────────────────
        st.markdown("#### 📊 Confidence Breakdown")
        m1, m2, m3 = st.columns(3)
        with m1:
            st.markdown(f"""
            <div class="metric-card">
              <div class="label">Overall Confidence</div>
              <div class="value">{confidence:.1f}%</div>
            </div>""", unsafe_allow_html=True)
        with m2:
            st.markdown(f"""
            <div class="metric-card">
              <div class="label">P(Fake)</div>
              <div class="value" style="color:#e53e3e">{prob_fake:.1f}%</div>
            </div>""", unsafe_allow_html=True)
        with m3:
            st.markdown(f"""
            <div class="metric-card">
              <div class="label">P(Real)</div>
              <div class="value" style="color:#38a169">{prob_real:.1f}%</div>
            </div>""", unsafe_allow_html=True)

        # ── Progress bars ─────────────────────────────────────────────────
        st.markdown(" ")
        st.markdown("**Fake probability**")
        st.progress(prob_fake / 100)
        st.markdown("**Real probability**")
        st.progress(prob_real / 100)

        # ── Word count info ───────────────────────────────────────────────
        wc = len(news_input.split())
        st.info(f"📝 Article word count: **{wc}** words  |  "
                f"Cleaned token count: **{len(clean_text(news_input).split())}** tokens")

# ── System Architecture diagram ───────────────────────────────────────────────
if show_arch:
    st.markdown("---")
    st.markdown("### 🏗️ System Architecture")
    st.code("""
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
""", language="text")

# ── Limitations & Future Work ─────────────────────────────────────────────────
with st.expander("⚠️ Limitations of Fake News Detection"):
    st.markdown("""
| # | Limitation | Detail |
|---|-----------|--------|
| 1 | **Context blindness** | TF-IDF treats text as a bag of words; it ignores word order and context. |
| 2 | **Domain shift** | A model trained on political news may fail on health or sports misinformation. |
| 3 | **Adversarial text** | Bad actors can paraphrase fake news to evade keyword-based detectors. |
| 4 | **Satire vs. lies** | Satirical articles are factually false but not malicious; models often misclassify them. |
| 5 | **Multilingual gap** | This model only handles English; cross-lingual fake news is untouched. |
| 6 | **No source verification** | We only analyse text; the credibility of the news source is ignored. |
| 7 | **Dataset bias** | Training data reflects the biases of whoever labelled it. |
""")

with st.expander("🚀 Future Improvements"):
    st.markdown("""
1. **BERT / RoBERTa** – Transformer models capture semantic meaning and long-range context far better than TF-IDF.
2. **Graph Neural Networks** – Model the social-sharing graph of an article (who shares what) to detect coordinated inauthentic behaviour.
3. **Real-Time Kafka Integration** – Replace the simulation with a live Kafka producer/consumer loop and Spark Structured Streaming.
4. **Multimodal Analysis** – Combine text with image analysis (deepfake detection, manipulated photos).
5. **Source Credibility Score** – Integrate a database of known credible/non-credible outlets.
6. **Explainability (LIME / SHAP)** – Highlight which words contributed most to the prediction.
7. **Active Learning** – Let human fact-checkers correct predictions and retrain the model continuously.
8. **Cross-lingual models** – Use mBERT or XLM-RoBERTa for non-English news.
""")

with st.expander("🎓 Viva Questions & Answers"):
    st.markdown("""
**Q1. Why use Deep Learning (LSTM) instead of traditional ML (Logistic Regression)?**  
LSTMs are designed to capture sequence information and context, letting the model understand how words relate to each other in a sentence, which simple bag-of-words models like Logistic Regression miss.

**Q2. What is an Embedding Layer and why is it used here?**  
The embedding layer maps discrete words (as integer IDs) into continuous, dense vector spaces where semantically similar words are placed close together. It provides richer representation than TF-IDF.

**Q3. Why merge title and text?**  
Headlines contain strong sentiment/clickbait signals. Combining them gives the model more evidence to distinguish fake from real.

**Q4. Why use Padding for the sequences?**  
Neural networks require fixed-size inputs per batch. `pad_sequences` ensures all articles are exactly the same length (e.g., 150 tokens), either by truncating longer ones or padding shorter ones with zeros.

**Q5. What is F1 score and when is it preferred over accuracy?**  
F1 is the harmonic mean of precision and recall. It is preferred when classes are imbalanced because accuracy can be misleadingly high by always predicting the majority class.

**Q6. How would you integrate Kafka for real-time detection?**  
A Kafka producer publishes scraped articles to a topic. Spark Structured Streaming consumes the topic, applies the NLP pipeline in each micro-batch, broadcasts the pickled model to executors, and writes predictions to a sink (e.g., Cassandra or a live dashboard).

**Q7. What are the ethical concerns in fake news detection?**  
Over-censorship risk, political/cultural bias in training labels, lack of transparency, and the possibility of being weaponised for censorship by authoritarian actors.

**Q8. What makes LSTM different from a standard RNN?**  
LSTMs use gating mechanisms (input, forget, and output gates) to regulate the flow of information, allowing them to mitigate the vanishing gradient problem and remember long-term dependencies.

**Q9. What would BERT improve over an LSTM?**  
BERT uses bidirectional contextual embeddings and attention mechanisms. Unlike LSTMs which process text sequentially, BERT analyzes the entire sentence at once, allowing for a much deeper understanding of nuance and context.

**Q10. What is the vocabulary size and why isn't it infinite?**  
The tokenizer learns a vocabulary limited by the raw text it sees during training. Allowing infinite or exceedingly large vocabularies increases embedding matrix size dramatically, leading to slower training and overfitting.
""")

st.markdown("---")
st.caption("Built with ❤️ · TensorFlow · Keras · Streamlit · NLTK")
