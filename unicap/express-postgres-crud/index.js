const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuração do pool de conexões com o PostgreSQL
const pool = new Pool({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'sua_database',
  password: 'sua_senha',
  port: 5432,
});

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Rotas CRUD

// Rota para listar todos os itens
app.get('/items', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ error: 'Erro ao buscar itens' });
  }
});

// Rota para criar um novo item
app.post('/items', async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query('INSERT INTO items (name, description) VALUES ($1, $2)', [name, description]);
    res.status(201).json({ message: 'Item criado com sucesso' });
  } catch (error) {
    console.error('Erro ao criar item:', error);
    res.status(500).json({ error: 'Erro ao criar item' });
  }
});

// Rota para atualizar um item
app.put('/items/:id', async (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  try {
    await pool.query('UPDATE items SET name = $1, description = $2 WHERE id = $3', [name, description, id]);
    res.json({ message: 'Item atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
});

// Rota para deletar um item
app.delete('/items/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM items WHERE id = $1', [id]);
    res.json({ message: 'Item deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    res.status(500).json({ error: 'Erro ao deletar item' });
  }
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});