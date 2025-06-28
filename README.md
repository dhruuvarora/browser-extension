# 🧠 Your Summarizer - Chrome Extension

A powerful Chrome Extension that uses the **Gemini AI API** to summarize articles and blogs directly from your browser. Choose your preferred summary style — **Brief**, **Detailed**, or **Bullet Points** — and get instant, clean insights from any web page. 🚀

---

## 📌 Features

- ✅ One-click summarization from any tab
- 🤖 Integrated with **Gemini AI API**
- 📋 Choose between:
  - 📝 **Brief** Summary
  - 📖 **Detailed** Summary
  - 🔢 **Bullet Points**
- 🎯 Clean popup UI

---

## 🧪 Summary Modes

When you click the extension icon, you can choose between:

- **Brief** – Quick TL;DR in 2–3 sentences
- **Detailed** – In-depth summary for a better understanding
- **Bullets** – Key points listed cleanly

---

## 📸 Screenshots

> _Coming soon_ — Include images of popup UI and sample summaries here.

---

## 🛠️ Installation

To install the extension manually:

1. Clone or download this repository.
2. Go to `chrome://extensions` in your Chrome browser.
3. Enable **Developer Mode** (top right).
4. Click **Load Unpacked** and select the project folder.
5. The extension icon will appear in your toolbar.

---

## 🔐 Gemini API Setup

To integrate Gemini:

1. Sign up or log in at [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Generate your **Gemini API Key**
3. Add your key in the config file (e.g., `config.js` or `background.js` depending on your implementation)

```js
// Example
const GEMINI_API_KEY = 'your-api-key-here';
