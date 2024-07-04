const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = '!';

client.on('ready', () => {
    console.log('Bot Ready!');
  });

client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === '!test') {
        const question = args[0];
        const options = args.slice(1);
    
        if (!question || options.length < 2) {
            return message.reply('Используйте: !test <вопрос> <вариант1> <вариант2> ...');
        }
    
        const formattedOptions = options.map((option, index) => `${index + 1}. ${option}`).join('\n');
    
        const embed = new Discord.MessageEmbed()
            .setTitle('Тест')
            .setColor('#0099ff')
            .setDescription(question)
            .addField('Варианты ответов', formattedOptions);
    
        message.channel.send(embed)
            .then(sentMessage => {
                options.forEach((_, index) => {
                    sentMessage.react(`${index + 1}️⃣`);
                });
            });
    }

    if (message.content.startsWith('!createchannel')) {
        if (!message.member.hasPermission('MANAGE_CHANNELS')) {
            return message.reply('У вас нет прав на создание каналов.');
        }

        const roleName = args[0];
        const role = message.guild.roles.cache.find(r => r.name === roleName);
        
        if (!role) {
            return message.reply('Роль не найдена.');
        }

        message.guild.channels.create(roleName, {
            type: 'text',
            permissionOverwrites: [
                {
                    id: role.id,
                    allow: ['VIEW_CHANNEL']
                }
            ]
        })
        .then(channel => message.channel.send(`Канал для роли ${roleName} создан: ${channel}`))
        .catch(console.error);

        message.guild.channels.create(roleName, {
            type: 'voice',
            permissionOverwrites: [
                {
                    id: role.id,
                    allow: ['VIEW_CHANNEL']
                }
            ]
        })
        .then(channel => message.channel.send(`Канал для роли ${roleName} создан: ${channel}`))
        .catch(console.error);
    }

    if (message.content.startsWith('!getRole')) {
        if (message.member.permissions.has('ADMINISTRATOR')) {
            // Разбираем аргументы команды
            const args = message.content.split(' ');
            const roleName = args[1]; // Название роли
            const mentionedMembers = message.mentions.members.array(); // Массив упомянутых пользователей

            if (!roleName) {
                message.channel.send('Укажите имя роли!');
                return;
            }

            if (mentionedMembers.length === 0) {
                message.channel.send('Укажите пользователей, которым выдать роль!');
                return;
            }

            const randomColor = Math.floor(Math.random() * 16777215).toString(16); // 16777215 - максимальное значение для цвета в шестнадцатеричной системе

            // Создаем роль
            const role = await message.guild.roles.create({
                data: {
                    name: roleName,
                    color: `#${randomColor}` // Добавляем '#' в начало для формата hex цвета
                }
            });

            // Выдаем роль всем упомянутым пользователям
            for (const member of mentionedMembers) {
                await member.roles.add(role);
            }

            message.channel.send(`Роль "${roleName}" была выдана ${mentionedMembers.length} пользователям.`);

        } else {
            message.channel.send('У вас нет прав для выполнения этой команды.');
        }
    }
})

client.login(
    ""
);
