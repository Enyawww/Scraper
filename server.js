const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const port = 8000;
const url = 'https://steelkiwi.medium.com/content-aggregator-website-examples-and-how-to-build-one-e983d9ddbdb2';

app.get('/', async (req, res) => {
  try {
    const response = await axios(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const articles = [];

    $('h1, h2, h3, h4, h5, h6').each(function () {
      const title = $(this).text();
      const url = $(this).find('a').attr('href') || '#'; // Provide a default value if 'href' is not found
      articles.push({
        title,
        url,
      });
    });

    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Scraped Headers</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-bottom: 10px;
            color: #333;
          }
        </style>
      </head>
      <body>
        <h1>Scraped Headers</h1>
        <ul>
          ${articles.map((article) => `<li>${article.title}</li>`).join('')}           
        </ul>
      </body>
      </html>
    `;

    res.send(htmlResponse);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

