const axios = require('axios')

const { GIPHY_KEY } = process.env

const getRandomGif = (term, limit = 10) => {
  const termNormalized = term.split(' ').join('+')
  const url = `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_KEY}&tag=${termNormalized}&limit=${limit}&lang=en&rating=g`
  console.log('URL Called', url)
  return axios.get(url)
    .then(({ data: { data: { id } } }) => `https://i.giphy.com/media/${id}/giphy.gif`)
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const SEGURANCA = 'Segurança'
const REDES1 = 'Redes I'
const ALGORITMOS2 = 'Algoritmos 2'

const messages = {
  start: [
    'E ai {name} beleza ? to na correria, mas vê aí as opções abaixo.',
    'Tudo bem {name} ? abaixo tem as opções...olha ai.',
    'Fala {name}, eu só posso te ajudar se for isso ai em baixo ',
  ],
  notas: {
    show: [
      {
        comment: 'é...tá bem complicado né {name}...se puxar',
        gif: 'scary',
        grades: {
          ALGORITMOS2: 1.5,
          SEGURANCA: 3.3,
          REDES1: 4.5,
        }
      },
      {
        comment: 'assim criatura, tá bem bom só dá uma olhada nessa de Redes :/',
        gif: 'successful',
        grades: {
          ALGORITMOS2: 9.5,
          SEGURANCA: 8.7,
          REDES1: 5.5,
        }
      },
      {
        comment: '{name} tu me parece um robozinho, só 7...humm',
        gif: 'robot',
        grades: {
          ALGORITMOS2: 7.0,
          SEGURANCA: 7.0,
          REDES1: 7.0,
        }
      },
    ]
  }
}

const getIndexAndMessage = (array) => {
  const index = getRandomInt(0, array.length - 1)
  console.log('==>', 'index', index)
  return { index, message: array[index] }
}

const replace = (message, target, value) => message.replace(`{${target}}`, value)


const elgioSays = {
  start: (name) => {
    const { index, message } = getIndexAndMessage(messages.start)
    return replace(message, 'name', name)
  },
  notasShow: async (name) => {
    const { index, message } = getIndexAndMessage(messages.notas.show)
    const { comment, gif, grades } = message
    console.log({ comment, gif, grades })

    const image = await getRandomGif(gif)

    const body = `
${replace(comment, 'name', name)}
${Object.entries(grades).reduce((acc, [key, val]) => {
      return `${acc}
<strong>${key}</strong>: ${val}`
    }, '')}

Até mais
    `
    return { body, image }
  }
}

module.exports = {
  elgioSays,
  getRandomGif
}

