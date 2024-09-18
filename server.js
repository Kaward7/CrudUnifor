const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // para servir o front-end

let store = [
  { name: "maçãs", checked: false },
];

// Rota GET - Ler a lista de itens
app.get('/items', (req, res) => {
  res.json(store);
});

// Rota POST - Adicionar item à lista
app.post('/items', (req, res) => {
  const newItem = req.body;
  store.push(newItem);
  res.status(201).json(newItem);
});

// Rota PUT - Atualizar item (check/uncheck)
app.put('/items/:index', (req, res) => {
  const index = req.params.index;
  store[index].checked = req.body.checked;
  res.json(store[index]);
});

// Rota DELETE - Remover item
app.delete('/items/:index', (req, res) => {
  const index = req.params.index;
  const removedItem = store.splice(index, 1);
  res.json(removedItem);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
