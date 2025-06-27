// background.js

chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.sync.get(["geminyApiKey"],(result)=>{
        if(!result.geminiApiKey){
            chrome.tabs.create({url:"options.html"});
        }
    })
})