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

// const namesBtn = document.getElementById('add-name');
// const wordsBtn = document.getElementById('add-word');
// const placesBtn = document.getElementById('add-place');
// const verbsBtn = document.getElementById('add-verb');
// const sentencesBtn = document.getElementById('add-sentence');

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
               const key = childSnapshot.key;
               const data = childSnapshot.val();

               if (!data) return;

               let targetList;

               switch (key) {
                    case 'names-list':
                         targetList = namesList;
                         break;
                    case 'words-list':
                         targetList = wordsList;
                         break;
                    case 'places-list':
                         targetList = placesList;
                         break;
                    case 'verbs-list':
                         targetList = verbsList;
                         break;
                    case 'sentences-list':
                         targetList = sentencesList;
                         break;
                    default:
                         return;
               }

               Object.entries(data).forEach(([itemId, text]) => {
                    let li = document.createElement('li');
                    li.dataset.itemId = itemId;

                    const word = document.createElement('span');
                    word.className = 'word';
                    word.textContent = text.split('=')[0].trim();
                    li.appendChild(word);
                    const space = document.createElement('span');
                    space.textContent = ' = ';
                    space.className = 'space';
                    li.appendChild(space);
                    const expla = document.createElement('span');
                    expla.className = 'expla';
                    if (text.split('=')[1]) expla.textContent = text.split('=')[1].trim();
                    li.appendChild(expla);
                    // li.addEventListener("touchmove", (e) => {
                    //      e.preventDefault();
                    //      li.querySelector('.expla').style.display = 'inline';
                    // });
                    // li.addEventListener("touchend", (e) => {
                    //      e.preventDefault();
                    //      li.querySelector('.expla').style.display = 'none';
                    // });
                    li.addEventListener('click', () => {
                         li.contentEditable = true;
                         li.focus();
                         li.removeEventListener('blur', () => { });
                         li.addEventListener('blur', async () => {
                              try {
                                   li.contentEditable = false;
                                   const itemRef = ref(db, 'Dictionary/' + key + '/' + itemId);
                                   await set(itemRef, li.textContent);
                                   if (li.textContent === '') {
                                        li.remove();
                                        remove(itemRef);
                                   }
                              } catch (error) {
                                   console.error('Error updating item:', error);
                                   alert('Failed to update item. Please try again.');
                              }
                         });
                    });

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

     switch (selectedList) {
          case 'name':
               addItem(namesList, inputValue);
               break;
          case 'word':
               addItem(wordsList, inputValue);
               break;
          case 'place':
               addItem(placesList, inputValue);
               break;
          case 'verb':
               addItem(verbsList, inputValue);
               break;
          case 'sentence':
               addItem(sentencesList, inputValue);
               break;
     }
});

// namesBtn.addEventListener('click', () => addItem(namesList));
// wordsBtn.addEventListener('click', () => addItem(wordsList));
// placesBtn.addEventListener('click', () => addItem(placesList));
// verbsBtn.addEventListener('click', () => addItem(verbsList));
// sentencesBtn.addEventListener('click', () => addItem(sentencesList));
