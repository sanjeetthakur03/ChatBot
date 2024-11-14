const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
let userMessage;

// Replace with your actual Cohere API key
const COHERE_API_KEY = "your API key";

const inputIniHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbol-outlined">🤖</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const generateResponse = async (incomingChatLi) => {
    const API_URL = "https://api.cohere.ai/v1/generate";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${COHERE_API_KEY}`
        },
        body: JSON.stringify({
            model: "command-xlarge", // Model type (ensure it exists for your Cohere account)
            prompt: userMessage,
            max_tokens: 100,
            temperature: 0.75
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        console.log("Response Status:", response.status); // Log response status

        if (response.ok) {
            const data = await response.json();
            console.log("API Response:", data); // Log the actual response data
            messageElement.textContent =data.generations[0].text.trim();
        } else {
            const errorData = await response.json();
            console.log("Error Details:", errorData); // Log specific error details
            messageElement.textContent = errorData.message || "Oops! Something went wrong. Please try again.";
        }
    } catch (error) {
        console.error("Fetch Error:", error); // Log any network or runtime errors
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatInput.value = ""; // Clear input
    chatInput.style.height = `${inputIniHeight}px`;

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        generateResponse(incomingChatLi);
    }, 600);
};

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputIniHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);
