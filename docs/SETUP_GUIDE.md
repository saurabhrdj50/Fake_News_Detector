# 🚀 SETUP GUIDE - Fake News Detector v2.0

## ✅ QUICK START (Tested & Working)

### Backend Setup

**Step 1: Create Virtual Environment**
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Linux/Mac:
source venv/bin/activate
```

**Step 2: Install Dependencies**
```bash
pip install -r requirements.txt
```

This installs:
- FastAPI
- TensorFlow
- NLTK
- Pydantic
- python-dotenv
- And more...

**Step 3: Copy Environment File (Optional)**
```bash
cp .env.example .env.local
```

**Step 4: Run Backend from Project Root**
```bash
# Navigate back to project root
cd ..

# Run using the provided script
python run_backend.py
```

**Expected Output:**
```
INFO:     Will watch for changes in these directories: [...]
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

✅ Backend is now running on `http://localhost:8000`

### Access API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

---

### Frontend Setup

**In a NEW terminal:**

**Step 1: Navigate to Frontend**
```bash
cd frontend
```

**Step 2: Install Dependencies**
```bash
npm install
```

**Step 3: Create Environment File (Optional)**
```bash
echo "VITE_API_URL=http://localhost:8000" > .env.local
```

**Step 4: Start Development Server**
```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ Frontend is now running on `http://localhost:5173` (or whatever port is shown)

---

## 🎯 Test the Application

### 1. Open Frontend
Visit: `http://localhost:3000` (if running on port 3000) or the URL shown above

### 2. Paste a News Article
```
SHOCKING: Scientists CONFIRM that 5G towers are secretly spreading a new virus 
to control the population! Government hiding the TRUTH from you. Share before deleted!
```

### 3. Click "Analyze"
Watch the smooth animations as the prediction is calculated.

### 4. See Results
Should show:
- **Label**: FAKE ❌ or REAL ✅
- **Confidence**: 85-99%
- **Probability Breakdown**: Fake vs Real percentages

---

## 📝 File Locations Explained

```
backend/
├── artifacts/
│   ├── fake_news_lstm_model.keras       (108 MB) - Pre-trained model
│   └── tokenizer.pkl                    (3.8 MB) - Tokenizer
├── config/settings.py                   - Configuration
├── utils/text_processor.py              - Text preprocessing
├── services/model_service.py            - Model inference
└── api/main.py                          - FastAPI routes

frontend/
├── src/components/                      - React components
├── src/utils/api.ts                     - API client
└── src/store/predictionStore.ts         - State management

logs/
└── app.log                              - Application logs

run_backend.py                           - Backend starter script
```

---

## ⚙️ Configuration

### Backend Environment Variables (`backend/.env.local`)

```env
DEBUG=False                  # Development mode
HOST=0.0.0.0               # Server host
PORT=8000                  # Server port
LOG_LEVEL=INFO             # Logging level
MAX_INPUT_LENGTH=5000      # Max article length
MIN_INPUT_LENGTH=10        # Min article length
```

### Frontend Environment Variables (`frontend/.env.local`)

```env
VITE_API_URL=http://localhost:8000    # Backend URL
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "ModuleNotFoundError: No module named 'backend'"**
- ✅ Solution: Run `python run_backend.py` from project root, not from `backend/` directory

**Error: "Port 8000 already in use"**
```bash
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :8000
kill -9 <PID>
```

**Error: "Model not found"**
- Ensure `backend/artifacts/fake_news_lstm_model.keras` exists
- Ensure `backend/artifacts/tokenizer.pkl` exists

**Error: "tensorflow" not installed**
```bash
pip install tensorflow --upgrade
```

### Frontend Issues

**Error: "Port already in use"**
```bash
npm run dev -- --port 3001
```

**Error: "Cannot reach API"**
- Ensure backend is running on port 8000
- Check `VITE_API_URL` in `frontend/.env.local`
- Check browser console for CORS errors

**Error: "Module not found"**
```bash
rm -rf node_modules
npm install
```

---

## 🚀 Docker Setup (Alternative)

If you prefer to use Docker:

```bash
# From project root
docker-compose up
```

This will:
- Start backend on port 8000
- Start frontend on port 3000
- Handle all dependencies automatically

---

## 📊 Verification Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] Can visit API docs at /docs
- [ ] Can paste text and get prediction
- [ ] Animations are smooth
- [ ] No console errors
- [ ] Response time < 1 second

---

## 🎯 API Quick Reference

### Make a Prediction
```bash
curl -X POST http://localhost:8000/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Your news article text here..."}'
```

### Response Example
```json
{
  "label": "FAKE",
  "confidence": 92.5,
  "prob_fake": 92.5,
  "prob_real": 7.5,
  "original_length": 145,
  "cleaned_length": 98
}
```

### Health Check
```bash
curl http://localhost:8000/health
```

---

## 📚 Next Steps

1. **Explore the UI** - Try different articles
2. **Check the Code** - Review the architecture
3. **Read Documentation** - See README_v2.md
4. **Customize** - Modify colors, add features
5. **Deploy** - Use Docker for production

---

## 💡 Tips

1. **Hot Reload**: Both servers support auto-reload on file changes
2. **API Docs**: Use Swagger UI at `/docs` to test endpoints
3. **Logs**: Check `backend/logs/app.log` for debugging
4. **Browser DevTools**: Use Network tab to inspect API calls
5. **Terminal**: Keep both terminals open to see logs

---

## 🎉 You're Ready!

Everything should be working now. Start both servers and enjoy the application!

**Questions?** Check the documentation files:
- README_v2.md
- ARCHITECTURE_v2.md
- QUICKSTART.md

