'use strict';

// Lista de itens inicial
let STORE = [
  { name: "maçãs", checked: false },
  { name: "laranjas", checked: false },
  { name: "leite", checked: true },
  { name: "pão", checked: false }
];

// Função para gerar HTML para um item
function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
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

// Função para gerar a lista de itens como uma string
function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join("");
}

// Função para renderizar a lista de compras
function renderShoppingList() {
  console.log('`renderShoppingList` executado');
  const shoppingListItemsString = generateShoppingItemsString(STORE);
  $('.js-shopping-list').html(shoppingListItemsString);
}

// Função para adicionar um item à lista de compras
function addItemToShoppingList(itemName) {
  console.log(`Adicionando "${itemName}" à lista de compras`);

  // 1. Adicionar o novo item ao array STORE localmente
  STORE.push({ name: itemName, checked: false });

  // 2. Renderizar a lista imediatamente
  renderShoppingList();

  // 3. Exibir a mensagem de item adicionado
  displayAddedItemMessage(itemName);

  // 4. Enviar o item para o backend
  fetch('/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: itemName, checked: false }),
  })
  .then(response => response.json())
  .then(data => {
    console.log("Item salvo no backend:", data);
  })
  .catch(error => {
    console.error('Erro ao salvar no backend:', error);
  });
}

// Função para exibir mensagem de item adicionado
function displayAddedItemMessage(itemName) {
  const messageElement = $('#added-item-message');
  messageElement.html(`${itemName} adicionado`);
  messageElement.show();
}

// Função para lidar com o envio de novos itens
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` executado');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
  });
}

// Função para excluir um item da lista
function deleteListItem(itemIndex) {
  console.log(`Deletando item na posição ${itemIndex}`);

  // Remove o item do array STORE localmente
  STORE.splice(itemIndex, 1);
  renderShoppingList();

  // Remove o item do backend
  fetch(`/items/${itemIndex}`, {
    method: 'DELETE',
  })
  .then(() => console.log(`Item ${itemIndex} removido do backend`))
  .catch(error => console.error('Erro ao remover item do backend:', error));
}

// Função para marcar ou desmarcar um item
function toggleCheckedForListItem(itemIndex) {
  console.log(`Item na posição ${itemIndex} marcado/desmarcado`);

  // Atualiza o estado do item no array STORE localmente
  STORE[itemIndex].checked = !STORE[itemIndex].checked;
  renderShoppingList();

  // Atualiza o item no backend
  fetch(`/items/${itemIndex}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ checked: STORE[itemIndex].checked }),
  })
  .then(response => response.json())
  .then(data => console.log("Item atualizado no backend:", data))
  .catch(error => console.error('Erro ao atualizar item no backend:', error));
}

// Função para obter o índice do item a partir do elemento
function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

// Funções para lidar com os cliques dos botões
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` executado');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
  });
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => { 
    console.log('`handleDeleteItemClicked` executado');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
  });
}

// Função para iniciar o gerenciamento da lista de compras
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
}

// Inicializa o gerenciamento da lista de compras quando o DOM está pronto
$(handleShoppingList);
