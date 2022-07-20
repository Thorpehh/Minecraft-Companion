const mineflayer = require('mineflayer')
const pvp = require('mineflayer-pvp').plugin
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
const armorManager = require('mineflayer-armor-manager')
const GoalFollow = goals.GoalFollow


const bot = mineflayer.createBot({
    host: 'localhost',
    port: 58241,
    username: 'Trope',
    version: '1.18'
 })

bot.loadPlugin(pvp)
bot.loadPlugin(armorManager)
bot.loadPlugin(pathfinder)

bot.on('playerCollect', (collector, itemDrop) => {
    if (collector !== bot.entity) return
    
    setTimeout(() => {
    const sword = bot.inventory.items().find(item => item.name.includes('sword'))
    if (sword) bot.equip(sword, 'hand')
    }, 150)
})

bot.on('playerCollect', (collector, itemDrop) => {
    if (collector !== bot.entity) return
    
    setTimeout(() => {
    const shield = bot.inventory.items().find(item => item.name.includes('shield'))
    if (shield) bot.equip(shield, 'off-hand')
    }, 250)
})
// The '150' and '250' values are ms that it takes for the bot to equip the item //
//'bot.on' is basically js' equivalent to Python's 'when' //

//Pvp//
bot.on('chat', (username, message) => {

    if (message === 'guard') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("I can't see you")
            return
        }

        bot.chat("I will guard that location.")
        guardArea(player.entity.position)
    }

    if (message === 'I love anime') {
        const player = bot.players[username]

        if (!player) {
            bot.chat("I can't see you!")
            return
        }

        bot.chat("I'm gonna fuck you up")
        bot.pvp.attack(player.entity)
    }

    if (message === 'stop') {
        bot.chat("Okay.")
    stopGuarding(null)
    }
})


//Guard position//

let guardPos = null

function guardArea (pos) {
    guardPos = pos.clone()

    if (!bot.pvp.targer) {
        moveToGuardPos()
    }
}

function stopGuarding () {
    guardPos = null
    bot.pvp.stop()
    bot.pathfinder.setGoal(null)
}

function moveToGuardPos () {
    const mcData = require ('minecraft-data')(bot.version)
    bot.pathfinder.setMovements(new Movements(bot,mcData))
    bot.pathfinder.setGoal(new goals.GoalBlock(guardPos.x, guardPos.y, guardPos.z))
}

bot.on('physicTick', () => {
    if (!guardPos) return

    const filter = e => e.type === 'mob' && e.position.distanceTo(bot.entity.position) <16 &&
     e.mobtype !== 'Armor Stand'

    const entity = bot.nearestEntity(filter)
    if (entity) {
        bot.pvp.attack(entity)
    }
})

bot.on('stoppedAttacking', () => {
    if (guardPos) {
        moveToGuardPos()
    }
})

bot.on('physicTick', () => {
    if (bot.pvp.target) return
    if (bot.pathfinder.isMoving()) return

    const entity = bot.nearestEntity()
    if (entity) bot.lookAt(entity.position.offset(0, entity.height, 0))
})

// "Follow me" code below//

bot.once('spawn', () => {
    
    const mcData = require('minecraft-data')(bot.version)

    const defaultMove = new Movements(bot, mcData)
    defaultMove.allowFreeMotion = true

    bot.on('chat', (username, message) => {
      

      const target = bot.players[username].entity
      if (username === 'thorpehh') {
        if (message === 'follow me') {
          bot.pathfinder.setMovements(defaultMove)
          bot.pathfinder.setGoal(new GoalFollow (target, 2), true)
        } else if (message === 'stop') {
          bot.pathfinder.setGoal(null)
        }
      }
    })
  })

  bot.on('chat', (username, message) => {
  if (message === 'Can you be my friend?') {
    const player = bot.players[username]
    bot.chat("What the fuck? No hahaha ")
    bot.chat("You play League of Legends you sad cunt")
    bot.chat("kys")
    return
  }
})
