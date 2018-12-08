const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");

const nrpnames = new Set(); // Невалидные ники будут записаны в nrpnames
const sened = new Set(); // Уже отправленные запросы будут записаны в sened
const snyatie = new Set(); // КД

tagstoperms = ({
    "Сотрудник правительства": "ГС Гос, ЗГС Гос, ГС правительства, ЗГС правительства, Следящий правительства, Лидер правительства, Премьер-Министр, Мэр ЛС, Мэр СФ, Мэр ЛВ",
    "Сотрудник автошколы": "ГС Гос, ЗГС Гос, Лидер автошколы, Зам. автошколы",
    "Сотрудник банка": "ГС Гос, ЗГС Гос, Лидер банка, Зам. банка", 
    "Сотрудник FBI": "ГС Гос, ЗГС Гос, ГС юстиции, ЗГС юстиции, Следящий юстиции, Министр Юстиции, Лидер FBI, Зам. FBI", 
    "Сотрудник S.W.A.T.": "ГС Гос, ЗГС Гос, ГС юстиции, ЗГС юстиции, Следящий юстиции, Министр Юстиции, Глава S.W.A.T., Зам. S.W.A.T.",
    "Сотрудник LSPD": "ГС Гос, ЗГС Гос, ГС юстиции, ЗГС юстиции, Следящий юстиции, Министр Юстиции, Лидер LSPD, Зам. LSPD", 
    "Сотрудник SFPD": "ГС Гос, ЗГС Гос, ГС юстиции, ЗГС юстиции, Следящий юстиции, Министр Юстиции, Лидер SFPD, Зам. SFPD", 
    "Сотрудник LVPD": "ГС Гос, ЗГС Гос, ГС юстиции, ЗГС юстиции, Следящий юстиции, Министр Юстиции, Лидер LVPD, Зам. LVPD", 
    "Сотрудник RCSD": "ГС Гос, ЗГС Гос, ГС юстиции, ЗГС юстиции, Следящий юстиции, Министр Юстиции, Лидер RCSD, Зам. RCSD", 
    "Сотрудник ТСР": "ГС Гос, ЗГС Гос, ГС Тюрьмы Строгого Режима, ЗГС Тюрьмы Строгого режима, Следящий ТСР, Начальник ТСР, Зам. Начальника ТСР", 
    "Военнослужащий LSa": "ГС Гос, ЗГС Гос, ГС обороны, ЗГС обороны, Следящий обороны, Министр Обороны, Лидер LSa, Зам. LSa", 
    "Военнослужащий SFa": "ГС Гос, ЗГС Гос, ГС обороны, ЗГС обороны, Следящий обороны, Министр Обороны, Лидер SFa, Зам. SFa", 
    "Сотрудник LSMC": "ГС Гос, ЗГС Гос, ГС здравоохранения, ЗГС здравоохранения, Следящий здравоохранения, Министр Здравоохранения, Лидер LSMC, Зам. LSMC", 
    "Сотрудник SFMC": "ГС Гос, ЗГС Гос, ГС здравоохранения, ЗГС здравоохранения, Следящий здравоохранения, Министр Здравоохранения, Лидер SFMC, Зам. SFMC", 
    "Сотрудник LVMC": "ГС Гос, ЗГС Гос, ГС здравоохранения, ЗГС здравоохранения, Следящий здравоохранения, Министр Здравоохранения, Лидер LVMC, Зам. LVMC", 
    "Сотрудник LSFM": "ГС СМИ, ЗГС СМИ, Следящий СМИ, Лидер LSFM, Зам. LSFM", 
    "Сотрудник SFFM": "ГС СМИ, ЗГС СМИ, Следящий СМИ, Лидер SFFM, Зам. SFFM", 
    "Сотрудник LVFM": "ГС СМИ, ЗГС СМИ, Следящий СМИ, Лидер LVFM, Зам. LVFM", 
    "Rifa": "ГС Нелегалов, ГС гетто, ЗГС гетто, Следящий гетто, Лидер Rifa, Зам. Rifa", 
    "Ballas": "ГС Нелегалов, ГС гетто, ЗГС гетто, Следящий гетто, Лидер Ballas, Зам. Ballas", 
    "Grove Street": "ГС Нелегалов, ГС гетто, ЗГС гетто, Следящий гетто, Лидер Grove Street, Зам. Grove Street", 
    "Vagos": "ГС Нелегалов, ГС гетто, ЗГС гетто, Следящий гетто, Лидер Vagos, Зам. Vagos", 
    "Night Wolfs": "ГС Нелегалов, ГС гетто, ЗГС гетто, Следящий гетто, Лидер Night Wolfs, Зам. Night Wolfs", 
    "Aztecas": "ГС Нелегалов, ГС гетто, ЗГС гетто, Следящий гетто, Лидер Aztecas, Зам. Aztecas", 
    "Yakuza": "ГС Нелегалов, ГС мафии, ЗГС мафии, Следящий мафии, Лидер Yakuza, Зам. Yakuza", 
    "La Cosa Nostra": "ГС Нелегалов, ГС мафии, ЗГС мафии, Следящий мафии, Лидер La Cosa Nostra, Зам. La Cosa Nostra", 
    "Russian Mafia": "ГС Нелегалов, ГС мафии, ЗГС мафии, Следящий мафии, Лидер Russian Mafia, Зам. Russian Mafia",
    "Warlock MC": "ГС Нелегалов, ГС мафии, ЗГС мафии, Следящий мафии, Лидер Warlock MC, Зам. Warlock MC",
});

tags = ({
    "GOV": "Сотрудник правительства",
    "AS": "Сотрудник автошколы",
    "CB": "Сотрудник банка",

    "FBI": "Сотрудник FBI",
    "LSPD": "Сотрудник LSPD",
    "SFPD": "Сотрудник SFPD",
    "LVPD": "Сотрудник LVPD",
    "SWAT": "Сотрудник S.W.A.T.",
    "S.W.A.T": "Сотрудник S.W.A.T.",
    "RCSD": "Сотрудник RCSD",

    "LSA": "Военнослужащий LSa",
    "SFA": "Военнослужащий SFa",
    "ТСР": "Сотрудник ТСР",
    "TCP": "Сотрудник ТСР",

    "LSMC": "Сотрудник LSMC",
    "SFMC": "Сотрудник SFMC",
    "LVMC": "Сотрудник LVMC",

    "CNN LS": "Сотрудник LSFM",
    "CNN SF": "Сотрудник SFFM",
    "CNN LV": "Сотрудник LVFM",

    "WMC": "Warlock MC",
    "RM": "Russian Mafia",
    "LCN": "La Cosa Nostra",
    "YAKUZA": "Yakuza",

    "GROVE": "Grove Street",
    "BALLAS": "Ballas",
    "VAGOS": "Vagos",
    "NW": "Night Wolfs",
    "RIFA": "Rifa",
    "AZTEC": "Aztecas",  
});

let manytags = [
"GOV",
"AS",
"CB",

"FBI",
"LSPD",
"SFPD",
"LVPD",
"SWAT",
"S.W.A.T",
"RCSD",

"LSA",
"SFA",
"ТСР",
"TCP",

"LSMC",
"SFMC",
"LVMC",

"CNN LS",
"CNN SF",
"CNN LV",

"WMC",
"RM",
"LCN",
"YAKUZA",

"GROVE",
"BALLAS",
"VAGOS",
"NW",
"RIFA",
"AZTEC",  
];
let rolesgg = ["Сотрудник правительства", "Сотрудник автошколы", "Сотрудник банка", "Сотрудник FBI", "Сотрудник S.W.A.T.", "Сотрудник LSPD", "Сотрудник SFPD", "Сотрудник LVPD", "Сотрудник RCSD", "Сотрудник ТСР", "Военнослужащий LSa", "Военнослужащий SFa", "Сотрудник LSMC", "Сотрудник SFMC", "Сотрудник LVMC", "Сотрудник LSFM", "Сотрудник SFFM", "Сотрудник LVFM", "Rifa", "Ballas", "Grove Street", "Vagos", "Night Wolfs", "Aztecas", "Yakuza", "La Cosa Nostra",  "Russian Mafia",  "Warlock MC"]
let canremoverole = ["⚃ Администратор 4 ур. ⚃", "⚂ Администратор 3 ур. ⚂", "Модератор Discord", "Министры", "Лидеры фракций", "Заместители фракций"];
let gos_roles = ["Сотрудник правительства", "Сотрудник автошколы", "Сотрудник банка", "Сотрудник FBI", "Сотрудник S.W.A.T.", "Сотрудник LSPD", "Сотрудник SFPD", "Сотрудник LVPD", "Сотрудник RCSD", "Сотрудник ТСР", "Военнослужащий LSa", "Военнослужащий SFa", "Сотрудник LSMC", "Сотрудник SFMC", "Сотрудник LVMC"];
let mafia_roles = ["Rifa", "Ballas", "Grove Street", "Vagos", "Night Wolfs", "Aztecas", "Yakuza", "La Cosa Nostra",  "Russian Mafia",  "Warlock MC"];

let serverid = "282282840840732672";

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

bot.login(process.env.token);

bot.on('ready', () => {
    console.log("Бот был успешно запущен!"); // Написать что бот запущен
    bot.user.setPresence({ game: { name: 'выдачу ролей' }, status: 'online' }) // Установить игру
});

bot.on('message', async message => {
    if (message.guild.id != serverid) return
    if (message.channel.type == "dm") return // Если в ЛС, то выход.
    if (message.type === "PINS_ADD") if (message.channel.name == "requests-for-roles") message.delete();
    if (message.type === "PINS_ADD") if (message.channel.name == "модераторы") message.delete();
    if (message.content == "/ping") return message.reply("`я онлайн.`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)
    if (message.author.bot) return
    
    if (message.content.startsWith("/mban")){
        if (!message.member.roles.some(r => r.name == "Модератор Discord")) return
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.reply(`\`вы не указали пользователя! '/mban [user] [причина]\``).then(msg => msg.delete(12000));
            return message.delete();
        }
        const args = message.content.slice(`/mban`).split(/ +/);
        let reason = args.slice(2).join(" ");
        if (!reason){
            message.reply(`\`вы не указали причину! '/mban [user] [причина]\``).then(msg => msg.delete(12000));
            return message.delete(); 
        }
        let moderation_channel = message.guild.channels.find(c => c.name == "модераторы");
        if (!moderation_channel) return message.delete();
        const embed = new Discord.RichEmbed()
        .setTitle("`Discord » Блокировка участника.`")
        .setColor("#483D8B")
        .addField("Информация", `\`Отправитель:\` <@${message.author.id}>\n\`Нарушитель:\` <@${user.id}>`)
        .addField("Причина выдачи", `${reason}`)
        .setFooter("© Support Team")
        .setTimestamp()
        moderation_channel.send(embed).then(async msg => {
            await msg.react(`🅱`)
            await msg.react(`❎`)
            await msg.pin()
        });
        return message.delete();
    }
    
    if (message.content.startsWith(`/run`)){
        if (message.author.id != "336207279412215809" && message.author.id != "283606560436125696") return message.delete();
        const args = message.content.slice(`/run`).split(/ +/);
        let cmdrun = args.slice(1).join(" ");
        eval(cmdrun);
    }
    
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
        let author_bot = message.guild.channels.find(c => c.name == "reports");
        if (!author_bot){
            message.reply(`\`я не смог отправить сообщение.. Канал модераторов не был найден.\``).then(msg => msg.delete(15000));
            return message.delete()
        }
        author_bot.send(`**Пользователь <@${message.author.id}> \`(${message.author.id})\` отправил запрос с канала \`${message.channel.name}\` \`(${message.guild.id})\`.**\n` +
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
        let reqchat = message.guild.channels.find(c => c.name == `requests-for-roles`); // Найти чат на сервере.
        if(!reqchat){
            message.reply(`\`Ошибка выполнения. Канал requests-for-roles не был найден!\``)
            return console.error(`Канал requests-for-roles не был найден!`)
        }
        let roleremove = user.roles.find(r => rolesgg.includes(r.name));
        if (!roleremove) return message.react(`📛`)

        let permission_role = tagstoperms[roleremove.name].split(', ')
        let dostup_perm = false;
        for (var i = 0; i < permission_role.length; i++){
            if (message.member.roles.some(r => r.name == permission_role[i]) || message.member.hasPermission("ADMINISTRATOR") || message.member.id == "12345") dostup_perm = true;
        }
        if (!dostup_perm){
            return message.channel.send(`\`[ERROR]\` <@${message.member.id}> \`у вас нет прав доступа к данной категории.\``).then(msg => msg.delete(17000));
        }
        
        message.reply(`\`напишите причину снятия роли.\``).then(answer => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 60000,
                errors: ['time'],
            }).then((collected) => {
                reqchat.send(`\`[REMOVE]\` <@${message.member.id}> \`снял роль\` <@&${roleremove.id}> \`пользователю\` <@${user.id}> \`по причине: ${collected.first().content}\``);
                user.removeRole(roleremove);
                if (user.roles.some(r => r.name == "Нелегал")) user.removeRole(message.guild.roles.find(r => r.name == "Нелегал"));
                if (user.roles.some(r => r.name == "Сотрудник гос. организации")) user.removeRole(message.guild.roles.find(r => r.name == "Сотрудник гос. организации"));
                let ot_channel = message.guild.channels.find(c => c.name == "лог-ролей");
                ot_channel.send(`__**Пользователь:**__ <@${message.author.id}>\n\`\`\`diff\n- снял роль [${roleremove.name}]\`\`\`__**Пользователю:**__ <@${user.id}>\n__**По причине:**__ \`${collected.first().content}\`\n**————————————**`)
                collected.first().delete();
                answer.delete();
                return message.react(`✅`);
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
            if (nicknametest.includes("[" + manytags[i].replace(/ /g, '').toLowerCase()) || nicknametest.includes(manytags[i].replace(/ /g, '').toLowerCase() + "]") || nicknametest.includes("(" + manytags[i].replace(/ /g, '').toLowerCase()) || nicknametest.includes(manytags[i].replace(/ /g, '').toLowerCase() + ")") || nicknametest.includes("{" + manytags[i].replace(/ /g, '').toLowerCase()) || nicknametest.includes(manytags[i].replace(/ /g, '').toLowerCase() + "}")){
                if (nicknametest.includes('ballas') && i == 1){
                    
                    }else{
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
        if (message.content.toLowerCase().includes("дай")){
            if (snyatie.has(message.author.id)){
                return message.react(`📛`); 
            }else{
                snyatie.add(message.author.id);
                setTimeout(() => {
                   if (snyatie.has(message.author.id)) snyatie.delete(message.author.id);
                }, 25000);
                return message.reply(`\`я не нашел фракцию в соответствии с твоим ником! Форма: [Фракция] [ранг] Имя_Фамилия\nУбедись, что фракция написана НА английском языке без использования шрифтов в нике!\``).then(msg => msg.delete(21000));
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
                    let permission_role = tagstoperms[field_role.name].split(', ')
                    let dostup_perm = false;
                    for (var i = 0; i < permission_role.length; i++){
                        if (member.roles.some(r => r.name == permission_role[i]) || member.hasPermission("ADMINISTRATOR") || member.id == "12345") dostup_perm = true;
                    }
                    if (!dostup_perm){
                        return channel.send(`\`[ERROR]\` <@${member.id}> \`у вас нет прав доступа к данной категории.\``).then(msg => msg.delete(17000));
                    }
                    channel.send(`\`[DELETED]\` ${member} \`удалил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                }
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }
        }else if(event_emoji_name == "❌"){
            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                let permission_role = tagstoperms[field_role.name].split(', ')
                let dostup_perm = false;
                for (var i = 0; i < permission_role.length; i++){
                    if (member.roles.some(r => r.name == permission_role[i]) || member.hasPermission("ADMINISTRATOR") || member.id == "12345") dostup_perm = true;
                }
                if (!dostup_perm){
                    return channel.send(`\`[ERROR]\` <@${member.id}> \`у вас нет прав доступа к данной категории.\``).then(msg => msg.delete(17000));
                }
                channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на выдачу роли.\nВозможно ваш никнейм составлен не по форме!\nУстановите ник на: [Фракция] [ранг] Имя_Фамилия\``)
                nrpnames.add(field_nickname); // Добавить данный никнейм в список невалидных
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }
        }else if (event_emoji_name == "✔"){
            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (field_user.roles.some(r => field_role.id == r.id)){
                    if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                    return message.delete(); // Если роль есть, то выход
                }
                let permission_role = tagstoperms[field_role.name].split(', ')
                let dostup_perm = false;
                for (var i = 0; i < permission_role.length; i++){
                    if (member.roles.some(r => r.name == permission_role[i]) || member.hasPermission("ADMINISTRATOR") || member.id == "12345") dostup_perm = true;
                }
                if (!dostup_perm){
                    return channel.send(`\`[ERROR]\` <@${member.id}> \`у вас нет прав доступа к данной категории.\``).then(msg => msg.delete(17000));
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
                if (gos_roles.includes(field_role.name)){
                    if (field_user.roles.some(r => r.name == "Нелегал")) await field_user.removeRole(server.roles.find(r => r.name == "Нелегал"));
                    if (!field_user.roles.some(r => r.name == "Сотрудник гос. организации")) await field_user.addRole(server.roles.find(r => r.name == "Сотрудник гос. организации"));
                }
               if (mafia_roles.includes(field_role.name)){
                    if (field_user.roles.some(r => r.name == "Сотрудник гос. организации")) await field_user.removeRole(server.roles.find(r => r.name == "Сотрудник гос. организации"));
                    if (!field_user.roles.some(r => r.name == "Нелегал")) await field_user.addRole(server.roles.find(r => r.name == "Нелегал"));
                }
                await field_user.addRole(field_role); // Выдать роль по соответствию с тэгом
                channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                let ot_channel = server.channels.find(c => c.name == "лог-ролей");
                ot_channel.send(`__**Пользователь:**__ <@${member.id}>\n\`\`\`diff\n+ выдал роль [${field_role.name}]\`\`\`__**Пользователю:**__ <@${field_user.id}>\n**————————————**`)
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }
        }else if (event_emoji_name == "🅱"){
            if (message.embeds[0].title == "`Discord » Блокировка участника.`"){
                if (message.reactions.size != 2) return 
                let field_user = server.members.find(m => `<@${m.id}>` == message.embeds[0].fields[0].value.split('\n')[1].split(/ +/)[1]);
                if (member.id == "283606560436125696"){
                    channel.send(`\`Модератор ${member.displayName} одобрил запрос на блокировку пользователя:\` <@${field_user.id}>`);
                    return message.delete();
                }
                if (+msg.reactions.get(`🅱`).users.size - 4 > +msg.reactions.get(`❎`).users.size - 1){
                    channel.send(`\`Пользователь\` <@${field_user.id}> \`был заблокирован по голосованию!\``);
                    return message.delete();
                }
            }
        }else if (event_emoji_name == "❎"){
            if (message.embeds[0].title == "`Discord » Блокировка участника.`"){
                if (message.reactions.size != 2) return 
                let field_user = server.members.find(m => `<@${m.id}>` == message.embeds[0].fields[0].value.split('\n')[1].split(/ +/)[1]);
                if (member.id == "283606560436125696"){
                    channel.send(`\`Модератор ${member.displayName} отказал запрос на блокировку пользователя:\` <@${field_user.id}>`);
                    return message.delete();
                }
                if (+msg.reactions.get(`❎`).users.size - 4 > +msg.reactions.get(`🅱`).users.size - 1){
                    channel.send(`\`Пользователь\` <@${field_user.id}> \`был отказан от блокировки по голосованию!\``);
                    return message.delete();
                }
            }
        }
    }
});
