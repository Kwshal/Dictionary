import { db, ref, set, get, onValue, push, update, remove } from "./db.js";

const textarea = document.getElementById('input-area');

// all lists
const namesList = document.getElementById('names-list');
const thingsList = document.getElementById('things-list');
const placesList = document.getElementById('places-list');
const verbsList = document.getElementById('verbs-list');
const sentencesList = document.getElementById('sentences-list');

// add buttons
const namesBtn = document.getElementById('add-name');
const thingsBtn = document.getElementById('add-thing');
const placesBtn = document.getElementById('add-place');
const verbsBtn = document.getElementById('add-verb');
const sentencesBtn = document.getElementById('add-sentence');

document.addEventListener('DOMContentLoaded', () => {
     textarea.focus();
});

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
          thingsList.innerHTML = '';
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
                    case 'things-list':
                         targetList = thingsList;
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

                    li.textContent = text.split('=')[0];
                    const span = document.createElement('span');
                    span.className = 'expla';
                    span.textContent = " = " + text.split('=')[1];
                    li.appendChild(span);

                    li.addEventListener('dblclick', () => {
                         li.contentEditable = true;
                         li.focus();
                         li.removeEventListener('blur', () => { });
                         li.addEventListener('blur', async () => {
                         try {
                              li.contentEditable = false;
                              const itemRef = ref(db, 'Dictionary/' + key + '/' + itemId);
                              await set(itemRef, li.textContent);
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
function addItem(list) {
     let li = document.createElement('li');
     list.appendChild(li);
     li.contentEditable = true;
     li.focus();

     li.addEventListener('blur', async () => {
          try {
               let text = li.textContent.trim();
               li.contentEditable = false;
               if (text === '') {
                    li.remove();
               } else {
                    const itemRef = push(ref(db, 'Dictionary/' + list.id));
                    li.textContent = text.split('=')[0];
                    const span = document.createElement('span');
                    span.className = 'expla';
                    span.textContent = " = " + text.split('=')[1];
                    li.appendChild(span);
                    await set(itemRef, text);
               }
          } catch (error) {
               console.error('Error saving item:', error);
               alert('Failed to save item. Please try again.');
          }
     });
     li.addEventListener('dblclick', () => {
          li.contentEditable = true;
          li.focus();
          li.removeEventListener('blur', () => { });
          li.addEventListener('blur', async () => {
               try {
                    li.contentEditable = false;
                    const itemRef = ref(db, 'Dictionary/' + list.id + '/' + li.dataset.itemId);
                    await update(itemRef, li.textContent);
               } catch (error) {
                    console.error('Error updating item:', error);
                    alert('Failed to update item. Please try again.');
               }
          });
     });

}

namesBtn.addEventListener('click', () => addItem(namesList, true));
thingsBtn.addEventListener('click', () => addItem(thingsList));
placesBtn.addEventListener('click', () => addItem(placesList));
verbsBtn.addEventListener('click', () => addItem(verbsList));
sentencesBtn.addEventListener('click', () => addItem(sentencesList));
