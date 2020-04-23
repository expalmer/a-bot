require('dotenv').config()

const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const { leave } = Stage

const { BOT_TOKEN } = process.env
const { elgioSays, getRandomGif } = require('./utils')

const getFirstName = ({ message: { from: { first_name } } }) => first_name

// Notas scene
const notas = new Scene('notas')
notas.enter((ctx) => {
  elgioSays.notasShow(getFirstName(ctx))
    .then(({ body, image }) => {
      ctx.replyWithHTML(body)
      ctx.replyWithVideo(image)
      setTimeout(() => {
        ctx.scene.leave()
      }, 3000)
    })
})

notas.leave((ctx) => {
  ctx.reply('Bye')
})

notas.hears(/hi/gi, leave())

notas.on('message', (ctx) => {
  ctx.reply('Send `hi`')
})


// Gifs Scene
const gifs = new Scene('gifs')
gifs.enter((ctx) => {
  const name = getFirstName(ctx)
  ctx.reply(`${name} meu querido, digita exatamente que tipo de gif tu quer ?`)
})

gifs.leave((ctx) => {
  ctx.replyWithHTML(`
até mais ou quer outro ?
<a>/gif</a>
`)
})

// gifs.hears(/hi/gi, leave())

gifs.on('message', (ctx) => {
  // ctx.reply('Tá')
  // leave()
  getRandomGif(ctx.message.text)
    .then(res => {
      ctx.replyWithVideo(res)
      setTimeout(() => {
        ctx.scene.leave()
      }, 3000)
    })
    .catch(err => {
      console.log(err)
    })
})

// Conselhos Scene
const conselhos = new Scene('conselhos')
conselhos.enter((ctx) => {
  const name = getFirstName(ctx)
  ctx.reply(`${name} sem conselhos hoje! tchau`)
  ctx.scene.leave()
})

// Create scene manager
const stage = new Stage()

stage.register(notas)
stage.register(gifs)
stage.register(conselhos)

const bot = new Telegraf(BOT_TOKEN)

bot.use(session())
bot.use(stage.middleware())
bot.command('notas', (ctx) => ctx.scene.enter('notas'))
bot.command('gifs', (ctx) => ctx.scene.enter('gifs'))
bot.command('conselhos', (ctx) => ctx.scene.enter('conselhos'))
bot.startPolling()

bot.start((ctx) => {
  const { message: { from: { first_name } } } = ctx
  const header = elgioSays.start(first_name)
  const message = `
${header}

<a>/notas - mostrar suas notas</a>
<a>/gifs - mostrar algum gif legal para você compartilhar por ai</a>
<a>/conselhos - te dar um bom conselho</a>
  `
  ctx.replyWithHTML(message)
})

bot.on('text', (ctx) => {
  const { message: { from: { first_name } } } = ctx
  console.log('==>', 'ctx.message', ctx.message)

  // const gif = await getGif('so sorry')
  // if (gif) {
  //   return ctx.replyWithVideo(gif)
  // }
  // return ctx.replyWithPhoto('https://i.picsum.photos/id/237/200/300.jpg')
  return ctx.reply('Escolha alguma coisa criatura')
})


bot.launch()