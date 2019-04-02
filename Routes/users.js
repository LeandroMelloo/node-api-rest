const express = require('express');
const router = express.Router();
const Users = require('../Model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//FUNÇÕES AUXILIARES
const createUserToken = (userid) => {
    return jwt.sign({ id: userid }, 'batatafrita2019', { expiresIn: '1d'});
};

router.get('/', async (req, res) => {
    try {
        const users = await Users.find({});
        return res.send(users);
    }
    catch (err) {
        return res.send({ error: 'Erro na consulta do usuário!' });
    };
});

router.post('/create', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.send({ error: 'Dados obrigatorios para o cadastro do usuário!' });

    try {
        if (await Users.findOne({ email })) res.send({ error: 'Usuário já cadastrado!' });

        const user = await Users.create(req.body);
        user.password = undefined;
        return res.send({ user });
    }
    catch (err) {
        return res.send({ error: 'Erro ao buscar usuário!' });
    };
});

router.post('/auth', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.send({ error: 'Dados obrigatorios para o cadastro do usuário!' });

    try {
        const user = await Users.findOne({ email }).select('+password');
        if (!user) return res.send({ error: 'Usuário não cadastrado!' });

        const pass_ok = await bcrypt.compare(password, user.password);

        if(!pass_ok) return res.send({ error: 'Erro ao autenticar o usuário' });

        user.password = undefined;
        return res.send(user);
    }
    catch (err) {
        return res.send({ error: 'Erro ao buscar usuário!' });
    };
});

module.exports = router;