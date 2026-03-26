# 🚀 QUICK START GUIDE - v2.0

## 5-Minute Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- Git
- Model & Tokenizer files in `backend/artifacts/`

---

## ⚙️ Backend Setup (3 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env.local

# Run the server
python -m uvicorn api.main:app --reload --port 8000
```

✅ Backend running at `http://localhost:8000`  
📚 API docs at `http://localhost:8000/docs`

---

## 🎨 Frontend Setup (2 minutes)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at `http://localhost:3000`

---

## 🧪 Test the Application

### Method 1: Browser UI
1. Open `http://localhost:3000`
2. Paste a news article
3. Click "Analyze"
4. See prediction with animation

### Method 2: API Direct
```bash
curl -X POST http://localhost:8000/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Your news article here..."}'
```

### Method 3: Python Client
```python
import requests

response = requests.post(
    'http://localhost:8000/api/v1/predict',
    json={'text': 'News article text...'}
)

print(response.json())
```

---

## 🐳 Docker Setup (1 command)

```bash
# Start both backend and frontend
docker-compose up

# Or detached mode
docker-compose up -d

# Stop
docker-compose down
```

---

## 📊 Project Structure at a Glance

```
backend/                          frontend/
├── config/settings.py           ├── src/components/
├── utils/text_processor.py       │   ├── Hero.tsx
├── utils/logger.py              │   ├── InputSection.tsx
├── services/model_service.py    │   ├── ResultCard.tsx
├── api/main.py                  │   ├── HistoryPanel.tsx
├── api/schemas.py               │   └── InfoSection.tsx
├── requirements.txt             ├── src/store/
├── .env.example                 │   └── predictionStore.ts
└── artifacts/                   ├── src/utils/
    ├── model.keras              │   └── api.ts
    └── tokenizer.pkl            ├── src/styles/
                                 │   └── globals.css
                                 └── package.json
```

---

## 🔑 Key Concepts

### Backend Architecture
- **Settings**: Centralized configuration
- **Text Processor**: Unified preprocessing
- **Model Service**: Singleton pattern for inference
- **FastAPI**: REST API with Pydantic validation
- **Logging**: Production-grade logs

### Frontend Architecture
- **React**: Component-based UI
- **Zustand**: Lightweight state management
- **Framer Motion**: 50+ smooth animations
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Full type safety

---

## 🎯 Important Files to Know

### Backend
```
backend/config/settings.py       → All configuration here
backend/utils/text_processor.py  → Text preprocessing (single source)
backend/services/model_service.py→ Model inference
backend/api/main.py              → REST API endpoints
```

### Frontend
```
frontend/src/App.tsx             → Main app structure
frontend/src/components/Hero.tsx → Landing section
frontend/src/store/predictionStore.ts → Global state
frontend/src/utils/api.ts        → API client
```

---

## 🛠️ Common Commands

### Backend
```bash
# Run development server
python -m uvicorn api.main:app --reload

# Run with logging
python -m uvicorn api.main:app --reload --log-level debug

# Check health
curl http://localhost:8000/health
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Docker
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] API docs accessible at `/docs`
- [ ] Can paste text and get prediction
- [ ] Animations are smooth
- [ ] No console errors
- [ ] Response time < 1 second
- [ ] Mobile view works

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

**Model not found:**
```
Error: Model file not found
Solution: Ensure fake_news_lstm_model.keras is in backend/artifacts/
```

**Dependencies not installing:**
```bash
# Clear pip cache
pip install --no-cache-dir -r requirements.txt
```

### Frontend Issues

**Port 3000 already in use:**
```bash
npm run dev -- --port 3001
```

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API call failing:**
```
Error: Cannot reach API
Solution: Ensure backend is running on port 8000
Check VITE_API_URL in .env.local
```

---

## 📚 Documentation Files

- **README_v2.md** - Complete overview
- **ARCHITECTURE_v2.md** - Detailed architecture
- **ANIMATION_GUIDE.md** - All animations explained
- **IMPLEMENTATION_SUMMARY.md** - What changed

---

## 🎓 For Presentation

### Quick Demo (5 minutes)
1. Open http://localhost:3000 (show beautiful UI)
2. Paste fake news sample (show validation)
3. Click analyze (show loading animation)
4. Show prediction (show animated results)
5. Show history panel (show recent predictions)
6. Scroll down (show model info & FAQ)

### Explain (10 minutes)
1. Show architecture diagram
2. Explain text preprocessing pipeline
3. Show model inference process
4. Discuss confidence scores
5. Mention limitations
6. Future improvements

### Code Review (5 minutes)
1. Show backend structure (DRY, modular)
2. Show frontend components (React patterns)
3. Explain Zustand state management
4. Show Framer Motion animations
5. Discuss type safety (TypeScript)

---

## 🚀 Next Steps

1. **Customize**: Modify colors, add your branding
2. **Deploy**: Use Docker Compose for production
3. **Extend**: Add database, authentication
4. **Improve**: Add more features from future improvements list
5. **Monitor**: Add metrics and logging

---

## 📞 Support

### If something doesn't work:
1. Check logs: `backend/logs/app.log`
2. Check console: Browser DevTools
3. Check CORS: Ensure localhost origins are allowed
4. Restart services: `docker-compose down && docker-compose up`

---

## 🎉 You're Ready!

Everything is set up and ready to go. Start the servers and begin using the application!

**Happy detecting! 🔍**

