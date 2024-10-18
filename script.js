const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
let userMessage;

const API_KEY = "use you api key";

const inputIniHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbol-outlined">🎅<p></p></span>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent=message;
    return chatLi;
};

const generateResponse = async (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }]
        })
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        if (response.ok) {
            const data = await response.json();
            messageElement.textContent = data.choices[0].message.content;
        } else if (response.status === 429) {
            messageElement.textContent = "Rate limit exceeded. Please try again later.";
        } else if (response.status === 405) {
            messageElement.textContent = "Method Not Allowed. Please check the HTTP method used.";
        } else {
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        }
    } catch (error) {
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
//append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
   // chatbox.scrollTo(0,chatbox.scrollHeight);
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking....", "incoming");
        chatbox.appendChild(incomingChatLi);
       // chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}
chatInput.addEventListener("input",()=>{
    //adjust the height of the input textarea based on the content
    chatInput.style.height =`${inputIniHeight}px`;
    chatInput.style.height =`${chatInput.scrollHeight}px`;
});


chatbotToggler.addEventListener("click",()=>document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click",() => document.body.classList.remove("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);
