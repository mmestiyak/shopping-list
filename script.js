const shoppingForm = document.querySelector('.shopping-form');
const list = document.querySelector('.list');
const listItemDeleteIcon = document.querySelector('.list__item__delete');
let state = [];

shoppingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (e.target.name.value !== '') {
    state.push({
      id: Date.now(),
      item: e.target.name.value,
      complete: false,
    });
  }
  e.target.reset();
  list.dispatchEvent(new CustomEvent('listUpdated'));
});

function displayList(e) {
  const items = state.map((item) => {
    return `
       <li class="list__item">
          <input " ${item.complete && 'checked'}  data-id='${
      item.id
    }' type="checkbox"/>

         <span style="text-decoration: ${
           item.complete ? 'line-through' : 'none'
         }">  ${item.item} </span>
         
          <span data-id='${item.id}' class="list__item__delete"> &times </span
       </li>
    `;
  });
  list.innerHTML = items.join('');
}

function mirrorToLocalStorage() {
  localStorage.setItem('items', JSON.stringify(state));
}

list.addEventListener('listUpdated', displayList);
list.addEventListener('listUpdated', mirrorToLocalStorage);

function removeItem(id) {
  let newList = state.filter((item) => item.id !== id);
  state = newList;
  list.dispatchEvent(new CustomEvent('listUpdated'));
}

function markAsComplete(id) {
  let itemRef = state.find((item) => item.id === id);
  itemRef.complete = !itemRef.complete;
  list.dispatchEvent(new CustomEvent('listUpdated'));
}

list.addEventListener('click', (e) => {
  if (e.target.matches('span')) {
    removeItem(Number(e.target.dataset.id));
  }
  if (e.target.matches('[type="checkbox"]')) {
    markAsComplete(Number(e.target.dataset.id));
  }
});

function restoreFromLocalStorage() {
  state = [...JSON.parse(localStorage.getItem('items'))];
  list.dispatchEvent(new CustomEvent('listUpdated'));
}
restoreFromLocalStorage();

function generateRandom() {
  return Number(String(Date.now()).split('').slice(-4).join(''));
}
