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

          // console.log(`Loading data from Firebase...`, snapshot.val());

          snapshot.forEach((childSnapshot) => {
               const key = childSnapshot.key; // word-list
               // console.log(`Loading data for list: ${key}`, typeof key);
               const data = childSnapshot.val(); // {itemId: "word = explanation", ...}

               if (!data || !key) return;
               let targetList = document.getElementById(key);

               Object.entries(data).forEach(([itemId, text]) => {

                    let [word, expla] = text.split('=').map(s => s.trim());
                    const li = createListItem(word, expla, itemId);

                    // li.addEventListener('click', () => {
                    li.contentEditable = true;
                    // li.focus();
                    // });
                    li.addEventListener('blur', () => updateListItem(key, itemId, li));
                    // console.log(key, );
                    targetList.appendChild(li);
               });
          });

     });
}
function addItem(list, text) {
     const itemRef = push(ref(db, 'Dictionary/' + list));
     set(itemRef, text);
     // console.log(`Added item to ${list.id}: ${text}`);
}

const wordInput = document.getElementById('word-input');
const selectedList = document.getElementById('word-type');
document.querySelectorAll('h5').forEach(h5 => {
     h5.addEventListener('click', () => {
          let list = document.getElementById(h5.id.replace('-heading', '-list'));
          wordInput.focus();
          selectedList.value = list.id;
          // console.log(`Selected list: ${selectedList.value}`, list, 5);
     });
});

addBtn.addEventListener('click', () => {
     const inputValue = wordInput.value.trim();
     // console.log(`Adding item to ${selectedList}: ${inputValue}`);
     inputValue && addItem(selectedList.value, inputValue);
     wordInput.value = '';
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
          if (li.textContent === '') deleteListItem(li, itemRef);
     } catch (error) {
          console.error('Error updating item:', error);
          alert('Failed to update item. Please try again.');
     }
};

function deleteListItem(li, itemRef) {
     li.remove();
     remove(itemRef);
}

