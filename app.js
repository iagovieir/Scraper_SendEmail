require('dotenv').config();
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const cheerio = require('cheerio');


const url = 'https://www.adorocinema.com/filmes/numero-cinemas/';
const tabelaFilmes = [];

async function fetchData() {
    try {
        // Faz a requisição da página
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        // Verifica os seletores específicos da página
        const filmesStatus = $('.mdl');

        // Itera sobre os elementos da tabela
        filmesStatus.each(function () {
            const titulo = $(this).find('.meta-title-link').text().trim();
            const data = $(this).find('.date').text().trim();

            // Checa se os dados foram coletados corretamente antes de adicionar
            if (titulo) {
                tabelaFilmes.push({
                    titulo,
                    data
                });
            }
        });
        console.log(tabelaFilmes)
        // Exibe os dados no console
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true para 465, false para outras portas
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
  
      const info = await transporter.sendMail({
        from: `"Nome do Remetente" <${process.env.EMAIL_USER}>`, // Remetente
        to: 'iago.unijp@gmail.com', // Lista de destinatários
        subject: 'Assunto do E-mail', // Assunto
        text: 'Conteúdo do e-mail em texto simples', // Corpo do e-mail em texto simples
        html: `<h1>Jogadores coletados:</h1>
                <ul>
                  ${tabelaFilmes.map(filmes => `
                    <li>
                      <strong>Título do Filme:</strong> ${filmes.titulo}<br><br>
                      <strong>Data do lançamento:</strong> ${filmes.data}<br><br><br>
                    </li>
                  `).join('')}
                </ul>`, // Corpo do e-mail em HTML
      });
  
      console.log('E-mail enviado: %s', info.messageId);
    } catch (error) {
      console.error('Erro ao enviar o e-mail:', error);
    }

}
// Executa a função
fetchData();

