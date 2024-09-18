const STORE = [
  {name: "maçãs", checked: false},
  {name: "laranjas", checked: false},
  {name: "leite", checked: true},
  {name: "pão", checked: false}
];

function generateItemElement(item, itemIndex, template) {
  return 
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
    </li>;
}

function generateShoppingItemsString(shoppingList) {
  console.log("Generating shopping list element");

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join("");
}

function renderShoppingList() {
  console.log('renderShoppingList executado');

  // Usando o array STORE local para gerar a lista de itens
  const shoppingListItemsString = generateShoppingItemsString(STORE);
  
  // Atualiza o HTML da lista de compras
  $('.js-shopping-list').html(shoppingListItemsString);
}



function addItemToShoppingList(itemName) {
  console.log(Adicionando "${itemName}" à lista de compras);

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
    // Opcional: Atualizar a lista de compras a partir do backend se necessário
    // renderShoppingList(); // Se você quiser garantir a sincronização com o backend
  })
  .catch(error => {
    console.error('Erro ao salvar no backend:', error);
  });
}


function displayAddedItemMessage(itemName) {
  const messageElement = $('#added-item-message');
  
  // Mostrar o item adicionado com tachado
  messageElement.html(`<s>${itemName}</s> adicionado`);
  
  // Exibir o elemento
  messageElement.show();
  
  
}


function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('handleNewItemSubmit executado');
    
    // Captura o valor do input
    const newItemName = $('.js-shopping-list-entry').val();
    
    // Limpa o campo de entrada
    $('.js-shopping-list-entry').val('');
    
    // Adiciona o item à lista de compras
    addItemToShoppingList(newItemName);
  });
}

function deleteListItem(itemIndex) {
  // Remove o item do array STORE localmente
  STORE.splice(itemIndex, 1);
  
  // Renderiza novamente a lista de compras
  renderShoppingList();

  // Remove o item do backend
  fetch(/items/${itemIndex}, {
    method: 'DELETE',
  })
  .then(() => console.log(Item ${itemIndex} removido do backend));
}



function toggleCheckedForListItem(itemIndex) {
  console.log("Item na posição " + itemIndex + " marcado");

  // Atualiza o estado do item no array STORE localmente
  STORE[itemIndex].checked = !STORE[itemIndex].checked;

  // Renderiza novamente a lista de compras
  renderShoppingList();

  // Atualiza o item no backend
  fetch(/items/${itemIndex}, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ checked: STORE[itemIndex].checked }),
  })
  .then(response => response.json())
  .then(data => console.log("Item atualizado no backend:", data));
}



function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', .js-item-toggle, event => {
    console.log('handleItemCheckClicked ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => { 
    
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    
    deleteListItem(itemIndex);
    
    renderShoppingList();
  });
}

function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
}


$(handleShoppingList);