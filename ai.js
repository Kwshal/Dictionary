import { GoogleGenAI } from "https://esm.run/@google/genai";
import { db, get, ref } from './db.js';

const inputArea = document.getElementById("input-area");
const messages = document.getElementById("messages");
const sendButton = document.getElementById("send-button");

// Initialize Gemini SDK
const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6L7ylm24vtnjhQgAJ6n0klPMRy0uy1bQRQOcww6VYWiDA" });

// Fetch Firebase Dictionary data properly
async function loadDictionary() {
  const snapshot = await get(ref(db, 'Dictionary'));
  if (snapshot.exists()) {
    return JSON.stringify(snapshot.val());
  }
  return "{}";
}

const dictWords = await loadDictionary();

const systemInstruction = `
You are a sentence generator AI specializing in creating ciphered sentences based strictly on the provided dictionary.

OPERATING MODES

1. Normal Mode (Default): Answer questions and chat normally. Keep all responses brief and concise.
2. Cipher Mode (On Demand): When the user requests a sentence, generate a sensible ciphered sentence that can be made using the provided dictionary data and dictionary data only.

CIPHER RULES

* Format: reponse must be in "<ciphered sentence> <(meaning)>" format.
* ciphered sentence must only contain words from keys in the provided dictionary not the value.
* Variety: Always generate a unique sentence that has not been used earlier in the conversation.

CONSTRAINTS
* No formatting (no bolding, italics, tables, bullet symbols, or code blocks) in outputs.
* Maintain short, concise responses at all times.

DICTIONARY DATA
${dictWords}
`;

async function respondTo(text) {
  const li = document.createElement("li");
  li.classList.add("response");
  li.textContent = "Thinking...";
  messages.appendChild(li);

  try {
    const responseStream = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: text,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    li.textContent = responseStream.text;
  } catch (err) {
    console.error("Streaming error:", err);
    li.textContent = "Error generating response.";
  }
}
function getResponse() {
  if (inputArea.value.trim() !== "") {
    const text = inputArea.value;
    inputArea.value = "";

    const li = document.createElement("li");
    li.classList.add("prompt");
    li.textContent = text;
    messages.appendChild(li);

    setTimeout(async () => {
      await respondTo(text);
    }, 1000);
  }
  inputArea.focus();
}
inputArea.addEventListener("keyup", (e) => e.key === "Enter" && getResponse());
sendButton.addEventListener("click", getResponse);