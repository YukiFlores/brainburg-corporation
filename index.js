const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");

const nrpnames = new Set(); // Невалидные ники будут записаны в nrpnames
const sened = new Set(); // Уже отправленные запросы будут записаны в sened
const snyatie = new Set(); // КД
const antikick = new Set();
const support_cooldown = new Set(); // Запросы от игроков.
const support_loop = new Set(); 

tagstoperms = ({
    "Сотрудник правительства": "ГС Гос, ЗГС Гос, ГС правительства, ЗГС правительства, Следящий правительства, Лидер правительства, Премьер-Министр, Мэр ЛС, Мэр СФ, Мэр ЛВ",
    "Сотрудник автошколы": "ГС Гос, ЗГС Гос, Лидер автошколы, Зам. автошколы",
    "Сотрудник банка": "ГС Гос, ЗГС Гос, Лидер банка, Зам. банка", 
    "Сотрудник FBI": "ГС Гос, ЗГС Гос, ГС юстиции, ЗГС юстиции, Следящий юстиции, Министр Юстиции, Лидер FBI, Зам. FBI", 
    "Академист FBI": "ГС Гос, ЗГС Гос, ГС юстиции, ЗГС юстиции, Следящий юстиции, Министр Юстиции, Лидер FBI, Зам. FBI", 
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
let rolesgg = ["Сотрудник правительства", "Сотрудник автошколы", "Сотрудник банка", "Академист FBI", "Сотрудник FBI", "Сотрудник S.W.A.T.", "Сотрудник LSPD", "Сотрудник SFPD", "Сотрудник LVPD", "Сотрудник RCSD", "Сотрудник ТСР", "Военнослужащий LSa", "Военнослужащий SFa", "Сотрудник LSMC", "Сотрудник SFMC", "Сотрудник LVMC", "Сотрудник LSFM", "Сотрудник SFFM", "Сотрудник LVFM", "Сотрудник ОПЭ СМИ", "Сотрудник ОТ СМИ", "Rifa", "Ballas", "Grove Street", "Vagos", "Night Wolfs", "Aztecas", "Yakuza", "La Cosa Nostra",  "Russian Mafia",  "Warlock MC"]
let canremoverole = ["⚃ Администратор 4 ур. ⚃", "⚂ Администратор 3 ур. ⚂", "Модератор Discord", "Министры", "Лидеры фракций", "Заместители фракций"];
let gos_roles = ["Сотрудник правительства", "Сотрудник автошколы", "Сотрудник банка", "Академист FBI", "Сотрудник FBI", "Сотрудник S.W.A.T.", "Сотрудник LSPD", "Сотрудник SFPD", "Сотрудник LVPD", "Сотрудник RCSD", "Сотрудник ТСР", "Военнослужащий LSa", "Военнослужащий SFa", "Сотрудник LSMC", "Сотрудник SFMC", "Сотрудник LVMC"];
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
    
    
    let re = /(\d+(\.\d)*)/i;
    
    if (!support_loop.has(message.guild.id) && message.channel.name != "support"){
        support_loop.add(message.guild.id)
        setTimeout(() => {
            if (support_loop.has(message.guild.id)) support_loop.delete(message.guild.id);
        }, 600000);
        message.guild.channels.forEach(async channel => {
            if (channel.name.startsWith('ticket-')){
                if (message.guild.channels.find(c => c.id == channel.parentID).name == 'Корзина'){
                    let log_channel = message.guild.channels.find(c => c.name == "reports");
                    channel.fetchMessages({limit: 1}).then(async messages => {
                        if (messages.size == 1){
                            messages.forEach(async msg => {
                                let s_now = new Date().valueOf() - 86400000;
                                if (msg.createdAt.valueOf() < s_now){
                                    let archive_messages = [];
                                    await channel.fetchMessages({limit: 100}).then(async messagestwo => {
                                        messagestwo.forEach(async msgcopy => {
                                            let date = new Date(+msgcopy.createdAt.valueOf() + 10800000);
                                            let formate_date = `[${date.getFullYear()}-` + 
                                            `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
                                            `${date.getDate().toString().padStart(2, '0')} ` + 
                                            `${date.getHours().toString().padStart(2, '0')}-` + 
                                            `${date.getMinutes().toString().padStart(2, '0')}-` + 
                                            `${date.getSeconds().toString().padStart(2, '0')}]`;
                                            if (!msgcopy.embeds[0]){
                                                archive_messages.push(`${formate_date} ${msgcopy.member.displayName}: ${msgcopy.content}`);
                                            }else{
                                                archive_messages.push(`[К СООБЩЕНИЮ БЫЛО ДОБАВЛЕНО] ${msgcopy.embeds[0].fields[1].value}`);
                                                archive_messages.push(`[К СООБЩЕНИЮ БЫЛО ДОБАВЛЕНО] ${msgcopy.embeds[0].fields[0].value}`);
                                                archive_messages.push(`${formate_date} ${msgcopy.member.displayName}: ${msgcopy.content}`);
                                            }
                                        });
                                    });
                                    let i = archive_messages.length - 1;
                                    while (i>=0){
                                        await fs.appendFileSync(`./${channel.name}.txt`, `${archive_messages[i]}\n`);
                                        i--
                                    }
                                    await log_channel.send(`\`[SYSTEM]\` \`Канал ${channel.name} был удален. [24 часа в статусе 'Закрыт']\``, { files: [ `./${channel.name}.txt` ] });
                                    channel.delete();
                                    fs.unlinkSync(`./${channel.name}.txt`);
                                }
                            });
                        }
                    });
                }else if(message.guild.channels.find(c => c.id == channel.parentID).name == 'Активные жалобы'){
                    let log_channel = message.guild.channels.find(c => c.name == "модераторы");
                    channel.fetchMessages({limit: 1}).then(messages => {
                        if (messages.size == 1){
                            messages.forEach(msg => {
                                let s_now = new Date().valueOf() - 18000000;
                                if (msg.createdAt.valueOf() < s_now){
                                    log_channel.send(`\`[SYSTEM]\` \`Жалоба\` <#${channel.id}> \`уже более 5-ти часов ожидает проверки!\``);
                                    channel.send(`\`[SYSTEM]\` \`Привет! Я напомнил модераторам про твое обращение!\``)
                                }
                            });
                        }
                    });
                }
            }
        });
        // UNWARN SYSTEM
        let dataserver = bot.guilds.find(g => g.id == "521639035442036736");
        dataserver.channels.forEach(async channel => {
            if (channel.type=="text"){
                if (dataserver.channels.find(c => c.id == channel.parentID).name == 'db_users'){
                    await channel.fetchMessages({limit: 1}).then(async messages => {
                        if (messages.size == 1){
                            messages.forEach(async sacc => {
                                let str = sacc.content;
                                let moderation_level = str.split('\n')[0].match(re)[0];
                                let moderation_warns = str.split('\n')[1].match(re)[0];
                                let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
                                let moderation_reason = [];
                                let user_reason = [];
                                let moderation_time = [];
                                let user_time = [];
                                let moderation_give = [];
                                let user_give = [];
            
                                let circle = 0;
                                while (+moderation_warns > circle){
                                    moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
                                    moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
                                    moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
                                    circle++;
                                }
                
                                circle = 0;
                                while (+user_warns > circle){
                                    let myDate = new Date().valueOf();
                                    if (+str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1] > myDate){
                                        user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                                        user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                                        user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                                    }else{
                                        user_warns--
                                        let genchannel = message.guild.channels.find(c => c.name == "🌐welcome");
                                        genchannel.send(`<@${channel.name}>, \`вам было снято одно предупреждение. [Прошло 3 дня]\``);
                                    }
                                    circle++;
                                }
                                let text_end = `Уровень модератора: ${moderation_level}\n` + 
                                `Предупреждения модератора: ${moderation_warns}`;
                                for (var i = 0; i < moderation_reason.length; i++){
                                    text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
                                }
                                text_end = text_end + `\nПредупреждений: ${+user_warns}`;
                                for (var i = 0; i < user_reason.length; i++){
                                    text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
                                }
                                if (+moderation_level == 0 && +moderation_warns == 0 && +user_warns == 0){
                                    channel.delete();
                                }else{
                                    sacc.edit(text_end);
                                }
                            });
                        }
                    });
                }
            }
        });
    }
    
    if (message.channel.name == "support"){
        if (message.member.bot) return message.delete();
        if (support_cooldown.has(message.author.id)) {
            return message.delete();
        }
        support_cooldown.add(message.author.id);
        setTimeout(() => {
            if (support_cooldown.has(message.author.id)) support_cooldown.delete(message.author.id);
        }, 300000);
        let id_mm;
        let rep_message;
        let db_server = bot.guilds.find(g => g.id == "521639035442036736");
        let db_channel = db_server.channels.find(c => c.name == "config");
        await db_channel.fetchMessages().then(async messages => {
            let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
            if (db_msg){
                id_mm = db_msg.content.match(re)[0]
                await message.channel.fetchMessages().then(async messagestwo => {
                    rep_message = await messagestwo.find(m => m.id == id_mm);
                });
            }
        });
        if (!rep_message){
            await message.channel.send(`` +
            `**Приветствую! Вы попали в канал поддержки сервера Arizona Brainburg!**\n` +
            `**Тут Вы сможете отправить обращение модераторам сервера!**\n\n` +
            `**Количество вопросов за все время: 0**\n` +
            `**Необработанных модераторами: 0**\n` +
            `**Вопросы на рассмотрении: 0**\n` +
            `**Закрытых: 0**`).then(async msg => {
                db_channel.send(`MESSAGEID: ${msg.id}`)
                rep_message = await message.channel.fetchMessage(msg.id);
            });
        }
        let info_rep = [];
        info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
        rep_message.edit(`` +
            `**Приветствую! Вы попали в канал поддержки сервера Arizona Brainburg!**\n` +
            `**Тут Вы сможете отправить обращение модераторам сервера!**\n\n` +
            `**Количество вопросов за все время: ${+info_rep[0] + 1}**\n` +
            `**Необработанных модераторами: ${+info_rep[1] + 1}**\n` +
            `**Вопросы на рассмотрении: ${info_rep[2]}**\n` +
            `**Закрытых: ${info_rep[3]}**`)
        let s_category = message.guild.channels.find(c => c.name == "Активные жалобы");
        if (!s_category) return message.delete(3000);
        await message.guild.createChannel(`ticket-${+info_rep[0] + 1}`).then(async channel => {
            message.delete();    
            await channel.setParent(s_category.id);
            await channel.setTopic('Жалоба в обработке.')
            let moderator_role = await message.guild.roles.find(r => r.name == 'Модератор Discord');
            let bot_role = await message.guild.roles.find(r => r.name == '[-] Moderation [-]');
            
            await channel.overwritePermissions(bot_role, {
            // 🌐welcome PERMISSIONS
            CREATE_INSTANT_INVITE: true,
            MANAGE_CHANNELS: true,
            MANAGE_ROLES: true,
            MANAGE_WEBHOOKS: true,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: true,
            MANAGE_MESSAGES: true,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: true,
            USE_EXTERNAL_EMOJIS: true,
            ADD_REACTIONS: true,
            })  
            
            await channel.overwritePermissions(moderator_role, {
            // 🌐welcome PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
            })  
            await channel.overwritePermissions(message.member, {
            // 🌐welcome PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
            })  
            await channel.overwritePermissions(message.guild.roles.find(r => r.name == "@everyone"), {
            // 🌐welcome PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
            })  
            channel.send(`<@${message.author.id}> \`для команды поддержки\` <@&${moderator_role.id}>`, {embed: {
            color: 3447003,
            title: "Обращение к поддержке Discord",
            fields: [{
                name: "Отправитель",
                value: `**Пользователь:** <@${message.author.id}>`,
            },{
                name: "Суть обращения",
                value: `${message.content}`,
            }]
            }});
            let sp_chat_get = message.guild.channels.find(c => c.name == "reports");
            await sp_chat_get.send(`\`[CREATE]\` <@${message.author.id}> \`создал обращение к поддержке:\` <#${channel.id}>`);
            message.channel.send(`<@${message.author.id}>, \`обращение составлено. Нажмите на\` <#${channel.id}>`).then(msg => msg.delete(15000));
        });
    }

    if (message.content == '/hold'){
        if (!message.member.hasPermission("MANAGE_ROLES") && !message.roles.some(r => ["Модератор Discord", "⚂ Администратор 3 ур. ⚂", "⚃ Администратор 4 ур. ⚃"].includes(r.name))) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.' || message.channel.topic == 'Жалоба на рассмотрении.') return message.delete();
        let memberid;
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
                memberid = await perm.id;
            }
        });
        let rep_message;
        let db_server = bot.guilds.find(g => g.id == "521639035442036736");
        let db_channel = db_server.channels.find(c => c.name == "config");
        await db_channel.fetchMessages().then(async messages => {
            let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
            if (db_msg){
                id_mm = db_msg.content.match(re)[0]
                let ticket_channel = message.guild.channels.find(c => c.name == 'support');
                await ticket_channel.fetchMessages().then(async messagestwo => {
                    rep_message = await messagestwo.find(m => m.id == id_mm);
                });
            }
        });
        console.log("CHECK3");
        if (!rep_message) return message.delete();
        let info_rep = [];
        info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
        console.log("CHECK4");
        rep_message.edit(`` +
        `**Приветствую! Вы попали в канал поддержки сервера Arizona Brainburg!**\n` +
        `**Тут Вы сможете отправить обращение модераторам сервера!**\n\n` +
        `**Количество вопросов за все время: ${info_rep[0]}**\n` +
        `**Необработанных модераторами: ${+info_rep[1] - 1}**\n` +
        `**Вопросы на рассмотрении: ${+info_rep[2] + 1}**\n` +
        `**Закрытых: ${info_rep[3]}**`)
        console.log("CHECK5");
        let s_category = message.guild.channels.find(c => c.name == "Жалобы на рассмотрении");
        if (!s_category) return message.delete(3000);
        await message.channel.setParent(s_category.id);
        console.log("CHECK6");
        let sp_chat_get = message.guild.channels.find(c => c.name == "reports");
        message.channel.setTopic('Жалоба на рассмотрении.')
        message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'На рассмотрении'. Источник: ${message.member.displayName}\``);
        sp_chat_get.send(`\`[HOLD]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
        message.delete();
    }

    if (message.content == '/active'){
        if (!message.member.hasPermission("MANAGE_ROLES") && !message.roles.some(r => ["Модератор Discord", "⚂ Администратор 3 ур. ⚂", "⚃ Администратор 4 ур. ⚃"].includes(r.name))) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.' || message.channel.topic != 'Жалоба на рассмотрении.') return message.delete();
        let memberid;
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
                memberid = await perm.id;
            }
        });
        let rep_message;
        let db_server = bot.guilds.find(g => g.id == "521639035442036736");
        let db_channel = db_server.channels.find(c => c.name == "config");
        await db_channel.fetchMessages().then(async messages => {
            let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
            if (db_msg){
                id_mm = db_msg.content.match(re)[0]
                let ticket_channel = message.guild.channels.find(c => c.name == 'support');
                await ticket_channel.fetchMessages().then(async messagestwo => {
                    rep_message = await messagestwo.find(m => m.id == id_mm);
                });
            }
        });
        if (!rep_message) return message.delete();
        let info_rep = [];
        info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
        rep_message.edit(`` +
            `**Приветствую! Вы попали в канал поддержки сервера Arizona Brainburg!**\n` +
            `**Тут Вы сможете отправить обращение модераторам сервера!**\n\n` +
            `**Количество вопросов за все время: ${info_rep[0]}**\n` +
            `**Необработанных модераторами: ${+info_rep[1] + 1}**\n` +
            `**Вопросы на рассмотрении: ${+info_rep[2] - 1}**\n` +
            `**Закрытых: ${info_rep[3]}**`)
        let s_category = message.guild.channels.find(c => c.name == "Активные жалобы");
        if (!s_category) return message.delete(3000);
        await message.channel.setParent(s_category.id);
        let sp_chat_get = message.guild.channels.find(c => c.name == "reports");
        message.channel.setTopic('Жалоба в обработке.');
        message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'В обработке'. Источник: ${message.member.displayName}\``);
        sp_chat_get.send(`\`[UNWAIT]\` \`Модератор ${message.member.displayName} убрал жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
        message.delete();
    }
    
    if (message.content == '/toadmin'){
        if (!message.member.hasPermission("MANAGE_ROLES") && !message.roles.some(r => ["Модератор Discord", "⚂ Администратор 3 ур. ⚂", "⚃ Администратор 4 ур. ⚃"].includes(r.name))) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.') return message.delete();
        let memberid;
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
                memberid = await perm.id;
            }
        });
        await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == 'Модератор Discord'), {
            // 🌐welcome PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
        })  

        await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == '⚃ Администратор 4 ур. ⚃'), {
            // 🌐welcome PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
        }) 

        await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == '⚂ Администратор 3 ур. ⚂'), {
            // 🌐welcome PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
        })  
        let sp_chat_get = message.guild.channels.find(c => c.name == "reports");
        message.channel.send(`\`[STATUS]\` <@${memberid}>, \`ваше обращение было передано администрации. Источник: ${message.member.displayName}\``);
        sp_chat_get.send(`\`[ADMIN]\` \`Модератор ${message.member.displayName} передал жалобу\` <#${message.channel.id}> \`администрации.\``);
        message.delete();
    }

    if (message.content == '/close'){
        if (!message.member.hasPermission("MANAGE_ROLES") && !message.roles.some(r => ["Модератор Discord", "⚂ Администратор 3 ур. ⚂", "⚃ Администратор 4 ур. ⚃"].includes(r.name))) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.') return message.delete();
        let full_support = false;
        let s_category = message.guild.channels.find(c => c.name == "Корзина");
        if (!s_category) return message.delete(3000);
        await message.channel.setParent(s_category.id).catch(err => {
            full_support = true;
        });
        if (full_support){
            message.reply(`\`корзина заполнена! Повторите попытку чуть позже!\``).then(msg => msg.delete(12000));
            return message.delete();  
        }
        let memberid;
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
            memberid = await perm.id;
            }
        });
        let rep_message;
        let db_server = bot.guilds.find(g => g.id == "521639035442036736");
        let db_channel = db_server.channels.find(c => c.name == "config");
        await db_channel.fetchMessages().then(async messages => {
            let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
            if (db_msg){
                id_mm = db_msg.content.match(re)[0]
                let ticket_channel = message.guild.channels.find(c => c.name == 'support');
                await ticket_channel.fetchMessages().then(async messagestwo => {
                    rep_message = await messagestwo.find(m => m.id == id_mm);
                });
            }
        });
        if (!rep_message) return message.delete();
        let info_rep = [];
        info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
        info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
        if (message.channel.topic == 'Жалоба на рассмотрении.'){
            rep_message.edit(`` +
            `**Приветствую! Вы попали в канал поддержки сервера Arizona Brainburg!**\n` +
            `**Тут Вы сможете отправить обращение модераторам сервера!**\n\n` +
            `**Количество вопросов за все время: ${info_rep[0]}**\n` +
            `**Необработанных модераторами: ${info_rep[1]}**\n` +
            `**Вопросы на рассмотрении: ${+info_rep[2] - 1}**\n` +
            `**Закрытых: ${+info_rep[3] + 1}**`)
        }else{
            rep_message.edit(`` +
            `**Приветствую! Вы попали в канал поддержки сервера Arizona Brainburg!**\n` +
            `**Тут Вы сможете отправить обращение модераторам сервера!**\n\n` +
            `**Количество вопросов за все время: ${info_rep[0]}**\n` +
            `**Необработанных модераторами: ${+info_rep[1] - 1}**\n` +
            `**Вопросы на рассмотрении: ${info_rep[2]}**\n` +
            `**Закрытых: ${+info_rep[3] + 1}**`)
        }
        await message.channel.overwritePermissions(message.guild.members.find(m => m.id == memberid), {
            // 🌐welcome PERMISSIONS
            CREATE_INSTANT_INVITE: false,
            MANAGE_CHANNELS: false,
            MANAGE_ROLES: false,
            MANAGE_WEBHOOKS: false,
            // TEXT PERMISSIONS
            VIEW_CHANNEL: true,
            SEND_MESSAGES: false,
            SEND_TTS_MESSAGES: false,
            MANAGE_MESSAGES: false,
            EMBED_LINKS: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: true,
            MENTION_EVERYONE: false,
            USE_EXTERNAL_EMOJIS: false,
            ADD_REACTIONS: false,
        }) 
        let sp_chat_get = message.guild.channels.find(c => c.name == "reports");
        message.channel.setTopic('Жалоба закрыта.');
        message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'Закрыта'. Источник: ${message.member.displayName}\``);
        sp_chat_get.send(`\`[CLOSE]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'Закрыта'.\``);
        message.delete();
    }
    
    
    if (message.content.startsWith("/mkick")){
        if (!message.member.roles.some(r => r.name == "Модератор Discord") && !message.member.hasPermission("ADMINISTRATOR")) return
        if (antikick.has(message.author.id)) return message.delete();
        let moderation_channel = message.guild.channels.find(c => c.name == "модераторы");
        let dis_log = message.guild.channels.find(c => c.name == "dis-log");
        if (!moderation_channel || !dis_log) return message.delete();
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.reply(`\`вы не указали пользователя! '/mkick [user] [причина]'\``).then(msg => msg.delete(12000));
            return message.delete();
        }
        if (user.hasPermission("ADMINISTRATOR") || user.roles.some(r => ["♥ OldFAG ♥", "❖ Боты ❖", "Модератор Discord", "⚀ Администратор 1 ур. ⚀", "⚁ Администратор 2 ур. ⚁", "⚂ Администратор 3 ур. ⚂", "⚃ Администратор 4 ур. ⚃"].includes(r.name))){
            message.reply(`\`[ERROR]\` \`Данного пользователя нельзя кикнуть!\``);
            return message.delete();
        }
        const args = message.content.slice(`/mkick`).split(/ +/);
        let reason = args.slice(2).join(" ");
        if (!reason){
            message.reply(`\`вы не указали причину! '/mkick [user] [причина]'\``).then(msg => msg.delete(12000));
            return message.delete(); 
        }
        user.kick(reason + " / " + message.member.displayName);
        antikick.add(message.author.id);
        setTimeout(() => {
               if (antikick.has(message.author.id)) antikick.delete(message.author.id);
        }, 30000);
        let testcase = new Date().valueOf();
        const embed = new Discord.RichEmbed()
        .setAuthor(`Случай ${testcase} | KICK | ${user.nickname}`)
        .addField(`Пользователь`, `<@${user.id}>`, true)
        .addField(`Модератор`, `<@${message.author.id}>`, true)
        .addField(`Причина`, `${reason}`, true)
        dis_log.send(embed)
        return message.delete()
    }
    
    if (message.content.startsWith("/mban")){
        if (!message.member.roles.some(r => r.name == "Модератор Discord") && !message.member.hasPermission("ADMINISTRATOR")) return
        let moderation_channel = message.guild.channels.find(c => c.name == "модераторы");
        if (!moderation_channel) return message.delete();
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.reply(`\`вы не указали пользователя! '/mban [user] [причина]'\``).then(msg => msg.delete(12000));
            return message.delete();
        }
        if (user.hasPermission("ADMINISTRATOR") || user.roles.some(r => ["♥ OldFAG ♥", "❖ Боты ❖", "Модератор Discord", "⚀ Администратор 1 ур. ⚀", "⚁ Администратор 2 ур. ⚁", "⚂ Администратор 3 ур. ⚂", "⚃ Администратор 4 ур. ⚃"].includes(r.name))){
            message.reply(`\`[ERROR]\` \`К твоему сожалению данного пользователя заблокировать нельзя :/\``);
            return message.delete();
        }
        let info_user = "Пользователь";
        if (user.roles.some(r => ["Министры"].includes(r.name))){
            info_user = "Министр";
        }else if (user.roles.some(r => ["Лидеры фракций"].includes(r.name))){
            info_user = "Лидер фракции";
        }else if (user.roles.some(r => ["Заместители фракций"].includes(r.name))){
            info_user = "Заместитель фракции";
        }
        const args = message.content.slice(`/mban`).split(/ +/);
        let reason = args.slice(2).join(" ");
        if (!reason){
            message.reply(`\`вы не указали причину! '/mban [user] [причина]'\``).then(msg => msg.delete(12000));
            return message.delete(); 
        }
        const embed = new Discord.RichEmbed()
        .setTitle("`Discord » Блокировка участника.`")
        .setColor("#483D8B")
        .addField("Информация", `\`Отправитель:\` <@${message.author.id}>\n\`Нарушитель:\` <@${user.id}>\n\`Статус нарушителя:\` **${info_user}**`)
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
        if (message.mentions.users.size > 1) return 
        let user = message.guild.member(message.mentions.users.first());
        if (!user) return
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
            if (message.member.roles.some(r => r.name == permission_role[i]) || message.member.hasPermission("ADMINISTRATOR") || message.member.roles.some(r => r.name == "Модератор Discord")) dostup_perm = true;
        }
        if (!dostup_perm){
            return message.channel.send(`\`[ERROR]\` <@${message.member.id}> \`у вас нет прав доступа к данной категории.\``).then(msg => msg.delete(17000));
        }
        
        message.reply(`\`напишите причину снятия роли. Пример: "ушёл псж"\``).then(answer => {
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
        if (message.channel.name != "🌐welcome" && message.channel.name != "модераторы") return
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
            message.react(`📛`); // Поставить знак стоп под отправленным сообщением.
            return // Выход
        }
        if (message.member.roles.some(r => ["Министры", "Лидеры фракций", "Заместители фракций"].includes(r.name))){
            message.reply(`\`[ERROR]\` \`Вам нельзя отправлять запрос на выдачу роли.\``).then(msg => msg.delete(12000));
            return message.delete();
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
                        let for_check = tagstoperms[role.name].split(', ');
let mention = null;
for (var i = 0; i < for_check.length; i++){
    if (for_check[i].startsWith("Лидер") || for_check[i].startsWith("Зам.") || for_check[i].startsWith("Мэр") || for_check[i].startsWith("Премьер-Министр") || for_check[i].startsWith("Глава") || for_check[i].startsWith("Начальник")){

if (mention == null){
mention = `<@&${message.guild.roles.find(r => r.name == for_check[i]).id}>`
}else{
mention = mention + `, <@&${message.guild.roles.find(r => r.name == for_check[i]).id}>`
}

}
}
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
                reqchat.send(`${mention}`, embed).then(async msgsen => {
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
        
        if (event_emoji_name == '🗑'){
            if (member.roles.some(r => r.name == "Модератор Discord") || member.hasPermission("ADMINISTRATOR")){
                if (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.some(r => ["♥ OldFAG ♥", "❖ Боты ❖", "Модератор Discord", "⚀ Администратор 1 ур. ⚀", "⚁ Администратор 2 ур. ⚁", "⚂ Администратор 3 ур. ⚂", "⚃ Администратор 4 ур. ⚃"].includes(r.name))) return
                if (message.content.length > 0 && message.attachments.size > 0){
                    await server.channels.find(c => c.name == "dis-log").send(`\`Модератор\` <@${member.id}> \`удалил файл с сообщением от\` <@${message.author.id}> \`в\` <#${channel.id}> - ${message.content}`, { files: [ `${message.attachments.first().url}` ] });
                    message.delete();
                }else if (message.content.length <= 0){
                    await server.channels.find(c => c.name == "dis-log").send(`\`Модератор\` <@${member.id}> \`удалил файл от\` <@${message.author.id}> \`в\` <#${channel.id}> `, { files: [ `${message.attachments.first().url}` ] });
                    message.delete();
                }else if (message.attachments.size <= 0){
                    await server.channels.find(c => c.name == "dis-log").send(`\`Модератор\` <@${member.id}> \`удалил сообщение от\` <@${message.author.id}> \`в\` <#${channel.id}> - ${message.content}`);
                    message.delete();
                }
            }
        }

        if (channel.name != `requests-for-roles` && channel.name != `модераторы`) return // Если название канала не будет 'requests-for-roles', то выйти
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
            if (message.embeds[0]){
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
            }
        }else if (event_emoji_name == "✔"){
            if (message.embeds[0]){
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
            }
        }else if (event_emoji_name == "🅱"){
            if (message.embeds[0]){
                if (message.embeds[0].title == "`Discord » Блокировка участника.`"){
                    let field_user = server.members.find(m => `<@${m.id}>` == message.embeds[0].fields[0].value.split('\n')[1].split(/ +/)[1]);
                    let reason_ban = await message.embeds[0].fields[1].value;
                    let who_send = await server.members.find(m => `<@${m.id}>` == message.embeds[0].fields[0].value.split('\n')[0].split(/ +/)[1]);
                    if (event_userid == "283606560436125696"){
                        channel.send(`\`Администратор ${member.displayName} одобрил запрос на блокировку пользователя:\` <@${field_user.id}>\n\`Причина: ${reason_ban}, отправлял: ${who_send.displayName}\``);
                        message.delete();
                        return field_user.ban(reason_ban + " by " + who_send.displayName);
                    }
                    let accepted_ban = await message.reactions.get(`🅱`).users.size - 3
                    let deny_ban = await message.reactions.get(`❎`).users.size - 1
                    if (accepted_ban > deny_ban){
                        await message.reactions.get(`🅱`).users.forEach(async user => {
                            await fs.appendFileSync(`./${message.id}.txt`, `[YES] ${user.username}, ID: ${user.id}\n`);
                        })

                        await message.reactions.get(`❎`).users.forEach(async user => {
                            await fs.appendFileSync(`./${message.id}.txt`, `[NO] ${user.username}, ID: ${user.id}\n`);
                        })
                        await channel.send(`\`Пользователь\` <@${field_user.id}> \`был заблокирован по голосованию модераторов по причине: ${reason_ban}\nОтправлял: ${who_send.displayName}, за блокировку: ${+accepted_ban + 2}, против: ${+deny_ban}\``, { files: [ `./${message.id}.txt` ] });
                        await message.delete();
                        fs.unlinkSync(`./${message.id}.txt`);
                        return field_user.ban(reason_ban + ` by ${who_send.displayName}`)
                    }
                }
            }
        }else if (event_emoji_name == "❎"){
            if (message.embeds[0]){
                if (message.embeds[0].title == "`Discord » Блокировка участника.`"){ 
                    let field_user = server.members.find(m => `<@${m.id}>` == message.embeds[0].fields[0].value.split('\n')[1].split(/ +/)[1]);
                    let reason_ban = await message.embeds[0].fields[1].value;
                    let who_send = await server.members.find(m => `<@${m.id}>` == message.embeds[0].fields[0].value.split('\n')[0].split(/ +/)[1]);
                    if (event_userid == "283606560436125696"){
                        channel.send(`\`Администратор ${member.displayName} отказал запрос на блокировку пользователя:\` <@${field_user.id}>\n\`Причина бана: ${reason_ban}, отправлял: ${who_send.displayName}\``);
                        return message.delete();
                    }
                    let accepted_ban = await message.reactions.get(`🅱`).users.size - 1
                    let deny_ban = await message.reactions.get(`❎`).users.size - 3
                    if (deny_ban > accepted_ban){
                        await message.reactions.get(`🅱`).users.forEach(async user => {
                            await fs.appendFileSync(`./${message.id}.txt`, `[YES] ${user.username}, ID: ${user.id}\n`);
                        })

                        await message.reactions.get(`❎`).users.forEach(async user => {
                            await fs.appendFileSync(`./${message.id}.txt`, `[NO] ${user.username}, ID: ${user.id}\n`);
                        })
                        await channel.send(`\`Пользователь\` <@${field_user.id}> \`был отказан от блокировки по голосованию модераторов. Причина бана: ${reason_ban}!\nОтправлял: ${who_send.displayName}, за блокировку: ${+accepted_ban}, против: ${+deny_ban + 2}\``, { files: [ `./${message.id}.txt` ] });
                        await message.delete();
                        fs.unlinkSync(`./${message.id}.txt`);
                        return
                    }
                }
            }
        }
    }
});
