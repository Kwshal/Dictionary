const textarea = document.getElementById('inputArea');
const names = document.getElementById('names');
const places = document.getElementById('places');
const sentences = document.getElementById('sentences');
const namesList = document.getElementById('names-list');
const placesList = document.getElementById('places-list');
const sentencesList = document.getElementById('sentences-list');
const listItems = document.querySelectorAll('#names-list li, #places-list li, #sentences-list li');

listItems.forEach(item => {
     item.contentEditable = true;
     item.addEventListener('click', e => {
          e.target.focus();
     });
     console.log("clicked");
});

textarea.addEventListener('input', () => {
     const text = textarea.value;
     if (text.includes('@@@')) {
          textarea.style.display = 'none';
          const main = document.querySelector('main');
          main.style.display = 'block';
     }
});

names.addEventListener('dblclick', () => {
     let li = document.createElement('li');
     li.contentEditable = true;
     namesList.appendChild(li);
     li.focus();
});

places.addEventListener('dblclick', () => {
     let li = document.createElement('li');
     li.contentEditable = true;
     placesList.appendChild(li);
     li.focus();
});

sentences.addEventListener('dblclick', () => {
     let li = document.createElement('li');
     li.contentEditable = true;
     sentencesList.appendChild(li);
     li.focus();
});