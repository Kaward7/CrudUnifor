'use strict';

const STORE = [
  {name: "arroz", checked: false},
  {name: "leite", checked: false}
];

function generateItemElement(item) {
  return `
    <li class="js-item-index-element" data-item-id="${item.objectId}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">riscar</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">excluir</span>
        </button>
      </div>
    </li>`;
}

function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");

  const items = shoppingList.map((item) => generateItemElement(item));

  return items.join("");
}


function renderShoppingList() {
  console.log('`renderShoppingList` executado');

  const shoppingListItemsString = generateShoppingItemsString(STORE);
  $('.js-shopping-list').html(shoppingListItemsString);
}




async function addItemToShoppingList(itemName) {
  console.log(`Adicionando "${itemName}" à lista de compras`);

  // 1. Adicionar o novo item ao array STORE localmente
  const newItem = { name: itemName, checked: false };
  STORE.push(newItem);

  // 2. Renderizar a lista imediatamente
  renderShoppingList();

  // 3. Exibir a mensagem de item adicionado
  displayAddedItemMessage(itemName);

  // 4. Enviar o item para o backend
  const Item = Parse.Object.extend("Item");
  const item = new Item();
  item.set("name", itemName);
  item.set("checked", false);

  try {
    const savedItem = await item.save();
    console.log("Item salvo no backend:", savedItem);

    // Atualizar o item localmente com o objectId retornado
    const index = STORE.findIndex(i => i.name === itemName && !i.objectId);
    if (index !== -1) {
      STORE[index].objectId = savedItem.id;
    }

    // Opcional: Atualizar a lista de compras a partir do backend se necessário
    // renderShoppingList(); // Se você quiser garantir a sincronização com o backend
  } catch (error) {
    console.error('Erro ao salvar no backend:', error);
  }
}




function displayAddedItemMessage(itemName) {
  const messageElement = $('#added-item-message');
  
  // Mostrar o item adicionado com tachado
  messageElement.html(`${itemName} adicionado`);
  
  // Exibir o elemento
  messageElement.show();
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` executado');
    
    // Captura o valor do input
    const newItemName = $('.js-shopping-list-entry').val();
    
    // Limpa o campo de entrada
    $('.js-shopping-list-entry').val('');
    
    // Adiciona o item à lista de compras
    addItemToShoppingList(newItemName);
  });
}

async function deleteListItem(itemId) {
  STORE = STORE.filter(item => item.objectId !== itemId);
  renderShoppingList();

  const Item = Parse.Object.extend("Item");
  const query = new Parse.Query(Item);
  
  try {
    const item = await query.get(itemId);
    await item.destroy();
    console.log(`Item ${itemId} removido do backend`);
  } catch (error) {
    console.error(`Erro ao remover o item ${itemId} do backend:`, error);
  }
}



async function toggleCheckedForListItem(itemId) {
  console.log("Item com ID " + itemId + " marcado");

  const itemIndex = STORE.findIndex(item => item.objectId === itemId);
  if (itemIndex === -1) return;

  STORE[itemIndex].checked = !STORE[itemIndex].checked;
  renderShoppingList();

  const Item = Parse.Object.extend("Item");
  const query = new Parse.Query(Item);
  
  try {
    const item = await query.get(itemId);
    item.set("checked", STORE[itemIndex].checked);
    const updatedItem = await item.save();
    console.log("Item atualizado no backend:", updatedItem);
  } catch (error) {
    console.error('Erro ao atualizar o item no backend:', error);
  }
}




function getItemIdFromElement(item) {
  return $(item)
    .closest('.js-item-index-element')
    .attr('data-item-id');
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
    console.log('`handleItemCheckClicked` executado');
    const itemId = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(itemId);
  });
}


function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => { 
    const itemId = getItemIdFromElement(event.currentTarget);
    deleteListItem(itemId);
  });
}



function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
}

let store = [
  { name: "maçãs", checked: false },
];


$(handleShoppingList);
