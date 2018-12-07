const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");

const nrpnames = new Set(); // Невалидные ники будут записаны в nrpnames
const sened = new Set(); // Уже отправленные запросы будут записаны в sened
const snyatie = new Set(); // Уже отправленные запросы на снятие роли быдут записаны в snyatie

tags = ({
    "ПРА-ВО": "Сотрудник правительства",
    "ГЦЛ": "Сотрудник автошколы",
    "АШ": "Сотрудник автошколы",
    "ЦБ": "Сотрудник банка",

    "FBI": "Сотрудник FBI",
    "ФБР": "Сотрудник FBI",
    "LSPD": "Сотрудник LSPD",
    "ЛСПД": "Сотрудник LSPD",
    "SFPD": "Сотрудник SFPD",
    "СФПД": "Сотрудник SFPD",
    "LVPD": "Сотрудник LVPD",
    "ЛВПД": "Сотрудник LVPD",
    "SWAT": "Сотрудник S.W.A.T.",
    "СВАТ": "Сотрудник S.W.A.T.",
    "S.W.A.T": "Сотрудник S.W.A.T.",
    "RCPD": "Сотрудник RCSD",
    "РКПД": "Сотрудник RCSD",
    "RCSD": "Сотрудник RCSD",
    "РКСД": "Сотрудник RCSD",

    "LSA": "Военнослужащий LSa",
    "ЛСА": "Военнослужащий LSa",
    "SFA": "Военнослужащий SFa",
    "СФА": "Военнослужащий SFa",
    "LS-A": "Военнослужащий LSa",
    "ЛС-А": "Военнослужащий LSa",
    "SF-A": "Военнослужащий SFa",
    "СФ-А": "Военнослужащий SFa",
    "ТСР": "Сотрудник ТСР",
    "ТЮРЬМА": "Сотрудник ТСР",

    "LSMC": "Сотрудник LSMC",
    "ЛСМЦ": "Сотрудник LSMC",
    "SFMC": "Сотрудник SFMC",
    "СФМЦ": "Сотрудник SFMC",
    "LVMC": "Сотрудник LVMC",
    "ЛВМЦ": "Сотрудник LVMC",

    "R-LS": "Сотрудник LSFM",
    "RLS": "Сотрудник LSFM",
    "Р-ЛС": "Сотрудник LSFM",
    "РЛС": "Сотрудник LSFM",
    "LSFM": "Сотрудник LSFM",
    "ЛСФМ": "Сотрудник LSFM",
    
    "R-SF": "Сотрудник SFFM",
    "RSF": "Сотрудник SFFM",
    "Р-СФ": "Сотрудник SFFM",
    "РСФ": "Сотрудник SFFM",
    "SFFM": "Сотрудник SFFM",
    "СФФМ": "Сотрудник SFFM",
    
    "R-LV": "Сотрудник LVFM",
    "RLV": "Сотрудник LVFM",
    "Р-ЛВ": "Сотрудник LVFM",
    "РЛВ": "Сотрудник LVFM",
    "LVFM": "Сотрудник LVFM",
    "ЛВФМ": "Сотрудник LVFM",

    "WMC": "Warlock MC",
    "W-MC": "Warlock MC",
    "RM": "Russian Mafia",
    "РМ": "Russian Mafia",
    "LCN": "La Cosa Nostra",
    "ЛКН": "La Cosa Nostra",
    "YAKUZA": "Yakuza",
    "ЯКУДЗА": "Yakuza",

    "GROVE": "Grove Street",
    "ГРУВ": "Grove Street",
    "BALLAS": "Ballas",
    "БАЛЛАС": "Ballas",
    "VAGOS": "Vagos",
    "ВАГОС": "Vagos",
    "NW": "Night Wolfs",
    "НВ": "Night Wolfs",
    "RIFA": "Rifa",
    "РИФА": "Rifa",
    "AZTEC": "Aztecas",  
    "АЦТЕК": "Aztecas",  
});

let manytags = [
"ПРА-ВО",
"ГЦЛ",
"АШ",
"ЦБ",

"FBI",
"ФБР",
"LSPD",
"ЛСПД",
"SFPD",
"СФПД",
"LVPD",
"ЛВПД",
"SWAT",
"СВАТ",
"S.W.A.T",
"RCPD",
"РКПД",
"RCSD",
"РКСД",

"LSA",
"ЛСА",
"SFA",
"СФА",
"LS-A",
"ЛС-А",
"SF-A",
"СФ-А",
"ТСР",
"ТЮРЬМА",

"LSMC",
"ЛСМЦ",
"SFMC",
"СФМЦ",
"LVMC",
"ЛВМЦ",

"R-LS",
"RLS",
"Р-ЛС",
"РЛС",
"LSFM",
"ЛСФМ",
    
"R-SF",
"RSF",
"Р-СФ",
"РСФ",
"SFFM",
"СФФМ",
    
"R-LV",
"RLV",
"Р-ЛВ",
"РЛВ",
"LVFM",
"ЛВФМ",

"WMC",
"W-MC",
"RM",
"РМ",
"LCN",
"ЛКН",
"YAKUZA",
"ЯКУДЗА",

"GROVE",
"ГРУВ",
"BALLAS",
"БАЛЛАС",
"VAGOS",
"ВАГОС",
"NW",
"НВ",
"RIFA",
"РИФА",
"AZTEC",  
"АЦТЕК",  
];
let rolesgg = ["Сотрудник правительства", "Сотрудник автошколы", "Сотрудник банка", "Сотрудник FBI", "Сотрудник S.W.A.T.", "Сотрудник LSPD", "Сотрудник SFPD", "Сотрудник LVPD", "Сотрудник RCSD", "Сотрудник ТСР", "Военнослужащий LSa", "Военнослужащий SFa", "Сотрудник LSMC", "Сотрудник SFMC", "Сотрудник LVMC", "Сотрудник LSFM", "Сотрудник SFFM",
"Сотрудник LVFM", "Rifa", "Ballas", "Grove Street", "Vagos", "Night Wolfs", "Aztecas", "Yakuza", "La Cosa Nostra",  "Russian Mafia",  "Warlock MC"]
let canremoverole = ["Министры", "Лидеры фракций", "Заместители фракций"];
let serverid = "282282840840732672";

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

bot.login(process.env.token);

bot.on('ready', () => {
    console.log("Бот был успешно запущен!"); // Написать что бот запущен
    bot.user.setPresence({ game: { name: 'выдачу ролей' }, status: 'idle' }) // Установить игру
});

bot.on('message', async message => {
    if (message.guild.id != serverid) return
    if (message.channel.type == "dm") return // Если в ЛС, то выход.
    if (message.type === "PINS_ADD") if (message.channel.name == "requests-for-roles") message.delete();
    if (message.content == "/ping") return message.reply("`я онлайн.`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)
    if (message.author.bot) return
    
    if (message.content.toLowerCase().startsWith(`/bug`)){
        const args = message.content.slice('/bug').split(/ +/);
        if (!args[1]){
            message.reply(`\`привет! Для отправки отчета об ошибках используй: /bug [текст]\``).then(msg => msg.delete(15000));
            return message.delete()
        }
        let bugreport = args.slice(1).join(" ");
        if (bugreport.length < 5 || bugreport.length > 1300){
            message.reply(`\`нельзя отправить запрос с длинной меньше 5 или больше 1300 символов!\``).then(msg => msg.delete(15000));
            return message.delete()
        }
        let author_bot = message.guild.members.find(m => m.id == 336207279412215809);
        if (!author_bot){
            message.reply(`\`я не смог отправить сообщение.. Создателя данного бота нет на данном сервере.\``).then(msg => msg.delete(15000));
            return message.delete()
        }
        author_bot.send(`**Привет, Kory_McGregor! Пользователь <@${message.author.id}> \`(${message.author.id})\` отправил запрос с сервера \`${message.guild.name}\` \`(${message.guild.id})\`.**\n` +
        `**Суть обращения:** ${bugreport}`);
        message.reply(`\`хэй! Я отправил твое сообщение на рассмотрение моему боссу робохомячков!\``).then(msg => msg.delete(15000));
        return message.delete();
    }
    
    if (message.content.toLowerCase().includes("сними") || message.content.toLowerCase().includes("снять")){
        if (!message.member.roles.some(r => canremoverole.includes(r.name)) && !message.member.hasPermission("MANAGE_ROLES")) return
        const args = message.content.split(/ +/)
        let onebe = false;
        let twobe = false;
        args.forEach(word => {
            if (word.toLowerCase().includes(`роль`)) onebe = true
            if (word.toLowerCase().includes(`у`)) twobe = true
        })
        if (!onebe || !twobe) return
        if (message.mentions.users.size > 1) return message.react(`📛`)
        let user = message.guild.member(message.mentions.users.first());
        if (!user) return message.react(`📛`)
        if (snyatie.has(message.author.id + `=>` + user.id)) return message.react(`🕖`)
        let reqchat = message.guild.channels.find(c => c.name == `requests-for-roles`); // Найти чат на сервере.
        if(!reqchat){
            message.reply(`\`Ошибка выполнения. Канал requests-for-roles не был найден!\``)
            return console.error(`Канал requests-for-roles не был найден!`)
        }
        let roleremove = user.roles.find(r => rolesgg.includes(r.name));
        if (!roleremove) return message.react(`📛`)

        message.reply(`\`напишите причину снятия роли.\``).then(answer => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 60000,
                errors: ['time'],
            }).then((collected) => {
                const embed = new Discord.RichEmbed()
                .setTitle("`Discord » Запрос о снятии роли.`")
                .setColor("#483D8B")
                .addField("Отправитель", `\`Пользователь:\` <@${message.author.id}>`)
                .addField("Кому снять роль", `\`Пользователь:\` <@${user.id}>`)
                .addField("Роль для снятия", `\`Роль для снятия:\` <@&${roleremove.id}>`)
                .addField("Отправлено с канала", `<#${message.channel.id}>`)
                .addField("Причина снятия роли", `${collected.first().content}`)
                .addField("Информация", `\`[✔] - снять роль\`\n` + `\`[❌] - отказать в снятии роли\`\n` + `\`[D] - удалить сообщение\``)
                .setFooter("© Support Team | by Kory_McGregor")
                .setTimestamp()
                reqchat.send(embed).then(async msgsen => {
                    answer.delete();
                    collected.first().delete();
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    await msgsen.pin();
                })
                snyatie.add(message.author.id + `=>` + user.id)
                return message.react(`📨`);
            }).catch(() => {
                return answer.delete()
            });
        });
    }

    if (message.content.toLowerCase().includes("роль") && !message.content.toLowerCase().includes(`сними`) && !message.content.toLowerCase().includes(`снять`)){
        // Проверить невалидный ли ник.
        if (nrpnames.has(message.member.displayName)){
            if(message.member.roles.some(r=>rolesgg.includes(r.name)) ) {
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                    if (message.member.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        await message.member.removeRole(rolerem); // Забрать роли указанные ранее.
                    }
                }
            }
            message.react(`📛`) // Поставить знак стоп под отправленным сообщением.
            return // Выход
        }
        // Проверить все доступные тэги
        for (var i in manytags){
            let nicknametest = message.member.displayName.toLowerCase();
            nicknametest = nicknametest.replace(/ /g, '');
            if (nicknametest.includes("[" + manytags[i].toLowerCase()) || nicknametest.includes(manytags[i].toLowerCase() + "]") || nicknametest.includes("(" + manytags[i].toLowerCase()) || nicknametest.includes(manytags[i].toLowerCase() + ")") || nicknametest.includes("{" + manytags[i].toLowerCase()) || nicknametest.includes(manytags[i].toLowerCase() + "}")){
                let rolename = tags[manytags[i].toUpperCase()] // Указать название роли по соответствию с тэгом
                let role = message.guild.roles.find(r => r.name == rolename); // Найти эту роль на discord сервере.
                let reqchat = message.guild.channels.find(c => c.name == `requests-for-roles`); // Найти чат на сервере.
                if (!role){
                    message.reply(`\`Ошибка выполнения. Роль ${rolename} не была найдена.\``)
                    return console.error(`Роль ${rolename} не найдена!`);
                }else if(!reqchat){
                    message.reply(`\`Ошибка выполнения. Канал requests-for-roles не был найден!\``)
                    return console.error(`Канал requests-for-roles не был найден!`)
                }
                if (message.member.roles.some(r => [rolename].includes(r.name))){
                    return message.react(`👌`) // Если роль есть, поставить окей.
                }
                if (sened.has(message.member.displayName)) return message.react(`🕖`) // Если уже отправлял - поставить часы.
                let nickname = message.member.displayName;
                const embed = new Discord.RichEmbed()
                .setTitle("`Discord » Проверка на валидность ник нейма.`")
                .setColor("#483D8B")
                .addField("Аккаунт", `\`Пользователь:\` <@${message.author.id}>`, true)
                .addField("Никнейм", `\`Ник:\` ${nickname}`, true)
                .addField("Роль для выдачи", `\`Роль для выдачи:\` <@&${role.id}>`)
                .addField("Отправлено с канала", `<#${message.channel.id}>`)
                .addField("Информация по выдачи", `\`[✔] - выдать роль\`\n` + `\`[❌] - отказать в выдачи роли\`\n` + `\`[D] - удалить сообщение\``)
                .setFooter("© Support Team | by Kory_McGregor")
                .setTimestamp()
                reqchat.send(embed).then(async msgsen => {
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    await msgsen.pin();
                })
                sened.add(message.member.displayName); // Пометить данный ник, что он отправлял запрос.
                return message.react(`📨`);
            }
        }
    }
});

bot.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return; // Если не будет добавление или удаление смайлика, то выход
    if (event.t == "MESSAGE_REACTION_ADD"){
        let event_guildid = event.d.guild_id // ID discord сервера
        let event_channelid = event.d.channel_id // ID канала
        let event_userid = event.d.user_id // ID того кто поставил смайлик
        let event_messageid = event.d.message_id // ID сообщение куда поставлен смайлик
        let event_emoji_name = event.d.emoji.name // Название смайлика

        if (event_userid == bot.user.id) return // Если поставил смайлик бот то выход
        if (event_guildid != serverid) return // Если сервер будет другой то выход

        let server = bot.guilds.find(g => g.id == event_guildid); // Получить сервер из его ID
        let channel = server.channels.find(c => c.id == event_channelid); // Получить канал на сервере по списку каналов
        let message = await channel.fetchMessage(event_messageid); // Получить сообщение из канала
        let member = server.members.find(m => m.id == event_userid); // Получить пользователя с сервера

        if (channel.name != `requests-for-roles`) return // Если название канала не будет 'requests-for-roles', то выйти

        if (event_emoji_name == "🇩"){
            if (!message.embeds[0]){
                channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос.\``);
                return message.delete();
            }else if (message.embeds[0].title == "`Discord » Проверка на валидность ник нейма.`"){
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (!field_user || !field_nickname || !field_role || !field_channel){
                    channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос.\``);
                }else{
                    channel.send(`\`[DELETED]\` ${member} \`удалил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                }
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (!field_author || !field_user || !field_role || !field_channel){
                    channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос на снятие роли.\``);
                }else{
                    channel.send(`\`[DELETED]\` ${member} \`удалил запрос на снятие роли от ${field_author.displayName}, с ID: ${field_author.id}\``);
                }
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete();
            }
        }else if(event_emoji_name == "❌"){
            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`'){
                if (message.reactions.size != 3){
                    // return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на выдачу роли.\nВаш ник при отправке: ${field_nickname}\nУстановите ник на: [Фракция Ранг/10] Имя_Фамилия\``)
                nrpnames.add(field_nickname); // Добавить данный никнейм в список невалидных
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (member.id == field_author.id) return channel.send(`\`[ERROR]\` \`${member.displayName} свои запросы отклонять нельзя!\``).then(msg => msg.delete(5000))
                if (!field_user.roles.some(r => r.id == field_role.id)){
                    if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                    return message.delete();
                }
                channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос на снятие роли от\` <@${field_author.id}>\`, с ID: ${field_author.id}\``);
                field_channel.send(`<@${field_author.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на снятие роли пользователю:\` <@${field_user.id}>`)
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete();
            }
        }else if (event_emoji_name == "✔"){
            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`'){
                if (message.reactions.size != 3){
                    // return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (field_user.roles.some(r => field_role.id == r.id)){
                    if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                    return message.delete(); // Если роль есть, то выход
                }
                let rolesremoved = false;
                let rolesremovedcount = 0;
                if (field_user.roles.some(r=>rolesgg.includes(r.name))) {
                    for (var i in rolesgg){
                        let rolerem = server.roles.find(r => r.name == rolesgg[i]);
                        if (field_user.roles.some(role=>[rolesgg[i]].includes(role.name))){
                            rolesremoved = true;
                            rolesremovedcount = rolesremovedcount+1;
                            await field_user.removeRole(rolerem); // Забрать фракционные роли
                        }
                    }
                }
                await field_user.addRole(field_role); // Выдать роль по соответствию с тэгом
                channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                if (rolesremoved){
                    if (rolesremovedcount == 1){
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! ${rolesremovedcount} роль другой фракции была убрана.\``)
                    }else if (rolesremovedcount < 5){
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! Остальные ${rolesremovedcount} роли других фракций были убраны.\``)
                    }else{
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! Остальные ${rolesremovedcount} ролей других фракций были убраны.\``)
                    }
                }else{
                    field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана!\``)
                }
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (member.id == field_author.id) return channel.send(`\`[ERROR]\` \`${member.displayName} свои запросы принимать нельзя!\``).then(msg => msg.delete(5000))
                if (!field_user.roles.some(r => r.id == field_role.id)){
                    if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                    return message.delete();
                }
                field_user.removeRole(field_role);
                channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил снятие роли (${field_role.name}) от\` <@${field_author.id}>, \`пользователю\` <@${field_user.id}>, \`с ID: ${field_user.id}\``);
                field_channel.send(`**<@${field_user.id}>, с вас сняли роль**  <@&${field_role.id}>  **по запросу от <@${field_author.id}>.**`)
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete()
            }
        }
    }
});
