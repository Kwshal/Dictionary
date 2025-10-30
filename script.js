const textarea = document.getElementById('inputArea');
const namesList = document.getElementById('names-list');
const thingsList = document.getElementById('things-list');
const placesList = document.getElementById('places-list');
const verbsList = document.getElementById('verbs-list');
const sentencesList = document.getElementById('sentences-list');

const listItems = document.querySelectorAll('li');
const namesBtn = document.getElementById('add-name');
const thingsBtn = document.getElementById('add-thing');
const placesBtn = document.getElementById('add-place');
const verbsBtn = document.getElementById('add-verb');
const sentencesBtn = document.getElementById('add-sentence');    


let localData = localStorage.getItem('dictionaryData');
if (localData) {
     const data = JSON.parse(localData);
     data.forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          listItems.push(li);
     });
}
listItems.forEach(item => {
     item.addEventListener('dblclick', e => {
     item.contentEditable = true;
          e.target.focus();
     });
     item.onblur = () => {
          item.contentEditable = false;
          if (item.textContent.trim() === '') {
               item.remove();
          } else {
               item.textContent = item.textContent.trim();
          }
     };
});

textarea.addEventListener('input', () => {
     const text = textarea.value;
     if (text.includes('@@@')) {
          textarea.style.display = 'none';
          const main = document.querySelector('main');
          main.style.display = 'flex';
     }
});
function addListItem(list, btn) {
     btn.addEventListener('click', () => {

          let li = document.createElement('li');
          list.appendChild(li);
          li.contentEditable = true;
          li.focus();

          li.addEventListener('dblclick', e => {
               li.contentEditable = true;
               li.focus();
          });
          li.onblur = () => {
               li.contentEditable = false;
               if (li.textContent.trim() === '') {
                    li.remove();
               } else {
                    li.textContent = li.textContent.trim();
               }
          };
     });
}

addListItem(namesList, namesBtn);
addListItem(placesList, placesBtn);
addListItem(sentencesList, sentencesBtn);
addListItem(verbsList, verbsBtn);
addListItem(thingsList, thingsBtn);