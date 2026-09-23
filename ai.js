const inputArea = document.getElementById("input-area");
const messages = document.getElementById("messages");
const sendButton = document.getElementById("send-button");

let chatSoFar = ''

async function handleAIResponse(text) {
  const li = document.createElement("li");
  li.classList.add("response");
  li.textContent = "Thinking...";
  messages.appendChild(li);

  try {
    const response = await fetch(
      "https://dict-ai.kushal3738.workers.dev",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text,
          ctx: chatSoFar
        })
      }
    );

    const data = await response.json();
    console.log(data);

    chatSoFar += 'ai:'+data.response;
    li.textContent = data.response;
    // scroll to bottom
    inputArea.scrollTop = messages.scrollHeight;
  } catch (err) {
    console.error("Gemini error:", err);
    li.textContent = "Error generating response.";
  }
}

async function handleUserInput() {
  if (inputArea.value.trim() !== "") {
    const text = inputArea.value;
    chatSoFar += 'user:'+text
    inputArea.value = "";

    const li = document.createElement("li");
    li.classList.add("prompt");
    li.textContent = text;
    messages.appendChild(li);
    // scroll to bottom
    inputArea.scrollTop = messages.scrollHeight;

    await handleAIResponse(text);
  }
  inputArea.focus();
}

inputArea.addEventListener("keyup", (e) => e.key === "Enter" && handleUserInput());
sendButton.addEventListener("click", handleUserInput);