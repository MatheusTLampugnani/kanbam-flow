const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, User } = require('./models'); 
const routes = require('./routes');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(async () => {
  console.log('Banco de dados sincronizado (Supabase).');
  
  try {
    const userCount = await User.count();
    
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await User.create({ 
        name: 'Administrador', 
        username: 'admin', 
        password: hashedPassword 
      });
      console.log('Usuário padrão criado: admin / 123456');
    }
  } catch (error) {
    console.error('Erro ao verificar/criar usuário padrão:', error);
  }

  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
}).catch((err) => {
  console.error('Erro ao sincronizar o banco:', err);
});