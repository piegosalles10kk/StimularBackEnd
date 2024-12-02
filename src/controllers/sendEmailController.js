const nodemailer = require('nodemailer');
const { User } = require('../models/User');

const gerarCodigo = (length = 6) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        codigo += characters[randomIndex];
    }
    return codigo;
};

const sendEmail = async (req, res) => {
    const email = req.params.email;
    try {
        // Busca o usuário no banco de dados pelo email
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(404).json({ msg: 'Email não encontrado' });
        }

        const userId = user._id; // Obtém o _id do usuário encontrado
        const testeCodigo = gerarCodigo(6); // Gera um código de 6 caracteres

        // Atualiza o campo codigoRecuperarSenha do usuário
        user.codigoRecuperarSenha = testeCodigo;
        await user.save();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: 'stimularapp@gmail.com',
                pass: 'qhtrqpctvoilvkqy'
            }
        });

        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Stimular recuperar senha</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    width: 100%;
                    padding: 20px;
                    background-color: #ffffff;
                }
                .header {
                    text-align: center;
                    padding: 20px;
                    background-color: #FFFF;
                    color: white;
                }
                .content {
                    padding: 20px;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    background-color: #dddddd;
                    font-size: 12px;
                    color: #555555;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 20px 0;
                    background-color: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                }
                img {
                    max-width: 50%;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="cid:logo" alt="Stimular">
                    <h1>Recuperar Senha</h1>
                </div>
                <div class="content">
                    <p>Olá,</p>
                    <p>Foi solicitada uma recuperação de senha para sua conta. <strong>Caso não tenha sido você ignore este email.</strong></p>
                    <p>Código de acesso:</p>
                    <p><strong>${testeCodigo}</strong></p>
                    <p>Atenciosamente,<br>Equipe StimularApp</p>
                </div>
                <div class="footer">
                    <p>© 2024 Stimular. Todos os direitos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        await transport.sendMail({
            from: 'Recuperar senha stimular <stimularapp@gmail.com>',
            to: email,
            subject: 'Recuperar Senha',
            html: html,
            text: 'Recuperar Senha',
            attachments: [
                {
                    filename: 'logo.png',
                    path: 'https://stimularmidias.blob.core.windows.net/midias/71674a28-56d7-47e4-9bcc-cf3181c0c888.png?sv=2022-11-02&ss=b&srt=sco&sp=rwdlaciytfx&se=2030-12-31T21:19:23Z&st=2024-11-13T13:19:23Z&spr=https&sig=RWvgyvXeVR7oCEwzfniPRRLQiA9sByWY8bnqP1d3LtI%3D',
                    cid: 'logo' // Deve corresponder ao cid usado no HTML
                }
            ]
        });

        res.status(200).json({ msg: 'Email enviado com sucesso!' });
    } catch (err) {
        console.log('Erro ao enviar email:', err);
        res.status(500).json({ msg: 'Erro ao enviar email' });
    }
};

const verificarCodigo = async (req, res) => {
    const { email, codigo } = req.params;

    try {
        // Busca o usuário no banco de dados pelo email
        const user = await User.findOne({ email: email });
        
        if (!user) {
            return res.status(404).json({ msg: 'Email não encontrado' });
        }

        // Verifica se o código fornecido corresponde ao código do usuário
        if (user.codigoRecuperarSenha === codigo) {
            return res.status(200).json({ msg: 'Código verificado com sucesso!', idUsuario: user._id });
        } else {
            return res.status(400).json({ msg: 'Código incorreto' });
        }
    } catch (err) {
        console.log('Erro ao verificar código:', err);
        res.status(500).json({ msg: 'Erro ao verificar código' });
    }
};


module.exports = { sendEmail, verificarCodigo };
