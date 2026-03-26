# 🔍 Fake News Detector v2.0 - Production Edition

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)

**Advanced AI-powered fake news detection system with beautiful, responsive UI and production-grade backend.**

## ✨ What's New in v2.0

- ✅ **Modern React Frontend** with Framer Motion animations
- ✅ **Production FastAPI Backend** with proper architecture
- ✅ **No Code Duplication** - centralized text preprocessing
- ✅ **Type-Safe** - Full TypeScript + Python type hints
- ✅ **Beautiful UI** - Glassmorphism, smooth animations
- ✅ **Configurable** - Environment-based settings, no hardcoding
- ✅ **Fully Logged** - Comprehensive logging system
- ✅ **Error Handling** - Graceful error messages
- ✅ **API Documentation** - Auto-generated Swagger docs
- ✅ **Viva-Ready** - Perfect for college presentation

## 🚀 Quick Start

### Backend (Python)

```bash
# from repo root
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r backend/requirements.txt

# start API (recommended)
python run.py

# or directly:
# uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8000
```

Visit: `http://localhost:8000/docs` for API documentation

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:3000`

## 🏗️ Architecture

### Backend Stack
- **FastAPI**: Modern, fast web framework
- **TensorFlow/Keras**: Deep learning model
- **NLTK**: Natural language processing
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server
- **Python-dotenv**: Configuration management

### Frontend Stack
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Zustand**: State management
- **Axios**: HTTP client
- **Vite**: Build tool

## 📁 Project Structure

```
.
├── backend/             → FastAPI application
├── frontend/            → React application
├── data/                → (optional) training dataset (not committed)
├── models/              → Pre-trained models
├── scripts/             → Training and utility scripts
├── docs/                → Documentation
├── README.md            → This file
└── requirements.txt     → Python dependencies
```

> Note: `data/Fake.csv` and `data/True.csv` are **not committed** (large files). They’re only needed for training / tokenizer rebuild.

## 🎯 How It Works

```
User Input
   ↓
Validation (min 10, max 5000 chars)
   ↓
Text Preprocessing (NLTK pipeline)
   ↓
Tokenization (Keras Tokenizer)
   ↓
LSTM Model Inference
   ↓
Confidence Calculation
   ↓
Display Results with Animations
```

## 📊 Model Performance

- **Accuracy**: 95%+
- **Response Time**: <1 second
- **Training Data**: 44,000 articles
- **Architecture**: LSTM with Embedding layer
- **Output**: Binary classification (Fake/Real)

## 🎨 UI Features

- **Hero Section** - Animated landing
- **Input Area** - Text validation with progress bar
- **Result Card** - Animated predictions & confidence scores
- **History Panel** - Recent predictions sidebar
- **Info Sections** - Model architecture, limitations, FAQ
- **Smooth Animations** - Framer Motion transitions
- **Responsive Design** - Mobile, tablet, desktop optimized
- **Dark Theme** - Modern glassmorphism design

## 📚 API Endpoints

### Predictions
```
POST /api/v1/predict
{
  "text": "News article..."
}

Response:
{
  "label": "REAL",
  "confidence": 87.5,
  "prob_fake": 12.5,
  "prob_real": 87.5,
  "original_length": 256,
  "cleaned_length": 198
}
```

### Batch Predictions
```
POST /api/v1/batch-predict
{
  "texts": ["Article 1...", "Article 2..."]
}
```

### Health Check
```
GET /health
GET /api/v1/health
```

## ⚙️ Configuration

Create `backend/.env.local` (optional):
```env
DEBUG=False
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=INFO
MAX_INPUT_LENGTH=5000
MIN_INPUT_LENGTH=10
# comma-separated
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Create `frontend/.env.local` (optional):
```env
VITE_API_URL=http://localhost:8000
```

## ☁️ Deploy (Render backend + Vercel frontend)

Deploy as **two services**:
- **Backend**: Render Web Service (FastAPI/Uvicorn)
- **Frontend**: Vercel (Vite/React static site)

### 1) Deploy Backend on Render

In Render: **New → Web Service → connect your GitHub repo**.

- **Root Directory**: *(leave blank)* (repo root)
- **Runtime**: Python
- **Build Command**:
  - `pip install -r backend/requirements.txt`
- **Start Command**:
  - `uvicorn backend.api.main:app --host 0.0.0.0 --port $PORT`

Render **Environment Variables**:
- `CORS_ORIGINS`: your Vercel URL(s), comma-separated  
  Example: `https://your-app.vercel.app,https://your-app-git-main-yourname.vercel.app`
- Optional: `LOG_LEVEL=INFO`

After deploy, copy your backend public URL (example):
- `https://fake-news-detector-api.onrender.com`

### 2) Deploy Frontend on Vercel

In Vercel: **New Project → Import your GitHub repo**.

- **Root Directory**: `frontend`
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

Vercel **Environment Variables**:
- `VITE_API_URL`: your Render backend URL  
  Example: `https://fake-news-detector-api.onrender.com`

Redeploy after adding env vars.

### 3) Verify
- Open the Vercel site and run a prediction
- Backend health: `GET /health`

## 🔒 Security

- ✅ Input validation on all endpoints
- ✅ Request size limits
- ✅ CORS configuration
- ✅ No sensitive logging
- ✅ Environment-based secrets
- ✅ Type checking (Python + TypeScript)

## 📋 Limitations

1. **English Only** - Only works with English text
2. **Sequence Length** - Articles truncated/padded to 150 tokens
3. **Domain Shift** - May underperform on new domains
4. **Satire Confusion** - Difficulty distinguishing satire from lies
5. **No Source Verification** - Only analyzes text content
6. **Adversarial Text** - Can be fooled by aggressive paraphrasing

## 🚀 Future Improvements

1. **BERT/RoBERTa** - Transformer-based models
2. **Multimodal** - Image + text analysis
3. **Cross-lingual** - Support multiple languages
4. **Explainability** - LIME/SHAP integration
5. **Database** - Prediction history storage
6. **API Auth** - Authentication & rate limiting

## 📖 Documentation

See `docs/` folder for complete documentation:
- **Architecture**: `docs/ARCHITECTURE.md`
- **Quick Start**: `docs/QUICKSTART.md`
- **Animations**: `docs/ANIMATION_GUIDE.md`
- **Setup**: `docs/SETUP_GUIDE.md`
- **API Docs**: Visit `/docs` after starting backend

## 🎓 College Presentation

This project is perfect for demonstrating:
- **Deep Learning** - LSTM networks
- **Full-Stack** - Backend + Frontend
- **Frontend** - Modern React patterns
- **Backend** - FastAPI best practices
- **UI/UX** - Smooth animations
- **Type Safety** - TypeScript + Python typing

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - Use freely for educational and commercial purposes.

## 👨‍💻 Author

Built with ❤️ as a production-grade fake news detection system.

---

**Made with**: Python • TensorFlow • FastAPI • React • Tailwind • Framer Motion

**Version**: 2.0.0  
**Status**: Production Ready ✅  
**Last Updated**: 2026
