const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-interna-super-segura';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username: username.trim().toLowerCase() } });
    if (!user) return res.status(401).json({ error: 'Usuário ou senha incorretos' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: 'Usuário ou senha incorretos' });

    const token = jwt.sign({ id: user.id, username: user.username, name: user.name }, SECRET_KEY, { expiresIn: '12h' });
    
    res.json({ token, user: { id: user.id, name: user.name, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name?.trim() || !username?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Todos os campos (Nome, Usuário e Senha) são obrigatórios.' });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: 'A senha deve conter no mínimo 4 caracteres.' });
    }

    const userExists = await User.findOne({ where: { username: username.trim().toLowerCase() } });
    if (userExists) {
      return res.status(400).json({ error: 'Este nome de usuário já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name: name.trim(), username: username.trim().toLowerCase(), password: hashedPassword });

    res.status(201).json({ message: 'Usuário criado com sucesso!', user: { id: newUser.id, name: newUser.name, username: newUser.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'username'],
      order: [['name', 'ASC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};