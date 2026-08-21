import { db, ref, set, get, onValue, push, update, remove } from "./db.js";

const textarea = document.getElementById('input-area');

// all lists
const namesList = document.getElementById('names-list');
const wordsList = document.getElementById('words-list');
const placesList = document.getElementById('places-list');
const verbsList = document.getElementById('verbs-list');
const sentencesList = document.getElementById('sentences-list');

// add buttons
const addBtn = document.getElementById('add-btn');

document.addEventListener('DOMContentLoaded', () => {
     textarea.focus();
});
// loadData();

textarea.addEventListener('input', () => {
     const text = textarea.value;
     if (text.includes('@@@')) {
          textarea.style.display = 'none';
          const main = document.querySelector('main');
          main.style.display = 'flex';
          loadData();
     }
});
function loadData() {
     onValue(ref(db, 'Dictionary/'), (snapshot) => {
          // Clear all lists
          namesList.innerHTML = '';
          wordsList.innerHTML = '';
          placesList.innerHTML = '';
          verbsList.innerHTML = '';
          sentencesList.innerHTML = '';

          snapshot.forEach((childSnapshot) => {
               const key = childSnapshot.key; // word-list
               const data = childSnapshot.val(); // {itemId: "word = explanation", ...}

               if (!data) return;
               let targetList = document.getElementById(key);

               Object.entries(data).forEach(([itemId, text]) => {

                    let [word, expla] = text.split('=').map(s => s.trim());
                    const li = createListItem(word, expla, itemId);

                    // li.addEventListener('click', () => {
                         li.contentEditable = true;
                         // li.focus();
                    // });
                    li.addEventListener('blur', () => updateListItem(key, itemId, li));

                    targetList.appendChild(li);
               });
          });

     });
}
function addItem(list, text) {
     const itemRef = push(ref(db, 'Dictionary/' + list.id));
     set(itemRef, text);
}

addBtn.addEventListener('click', () => {
     const selectedList = document.getElementById('word-type').value;
     const wordInput = document.getElementById('word-input');
     const inputValue = wordInput.value.trim();

     if (inputValue === '') {
          alert('Please enter a value before adding.');
          return;
     }
     addItem(selectedList, inputValue);
});

function createListItem(word, expla, id) {
     const li = document.createElement('li');
     li.dataset.itemId = id;

     const wordSpan = document.createElement('span');
     wordSpan.className = 'word';
     wordSpan.textContent = word;
     li.appendChild(wordSpan);

     const explaSpan = document.createElement('span');
     explaSpan.className = 'expla';
     explaSpan.textContent = ' = ' + expla;
     li.appendChild(explaSpan);

     return li;
}

async function updateListItem(list, id, li) {
     try {
          // li.contentEditable = false;
          const itemRef = ref(db, 'Dictionary/' + list + '/' + id);
          await set(itemRef, li.textContent);
          if (li.textContent === '') deleteListItem(li);
     } catch (error) {
          console.error('Error updating item:', error);
          alert('Failed to update item. Please try again.');
     }
};

function deleteListItem(li) {
     li.remove();
     remove(itemRef);
}

