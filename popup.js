// // File: popup.js

// document.getElementById("Summarize").addEventListener("click", () => {
//     const result = document.getElementById("result");
//     result.textContent = "Summarizing...";

//     chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
//         if (!tab?.id) {
//             result.textContent = "❌ No active tab found.";
//             return;
//         }

//         chrome.tabs.sendMessage(
//             tab.id,
//             { type: "GET_ARTICLE_TEXT" },
//             (response) => {
//                 if (chrome.runtime.lastError) {
//                     console.error("❌ Runtime Error:", chrome.runtime.lastError.message);
//                     result.textContent = "❌ Failed to connect to article. Try refreshing the tab.";
//                     return;
//                 }

//                 const articleText = response?.articleText;
//                 result.textContent = articleText
//                     ? articleText.slice(0, 300) + "..."
//                     : "No article text found.";
//             }
//         );
//     });
// });



document.getElementById("Summarize").addEventListener("click", async () => {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "🔄 Summarizing...";

  const summaryType = document.getElementById("summary-type").value;

  chrome.storage.sync.get(["geminiApiKey"], async ({ geminiApiKey }) => {
    if (!geminiApiKey) {
      resultDiv.textContent =
        "❌ API key not found. Please set your API key in the extension options.";
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab?.id) {
        resultDiv.textContent = "❌ Could not find the active tab.";
        return;
      }

      chrome.tabs.sendMessage(
        tab.id,
        { type: "GET_ARTICLE_TEXT" },
        async (res) => {
          if (chrome.runtime.lastError) {
            resultDiv.textContent =
              "❌ Content script not loaded. Please refresh the page and try again.";
            return;
          }

          const articleText = res?.articleText;
          if (!articleText) {
            resultDiv.textContent = "❌ Could not extract article text.";
            return;
          }

          try {
            const summary = await getGeminiSummary(
              articleText,
              summaryType,
              geminiApiKey
            );
            resultDiv.textContent = summary;
          } catch (error) {
            resultDiv.textContent =
              "❌ Failed to generate summary: " + error.message;
          }
        }
      );
    });
  });
});

document.getElementById("copy-btn").addEventListener("click", () => {
  const summaryText = document.getElementById("result").innerText;
  if (!summaryText.trim()) return;

  navigator.clipboard
    .writeText(summaryText)
    .then(() => {
      const copyBtn = document.getElementById("copy-btn");
      const originalText = copyBtn.innerText;
      copyBtn.innerText = "✅ Copied!";
      setTimeout(() => {
        copyBtn.innerText = originalText;
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
});

async function getGeminiSummary(text, summaryType, apiKey) {
  const truncatedText =
    text.length > 18000 ? text.slice(0, 18000) + "..." : text;

  let prompt;
  switch (summaryType) {
    case "brief":
      prompt = `Summarize the following article in 2-3 concise sentences:\n\n${truncatedText}`;
      break;
    case "detailed":
      prompt = `Provide a detailed and structured summary of the article:\n\n${truncatedText}`;
      break;
    case "bullets":
      prompt = `Summarize the article in 5-7 bullet points. Each point should start with "- ":\n\n${truncatedText}`;
      break;
    default:
      prompt = `Summarize the following article:\n\n${truncatedText}`;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Gemini API failed");
  }

  const data = await response.json();
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No summary returned by Gemini."
  );
}
