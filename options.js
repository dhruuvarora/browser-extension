// options.js
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["geminiApiKey"], ({ geminiApiKey }) => {
        if (geminiApiKey) {
            document.getElementById("api-key").value = geminiApiKey;
        }
    });

    document.getElementById("save-button").addEventListener("click", () => {
        const apiKey = document.getElementById("api-key").value.trim();
        if (!apiKey) {
            alert("Please enter a valid API Key.");
            return;
        }

        chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
            const successMsg = document.getElementById("success-message");
            successMsg.style.display = "block";
            setTimeout(() => {
                successMsg.style.display = "none";
                window.close();
            }, 1500);
        });
    });
});
