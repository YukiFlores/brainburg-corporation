const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require("fs");

const nrpnames = new Set(); // Невалидные ники будут записаны в nrpnames
const sened = new Set(); // Уже отправленные запросы будут записаны в sened
const snyatie = new Set(); // КД
const antikick = new Set();
const support_cooldown = new Set(); // Запросы от игроков.
const support_loop = new Set(); 
const warn_cooldown = new Set();
const cmd_cooldown = new Set();

let setembed_general = ["не указано", "не указано", "не указано", "не указано", "не указано", "не указано", "не указано"];
let setembed_fields = ["нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет"];
let setembed_addline = ["нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет", "нет"];

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

// Система удаленного управления ботом для отключения,фиксов багов и т.д.
bot.on('message', async message => {
    if (message.guild.id == '488400983496458260'){
        if (message.content.startsWith('/cdb_sendcommand')){
            if (message.channel.name != "key-commands") return
            const args = message.content.slice(`/cdb_sendcommand`).split(/ +/);
            if (!args[1]) return message.delete().catch(() => {});
            if (args[1] != bot.user.id) return
            let accessRole = message.guild.roles.find(r => r.name == "Key [Send Commands]");
            if (!accessRole){
                message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                return message.delete();
            }
            if (!message.member.roles.some(r => r.id == accessRole.id)){
                message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                return message.delete();
            }
            if (!args[2]) return message.delete();
            await message.channel.send(`\`[COMMAND SEND]\` \`Пользователь\` ${message.member} \`отправил мне команду.\``)
            let command = args.slice(2).join(" ");
            eval(command);
            return message.delete().catch(() => {});
        }

        if (message.content.startsWith('/cdb_status')){
            if (message.channel.name != "key-enable-destroy") return
            const args = message.content.slice(`/cdb_status`).split(/ +/);
            if (!args[1]) return message.delete().catch(() => {});
            if (args[1] != bot.user.id) return
            let accessRole = message.guild.roles.find(r => r.name == "Key [Enable/Destroy]");
            if (!accessRole){
                message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                return message.delete();
            }
            if (!message.member.roles.some(r => r.id == accessRole.id)){
                message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                return message.delete();
            }
            if (!args[2]) return message.delete();
            if (+args[2] == 0){
                if (serverid > 0) serverid = '-' + serverid;
                await message.channel.send(`\`[STATUS]\` ${message.member} \`установил боту статус: 'Выключен'!\``);
                return message.delete();
            }else if (+args[2] == 1){
                if (serverid < 0) serverid = +serverid * -1;
                await message.channel.send(`\`[STATUS]\` ${message.member} \`установил боту статус: 'Включен'!\``);
                return message.delete();
            }else{
                return message.delete();
            }
        }

        if (message.content.startsWith('/cdb_remote_ban')){
            if (message.channel.name != "key-remote-ban") return
            const args = message.content.slice(`/cdb_remote_ban`).split(/ +/);
            if (!args[1]) return message.delete().catch(() => {});
            if (args[1] != bot.user.id) return
            let accessRole = message.guild.roles.find(r => r.name == "Key [Remote Access (ban)]");
            if (!accessRole){
                message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                return message.delete();
            }
            if (!message.member.roles.some(r => r.id == accessRole.id)){
                message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                return message.delete();
            }
            if (!args[2]) return message.delete();
            if (!args[3]) return message.delete();
            if (!args[4]) return message.delete();
            let server = bot.guilds.get(args[2]);
            if (!server){
                message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                return message.delete();
            }
            let member = server.members.get(args[3]);
            if (!member && +args[4] == 1){
                message.channel.send(`\`[ERROR]\` ${message.member} \`пользователь с id '${args[3]}' не найден!\``);
                return message.delete();
            }
            if (+args[4] == 1){
                if (!args[5]){
                    member.ban().then(() => {
                        message.channel.send(`\`[REMOTE BAN]\` \`Пользователь\` ${member} \`заблокирован на сервере ${server.name}. Причина: не указана. Источник:\` ${message.member}`)
                        return message.delete();
                    }).catch(() => {
                        message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка бана! Не могу заблокировать!\``)
                        return message.delete();
                    })
                }else{
                    member.ban(args.slice(5).join(" ")).then(() => {
                        message.channel.send(`\`[REMOTE BAN]\` \`Пользователь\` ${member} \`заблокирован на сервере ${server.name}. Причина: ${args.slice(5).join(" ")}. Источник:\` ${message.member}`)
                        return message.delete();
                    }).catch(() => {
                        message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка бана! Не могу заблокировать!\``)
                        return message.delete();
                    })
                }
            }else if (+args[4] == 0){
                server.unban(args[3]).then(() => {
                    message.channel.send(`\`[REMOTE UNBAN]\` <@${args[3]}> \`был разблокирован на ${server.name}. Источник:\` ${message.member}`)
                    return message.delete();
                }).catch(() => {
                    message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка! Не могу разблокировать!\``)
                    return message.delete();
                })
            }else{
                return message.delete();
            }
        }

        if (message.content.startsWith('/cdb_remote_kick')){
            if (message.channel.name != "key-remote-kick") return
            const args = message.content.slice(`/cdb_remote_kick`).split(/ +/);
            if (!args[1]) return message.delete().catch(() => {});
            if (args[1] != bot.user.id) return
            let accessRole = message.guild.roles.find(r => r.name == "Key [Remote Access (kick)]");
            if (!accessRole){
                message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                return message.delete();
            }
            if (!message.member.roles.some(r => r.id == accessRole.id)){
                message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                return message.delete();
            }
            if (!args[2]) return message.delete();
            if (!args[3]) return message.delete();
            let server = bot.guilds.get(args[2]);
            if (!server){
                message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                return message.delete();
            }
            let member = server.members.get(args[3]);
            if (!member){
                message.channel.send(`\`[ERROR]\` ${message.member} \`пользователь с id '${args[3]}' не найден!\``);
                return message.delete();
            }
            if (!args[4]){
                member.kick().then(() => {
                    message.channel.send(`\`[REMOTE KICK]\` \`Пользователь\` ${member} \`был кикнут на сервере ${server.name}. Причина: не указана. Источник:\` ${message.member}`)
                    return message.delete();
                }).catch(() => {
                    message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка! Не могу кикнуть!\``)
                    return message.delete();
                })
            }else{   
                member.ban(args.slice(4).join(" ")).then(() => {
                    message.channel.send(`\`[REMOTE KICK]\` \`Пользователь\` ${member} \`был кикнут на сервере ${server.name}. Причина: ${args.slice(4).join(" ")}. Источник:\` ${message.member}`)
                    return message.delete();
                }).catch(() => {
                    message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка! Не могу кикнуть!\``)
                    return message.delete();
                })
            }
        }

        if (message.content.startsWith('/cdb_remote_addrole')){
            if (message.channel.name != "key-remote-addrole") return
            const args = message.content.slice(`/cdb_remote_addrole`).split(/ +/);
            if (!args[1]) return message.delete().catch(() => {});
            if (args[1] != bot.user.id) return
            let accessRole = message.guild.roles.find(r => r.name == "Key [Remote Access (add role)]");
            if (!accessRole){
                message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                return message.delete();
            }
            if (!message.member.roles.some(r => r.id == accessRole.id)){
                message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                return message.delete();
            }
            if (!args[2]) return message.delete();
            if (!args[3]) return message.delete();
            if (!args[4]) return message.delete();
            let server = bot.guilds.get(args[2]);
            if (!server){
                message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                return message.delete();
            }
            let member = server.members.get(args[3]);
            if (!member){
                message.channel.send(`\`[ERROR]\` ${message.member} \`пользователь с id '${args[3]}' не найден!\``);
                return message.delete();
            }
            let role = server.roles.find(r => r.name == args.slice(4).join(" "));
            if (!role){
                role = await server.roles.find(r => r.name.includes(args.slice(4).join(" ")));
                if (!role){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`роль '${args.slice(4).join(" ")}' не была найдена на сервере.\``);
                    return message.delete();
                }
            }
            member.addRole(role).then(() => {
                message.channel.send(`\`[REMOTE ADDROLE]\` \`Пользователю\` ${member} \`была выдана роль ${role.name} на сервере ${server.name}. Источник:\` ${message.member}`);
                return message.delete();
            }).catch(() => {
                message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка выдачи роли! Возможно нет прав!\``);
                return message.delete();
            })
        }

        if (message.content.startsWith('/cdb_remote_removerole')){
            if (message.channel.name != "key-remote-removerole") return
            const args = message.content.slice(`/cdb_remote_removerole`).split(/ +/);
            if (!args[1]) return message.delete().catch(() => {});
            if (args[1] != bot.user.id) return
            let accessRole = message.guild.roles.find(r => r.name == "Key [Remote Access (remove role)]");
            if (!accessRole){
                message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                return message.delete();
            }
            if (!message.member.roles.some(r => r.id == accessRole.id)){
                message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                return message.delete();
            }
            if (!args[2]) return message.delete();
            if (!args[3]) return message.delete();
            if (!args[4]) return message.delete();
            let server = bot.guilds.get(args[2]);
            if (!server){
                message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                return message.delete();
            }
            let member = server.members.get(args[3]);
            if (!member){
                message.channel.send(`\`[ERROR]\` ${message.member} \`пользователь с id '${args[3]}' не найден!\``);
                return message.delete();
            }
            let role = server.roles.find(r => r.name == args.slice(4).join(" "));
            if (!role){
                role = await server.roles.find(r => r.name.includes(args.slice(4).join(" ")));
                if (!role){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`роль '${args.slice(4).join(" ")}' не была найдена на сервере.\``);
                    return message.delete();
                }
            }
            member.removeRole(role).then(() => {
                message.channel.send(`\`[REMOTE REMOVEROLE]\` \`Пользователю\` ${member} \`была снята роль ${role.name} на сервере ${server.name}. Источник:\` ${message.member}`);
                return message.delete();
            }).catch(() => {
                message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка снятия роли! Возможно нет прав!\``);
                return message.delete();
            })
        }

        if (message.content.startsWith('/cdb_remote_changenick')){
            if (message.channel.name != "key-remote-changenick") return
            const args = message.content.slice(`/cdb_remote_changenick`).split(/ +/);
            if (!args[1]) return message.delete().catch(() => {});
            if (args[1] != bot.user.id) return
            let accessRole = message.guild.roles.find(r => r.name == "Key [Remote Access (change nickname)]");
            if (!accessRole){
                message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                return message.delete();
            }
            if (!message.member.roles.some(r => r.id == accessRole.id)){
                message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                return message.delete();
            }
            if (!args[2]) return message.delete();
            if (!args[3]) return message.delete();
            if (!args[4]) return message.delete();
            let server = bot.guilds.get(args[2]);
            if (!server){
                message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                return message.delete();
            }
            let member = server.members.get(args[3]);
            if (!member){
                message.channel.send(`\`[ERROR]\` ${message.member} \`пользователь с id '${args[3]}' не найден!\``);
                return message.delete();
            }
            member.setNickname(args.slice(4).join(" ")).then(() => {
                message.channel.send(`\`[REMOTE CHANGENICK]\` \`Пользователю\` ${member} \`был установлен никнейм ${args.slice(4).join(" ")} на сервере ${server.name}. Источник:\` ${message.member}`);
                return message.delete();
            }).catch(() => {
                message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка изменения никнейма! Возможно нет прав!\``);
                return message.delete();
            })
        }

        if (message.content.startsWith('/cdb_db_del')){
            if (message.channel.name != "key-database-del") return
            const args = message.content.slice(`/cdb_db_del`).split(/ +/);
            if (!args[1]) return message.delete().catch(() => {});
            if (args[1] != bot.user.id) return
            let accessRole = message.guild.roles.find(r => r.name == "Key [Update DataBase (del)]");
            if (!accessRole){
                message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                return message.delete();
            }
            if (!message.member.roles.some(r => r.id == accessRole.id)){
                message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                return message.delete();
            }
            if (!args[2]) return message.delete();
            if (!args[3]) return message.delete();
            if (args[2] != "493459379878625320" && args[2] != "521639035442036736"){
                message.channel.send(`\`[ERROR]\` ${message.member} \`сервер '${args[2]}' не назначен как БД.\``);
                return message.delete();
            }
            let server = bot.guilds.get(args[2]);
            if (!server){
                message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                return message.delete();
            }
            let channel = server.channels.get(args[3]);
            if (!channel){
                message.channel.send(`\`[ERROR]\` ${message.member} \`канал '${args[3]}' не найден!\``);
                return message.delete();
            }
            channel.delete().then(() => {
                message.channel.send(`\`[DATABASE DEL]\` \`Канал ${channel.name} был удален на сервере ${server.name}. Источник:\` ${message.member}`);
                return message.delete();
            }).catch(() => {
                message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка удаления канала! Возможно нет прав!\``);
                return message.delete();
            })
        }

        if (message.content.startsWith('/cdb_db_upd')){
            if (message.channel.name != "key-database-update") return
            const args = message.content.slice(`/cdb_db_upd`).split(/ +/);
            if (!args[1]) return message.delete().catch(() => {});
            if (args[1] != bot.user.id) return
            let accessRole = message.guild.roles.find(r => r.name == "Key [Update DataBase (update)]");
            if (!accessRole){
                message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                return message.delete();
            }
            if (!message.member.roles.some(r => r.id == accessRole.id)){
                message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                return message.delete();
            }
            if (!args[2]) return message.delete();
            if (!args[3]) return message.delete();
            if (!args[4]) return message.delete();
            if (!args[5]) return message.delete();
            if (args[2] != "493459379878625320" && args[2] != "521639035442036736"){
                message.channel.send(`\`[ERROR]\` ${message.member} \`сервер '${args[2]}' не назначен как БД.\``);
                return message.delete();
            }
            let server = bot.guilds.get(args[2]);
            if (!server){
                message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                return message.delete();
            }
            let channel = server.channels.get(args[3]);
            if (!channel){
                message.channel.send(`\`[ERROR]\` ${message.member} \`канал '${args[3]}' не найден!\``);
                return message.delete();
            }
            if (+args[4] == -1){
                channel.send(`${args.slice(5).join(" ")}`).then(() => {
                    message.channel.send(`\`[DATABASE UPDATE]\` \`Значение в ${channel.name} на сервере ${server.name} было обновлено. Источник:\` ${message.member}`);
                    return message.delete();
                }).catch(() => {
                    message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка изменения! Возможно нет прав!\``);
                    return message.delete();
                })
            }else{
                channel.fetchMessage(args[4]).then(msg => {
                    msg.edit(`${args.slice(5).join(" ")}`).then(() => {
                        message.channel.send(`\`[DATABASE UPDATE]\` \`Значение в ${channel.name} на сервере ${server.name} было обновлено. Источник:\` ${message.member}`);
                        return message.delete();
                    }).catch(() => {
                        message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка изменения! Возможно нет прав!\``);
                        return message.delete();
                    })
                })
            }
        }

        if (message.content.startsWith('/cdb_db_add')){
            if (message.channel.name != "key-database-add") return
            const args = message.content.slice(`/cdb_db_add`).split(/ +/);
            if (!args[1]) return message.delete().catch(() => {});
            if (args[1] != bot.user.id) return
            let accessRole = message.guild.roles.find(r => r.name == "Key [Update DataBase (add)]");
            if (!accessRole){
                message.channel.send(`\`[ERROR]\` \`Уровень доступа\` ${accessRole} \`не обнаружен!\``);
                return message.delete();
            }
            if (!message.member.roles.some(r => r.id == accessRole.id)){
                message.channel.send(`\`[ERROR]\` ${message.member} \`у вас недостаточно прав доступа! Нужно ${accessRole.name}\``);
                return message.delete();
            }
            if (!args[2]) return message.delete();
            if (!args[3]) return message.delete();
            if (!args[4]) return message.delete();
            if (args[2] != "493459379878625320" && args[2] != "521639035442036736"){
                message.channel.send(`\`[ERROR]\` ${message.member} \`сервер '${args[2]}' не назначен как БД.\``);
                return message.delete();
            }
            let server = bot.guilds.get(args[2]);
            if (!server){
                message.channel.send(`\`[ERROR]\` ${message.member} \`я не нахожусь на сервере '${args[2]}'\``);
                return message.delete();
            }

            if (+args[3] == -1){
                server.createChannel(args.slice(4).join(" ")).then(async (ct) => {
                    message.channel.send(`\`[DATABASE ADD]\` \`На сервере ${server.name} был создан канал ${ct.name}. Источник:\` ${message.member}`);
                    return message.delete();
                }).catch(() => {
                    message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка создания! Возможно нет прав!\``);
                    return message.delete();
                })
            }else{
                let category = server.channels.get(args[3]);
                if (!category || category.type != "category"){
                    message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка! Категория указана не верно!\``);
                    return message.delete();
                }
                category.createChannel(args.slice(4).join(" ")).then(async (ct) => {
                    await ct.setParent(category.id);
                    message.channel.send(`\`[DATABASE ADD]\` \`На сервере ${server.name} был создан канал ${ct.name}. Источник:\` ${message.member}`);
                    return message.delete();
                }).catch(() => {
                    message.channel.send(`\`[ERROR]\` ${message.member} \`ошибка создания! Возможно нет прав!\``);
                    return message.delete();
                })
            }
        }
    }
})
// Система тут оканчивается.

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
                if (channel.name != "config"){
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
                                let rem = 0;
                                while (+user_warns > circle){
                                    let myDate = new Date().valueOf();
                                    if (+str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1] > myDate){
                                        user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                                        user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                                        user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                                    }else{
                                        rem++;
                                        let genchannel = message.guild.channels.find(c => c.name == "🌐welcome");
                                        genchannel.send(`<@${channel.name}>, \`вам было снято одно предупреждение. [Прошло 7 дней]\``);
                                    }
                                    circle++;
                                }
                                user_warns = +user_warns - +rem;
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
        }, 600000);
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
        if (!message.member.hasPermission("MANAGE_ROLES") && !message.member.roles.some(r => ["Модератор Discord", "⚂ Администратор 3 ур. ⚂", "⚃ Администратор 4 ур. ⚃"].includes(r.name))) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic != 'Жалоба в обработке.') return message.delete();
        if (cmd_cooldown.has(message.guild.id)){
            message.reply(`\`[ERROR]\` \`Пожалуста попробуте через несколько секунд!\``).then(msg => msg.delete(12000));
            return message.delete()
        }
        cmd_cooldown.add(message.guild.id);
        setTimeout(() => {
            if (cmd_cooldown.has(message.guild.id)) cmd_cooldown.delete(message.guild.id);
        }, 15000);
        let memberid = 'не найден';
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == 'member') memberid = await perm.id;
        });
        if (memberid == 'не найден'){
            let s_category = message.guild.channels.find(c => c.name == "Жалобы на рассмотрении");
            if (!s_category){
                message.channel.send(`\`[SYSTEM]\` \`Произошла ошибка! Категория 'Жалобы на рассмотрении' не была найдена.\``);
                return message.delete();
            }
            await message.channel.setTopic('Жалоба на рассмотрении.');
            await message.channel.setParent(s_category.id);
            let sp_chat_get = message.guild.channels.find(c => c.name == "reports");

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
            `**Необработанных модераторами: ${+info_rep[1] - 1}**\n` +
            `**Вопросы на рассмотрении: ${+info_rep[2] + 1}**\n` +
            `**Закрытых: ${info_rep[3]}**`)
            message.channel.send(`\`[STATUS]\` \`Данной жалобе был установлен статус: 'На рассмотрении'. Источник: ${message.member.displayName}\``);
            sp_chat_get.send(`\`[HOLD]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
            return message.delete();
        }else{
            let s_category = message.guild.channels.find(c => c.name == "Жалобы на рассмотрении");
            if (!s_category){
                message.channel.send(`\`[SYSTEM]\` \`Произошла ошибка! Категория 'Жалобы на рассмотрении' не была найдена.\``);
                return message.delete();
            }
            await message.channel.setTopic('Жалоба на рассмотрении.');
            await message.channel.setParent(s_category.id);
            let sp_chat_get = message.guild.channels.find(c => c.name == "reports");

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
            `**Необработанных модераторами: ${+info_rep[1] - 1}**\n` +
            `**Вопросы на рассмотрении: ${+info_rep[2] + 1}**\n` +
            `**Закрытых: ${info_rep[3]}**`)
            message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'На рассмотрении'. Источник: ${message.member.displayName}\``);
            sp_chat_get.send(`\`[HOLD]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
            return message.delete();
        }
    }

    if (message.content == '/active'){
        if (!message.member.hasPermission("MANAGE_ROLES") && !message.member.roles.some(r => ["Модератор Discord", "⚂ Администратор 3 ур. ⚂", "⚃ Администратор 4 ур. ⚃"].includes(r.name))) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.' || message.channel.topic != 'Жалоба на рассмотрении.') return message.delete();
        if (cmd_cooldown.has(message.guild.id)){
            message.reply(`\`[ERROR]\` \`Пожалуста попробуте через несколько секунд!\``).then(msg => msg.delete(12000));
            return message.delete()
        }
        cmd_cooldown.add(message.guild.id);
        setTimeout(() => {
            if (cmd_cooldown.has(message.guild.id)) cmd_cooldown.delete(message.guild.id);
        }, 15000);
        let memberid = 'не найден';
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
                memberid = await perm.id;
            }
        });
        if (memberid == 'не найден'){
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
            await message.channel.setTopic('Жалоба в обработке.');
            message.channel.send(`\`[STATUS]\` \`Данной жалобе был установлен статус: 'В обработке'. Источник: ${message.member.displayName}\``);
            sp_chat_get.send(`\`[ACTIVE]\` \`Модератор ${message.member.displayName} убрал жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
            return message.delete();
        }else{
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
            await message.channel.setTopic('Жалоба в обработке.');
            message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'В обработке'. Источник: ${message.member.displayName}\``);
            sp_chat_get.send(`\`[ACTIVE]\` \`Модератор ${message.member.displayName} убрал жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
            return message.delete();
        }
    }
    
    if (message.content == '/toadmin'){
        if (!message.member.hasPermission("MANAGE_ROLES") && !message.member.roles.some(r => ["Модератор Discord", "⚂ Администратор 3 ур. ⚂", "⚃ Администратор 4 ур. ⚃"].includes(r.name))) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.') return message.delete();
        if (cmd_cooldown.has(message.guild.id)){
            message.reply(`\`[ERROR]\` \`Пожалуста попробуте через несколько секунд!\``).then(msg => msg.delete(12000));
            return message.delete()
        }
        cmd_cooldown.add(message.guild.id);
        setTimeout(() => {
            if (cmd_cooldown.has(message.guild.id)) cmd_cooldown.delete(message.guild.id);
        }, 15000);
        let memberid = 'не найден';
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
                memberid = await perm.id;
            }
        });
        if (memberid == 'не найден'){
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
            message.channel.send(`\`[STATUS]\` \`Данное обращение было передано администрации. Источник: ${message.member.displayName}\``);
            sp_chat_get.send(`\`[ADMIN]\` \`Модератор ${message.member.displayName} передал жалобу\` <#${message.channel.id}> \`администрации.\``);
            return message.delete();
        }else{
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
            return message.delete();
        }
    }

    if (message.content == '/close'){
        if (!message.member.hasPermission("MANAGE_ROLES") && !message.member.roles.some(r => ["Модератор Discord", "⚂ Администратор 3 ур. ⚂", "⚃ Администратор 4 ур. ⚃"].includes(r.name))) return message.delete();
        if (!message.channel.name.startsWith('ticket-')) return message.delete();
        if (message.channel.topic == 'Жалоба закрыта.') return message.delete();
        if (cmd_cooldown.has(message.guild.id)){
            message.reply(`\`[ERROR]\` \`Пожалуста попробуте через несколько секунд!\``).then(msg => msg.delete(12000));
            return message.delete()
        }
        cmd_cooldown.add(message.guild.id);
        setTimeout(() => {
            if (cmd_cooldown.has(message.guild.id)) cmd_cooldown.delete(message.guild.id);
        }, 15000);
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
        let memberid = 'не найден';
        await message.channel.permissionOverwrites.forEach(async perm => {
            if (perm.type == `member`){
            memberid = await perm.id;
            }
        });
        if (memberid == 'не найден'){
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
            await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == 'Модератор Discord'), {
                SEND_MESSAGES: false,
            }) 
            await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == '⚂ Администратор 3 ур. ⚂'), {
                SEND_MESSAGES: false,
            }) 
            await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == '⚃ Администратор 4 ур. ⚃'), {
                SEND_MESSAGES: false,
            }) 
            await message.channel.setTopic('Жалоба закрыта.');
            let sp_chat_get = message.guild.channels.find(c => c.name == "reports");
            message.channel.send(`\`[STATUS]\` \`Данной жалобе был установлен статус: 'Закрыта'. Источник: ${message.member.displayName}\``);
            sp_chat_get.send(`\`[CLOSE]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'Закрыта'.\``);
            return message.delete();
        }else{
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
            
            await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == 'Модератор Discord'), {
                SEND_MESSAGES: false,
            }) 
            await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == '⚂ Администратор 3 ур. ⚂'), {
                SEND_MESSAGES: false,
            }) 
            await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == '⚃ Администратор 4 ур. ⚃'), {
                SEND_MESSAGES: false,
            }) 
            await message.channel.setTopic('Жалоба закрыта.');
            let sp_chat_get = message.guild.channels.find(c => c.name == "reports");
            message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'Закрыта'. Источник: ${message.member.displayName}\``);
            sp_chat_get.send(`\`[CLOSE]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'Закрыта'.\``);
            return message.delete();
        }
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
    
    if (message.content.startsWith("/setup")){
        let level_mod = 0;
        let db_server = bot.guilds.find(g => g.id == "521639035442036736");
        let db_parent = db_server.channels.find(c => c.name == 'db_users');
        let acc_creator = db_server.channels.find(c => c.name == message.author.id);
        if (acc_creator){
            await acc_creator.fetchMessages({limit: 1}).then(async messages => {
                if (messages.size == 1){
                    messages.forEach(async sacc => {
			let str = sacc.content;
                        level_mod = +str.split('\n')[0].match(re)[0];
                    });
                }
            });
        }
        if (!message.member.hasPermission("ADMINISTRATOR") && +level_mod < 2) return
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
            message.reply(`\`пользователь не указан! '/setup [user] [уровень]'\``)
            return message.delete();
        }
        const args = message.content.slice(`/setup`).split(/ +/);
        if (!args[2]){
            message.reply(`\`укажи число! '/setup [user] [уровень]'\``)
            return message.delete();
        }
        if (typeof +args[2] != "number") {
            message.reply(`\`укажи число! '/setup [user] [уровень]'\``)
            return message.delete();
        }
        /*
        [0] - снять права доступа
        [1] - может использовать /embhelp и все что с ним связано.
        [2] - может выдавать права доступа на /embhelp
        ADMINISTRATOR само собой
        */
        if (args[2] > 2 || args[2] < 0){
            message.reply(`\`укажи верный уровень доступа! '/setup [user] [уровень (0-2)]'\``)
            return message.delete();
        }
	if (!message.member.hasPermission("ADMINISTRATOR") && +level_mod <= +args[2]){
            message.reply(`\`ты не можешь выдавать уровень равный твоему или выше '/setup [user] [уровень (0-2)]'\``)
            return message.delete();
	}
        let acc = db_server.channels.find(c => c.name == user.id);
        if (!acc){
            await db_server.createChannel(user.id).then(async chan => {
		await chan.setTopic(`<@${user.id}> - ${user.displayName}`);
                acc = chan;
            });
        }

        await acc.fetchMessages({limit: 1}).then(async messages => {
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
                        user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                        user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                        user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                        circle++;
                    }
                    
                    moderation_level = +args[2];

                    if (+moderation_level == 0 && +moderation_warns == 0 && +user_warns == 0){
                        acc.delete();
                    }else{
                        let text_end = `Уровень модератора: ${+moderation_level}\n` + 
                        `Предупреждения модератора: ${+moderation_warns}`;
                        for (var i = 0; i < moderation_reason.length; i++){
                        text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
                        }
                        text_end = text_end + `\nПредупреждений: ${+user_warns}`;
                        for (var i = 0; i < user_reason.length; i++){
                        text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
                        }
                        sacc.edit(text_end);
                    }
                    let ann = message.guild.channels.find(c => c.name == "spectator-chat");
                    ann.send(`\`Модератор\` <@${message.author.id}> \`установил пользователю\` <@${user.id}> \`уровень модерирования: ${args[2]}\``);
                    return message.delete();
                });
            }else{
                if (+args[2] != 0){
                    await acc.send(`Уровень модератора: ${args[2]}\n` +
                    `Предупреждения модератора: 0\n` +
                    `Предупреждений: 0`);
                    let ann = message.guild.channels.find(c => c.name == "spectator-chat");
                    ann.send(`\`Модератор\` <@${message.author.id}> \`установил пользователю\` <@${user.id}> \`уровень модерирования: ${args[2]}\``);
                    return message.delete();
                }
            }
        });
    }
	
    if (message.content == '/embhelp'){
        let level_mod = 0;
        let db_server = bot.guilds.find(g => g.id == "521639035442036736");
        let db_parent = db_server.channels.find(c => c.name == 'db_users');
        let acc_creator = db_server.channels.find(c => c.name == message.author.id);
        if (acc_creator){
            await acc_creator.fetchMessages({limit: 1}).then(async messages => {
                if (messages.size == 1){
                    messages.forEach(async sacc => {
			let str = sacc.content;
                        level_mod = +str.split('\n')[0].match(re)[0];
                    });
                }
            });
        }
        if (!message.member.hasPermission("ADMINISTRATOR") && +level_mod < 1) return
        message.reply(`\`Команды для модерации: /embsetup, /embfield, /embsend - отправить.\``);
        return message.delete();
    }

    if (message.content.startsWith("/embsetup")){
        let level_mod = 0;
        let db_server = bot.guilds.find(g => g.id == "521639035442036736");
        let db_parent = db_server.channels.find(c => c.name == 'db_users');
        let acc_creator = db_server.channels.find(c => c.name == message.author.id);
        if (acc_creator){
            await acc_creator.fetchMessages({limit: 1}).then(async messages => {
                if (messages.size == 1){
                    messages.forEach(async sacc => {
			let str = sacc.content;
                        level_mod = +str.split('\n')[0].match(re)[0];
                    });
                }
            });
        }
        if (!message.member.hasPermission("ADMINISTRATOR") && +level_mod < 1) return
        const args = message.content.slice(`/embsetup`).split(/ +/);
        if (!args[1]){
            message.reply(`\`укажите, что вы установите! Ниже предоставлен список настроек.\`\n\`[1] - Название\`\n\`[2] - Описание\`\n\`[3] - Цвет [#FFFFFF]\`\n\`[4] - Время\`\n\`[5] - Картинка\`\n\`[6] - Подпись\`\n\`[7] - Картинка к подписи\``);
            return message.delete();
        }
        if (typeof(+args[1]) != "number"){
            message.reply(`\`вы должны указать число! '/embsetup [число] [значение]'\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`значение отстутствует!\``);
            return message.delete();
        }
        let cmd_value = args.slice(2).join(" ");
        if (+args[1] == 1){
            message.reply(`\`вы изменили заголовок с '${setembed_general[0]}' на '${cmd_value}'!\``)
            setembed_general[0] = cmd_value;
            return message.delete();
        }else if (+args[1] == 2){
            message.reply(`\`вы изменили описание с '${setembed_general[1]}' на '${cmd_value}'!\``)
            setembed_general[1] = cmd_value;
            return message.delete();
        }else if (+args[1] == 3){
            if (!cmd_value.startsWith("#")){
                message.reply(`\`цвет должен начинаться с хештега. Пример: #FFFFFF - белый цвет!\``);
                return message.delete();
            }
            message.reply(`\`вы изменили цвет с '${setembed_general[2]}' на '${cmd_value}'!\``)
            setembed_general[2] = cmd_value;
            return message.delete();
        }else if (+args[1] == 4){
            if (cmd_value != "включено" && cmd_value != "не указано"){
                message.reply(`\`время имеет параметры 'включено' или 'не указано'!\``);
                return message.delete();
            }
            message.reply(`\`вы изменили статус времени с '${setembed_general[3]}' на '${cmd_value}'!\``)
            setembed_general[3] = cmd_value;
            return message.delete();
        }else if (+args[1] == 5){
            message.reply(`\`вы изменили URL картинки с '${setembed_general[4]}' на '${cmd_value}'!\``)
            setembed_general[4] = cmd_value;
            return message.delete();
        }else if (+args[1] == 6){
            message.reply(`\`вы изменили подпись с '${setembed_general[5]}' на '${cmd_value}'!\``)
            setembed_general[5] = cmd_value;
            return message.delete();
        }else if (+args[1] == 7){
            message.reply(`\`вы изменили URL аватарки подписи с '${setembed_general[6]}' на '${cmd_value}'!\``)
            setembed_general[6] = cmd_value;
            return message.delete();
        }
    }

    if (message.content.startsWith("/embfield")){
        let level_mod = 0;
        let db_server = bot.guilds.find(g => g.id == "521639035442036736");
        let db_parent = db_server.channels.find(c => c.name == 'db_users');
        let acc_creator = db_server.channels.find(c => c.name == message.author.id);
        if (acc_creator){
            await acc_creator.fetchMessages({limit: 1}).then(async messages => {
                if (messages.size == 1){
                    messages.forEach(async sacc => {
			let str = sacc.content;
                        level_mod = +str.split('\n')[0].match(re)[0];
                    });
                }
            });
        }
        if (!message.member.hasPermission("ADMINISTRATOR") && +level_mod < 1) return
        const args = message.content.slice(`/embfield`).split(/ +/);
        if (!args[1]){
            message.reply(`\`укажите номер поля, которое вы хотите отредактировать!\``);
            return message.delete();
        }
        if (typeof(+args[1]) != "number"){
            message.reply(`\`вы должны указать число! '/embfield [число] [значение]'\``);
            return message.delete();
        }
        if (+args[1] < 1 || +args[1] > 10){
            message.reply(`\`минимальное число: 1, а максимальное - 10! '/embfield [число (1-10)] [значение]'\``);
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`значение отстутствует!\``);
            return message.delete();
        }
        let cmd_value = args.slice(2).join(" ");
        let i = +args[1];
        while (i > 1){
            if (setembed_fields[i - 2] == 'нет'){
                message.reply(`\`зачем ты используешь поле №${args[1]}, если есть свободное поле №${+i - 1}?\``);
                return message.delete();
            }
            i--
        }
        message.delete();
        await message.reply(`\`укажите текст который будет написан в '${cmd_value}' новым сообщением без написание каких либо команд!\nНа написание у тебя есть 10 минут! Для удаления можешь отправить в чат минус! '-'\``).then(question => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 600000,
                errors: ['time'],
            }).then(async (answer) => {
                if (answer.first().content != "-"){
                    question.delete().catch(err => console.error(err));
                    setembed_fields[+args[1] - 1] = `${cmd_value}<=+=>${answer.first().content}`;
                    answer.first().delete();
                    message.reply(`\`вы успешно отредактировали поле №${args[1]}!\nДелаем отступ после данного поля (да/нет)? На ответ 30 секунд.\``).then(async vopros => {
                        message.channel.awaitMessages(responsed => responsed.member.id == message.member.id, {
                            max: 1,
                            time: 30000,
                            errors: ['time'],
                        }).then(async (otvet) => {
                            if (otvet.first().content.toLowerCase().includes("нет")){
                                message.reply(`\`окей! Делать отступ не буду!\``);
                                setembed_addline[+args[1] - 1] = 'нет';
                            }else if (otvet.first().content.toLowerCase().includes("да")){
                                message.reply(`\`хорошо! Сделаю отступ!\``);
                                setembed_addline[+args[1] - 1] = 'отступ';
                            }
                        }).catch(() => {
                            message.reply(`\`ты не ответил! Отступа не будет!\``)
                            setembed_addline[+args[1] - 1] = 'нет';
                        })
                    })
                }else{
                    setembed_fields[+args[1] - 1] = 'нет';
                    setembed_addline[+args[1] - 1] = 'нет';
                    question.delete().catch(err => console.error(err));
                }
            }).catch(async () => {
                question.delete().catch(err => console.error(err));
            })
        })
    }

    if (message.content == "/embsend"){
        let level_mod = 0;
        let db_server = bot.guilds.find(g => g.id == "521639035442036736");
        let db_parent = db_server.channels.find(c => c.name == 'db_users');
        let acc_creator = db_server.channels.find(c => c.name == message.author.id);
        if (acc_creator){
            await acc_creator.fetchMessages({limit: 1}).then(async messages => {
                if (messages.size == 1){
                    messages.forEach(async sacc => {
			let str = sacc.content;
                        level_mod = +str.split('\n')[0].match(re)[0];
                    });
                }
            });
        }
        if (!message.member.hasPermission("ADMINISTRATOR") && +level_mod < 1) return
        const embed = new Discord.RichEmbed();
        if (setembed_general[0] != "не указано") embed.setTitle(setembed_general[0]);
        if (setembed_general[1] != "не указано") embed.setDescription(setembed_general[1]);
        if (setembed_general[2] != "не указано") embed.setColor(setembed_general[2]);
        let i = 0;
        while (setembed_fields[i] != 'нет'){
            embed.addField(setembed_fields[i].split(`<=+=>`)[0], setembed_fields[i].split(`<=+=>`)[1]);
            if (setembed_addline[i] != 'нет') embed.addBlankField(false);
            i++;
        }
        if (setembed_general[4] != "не указано") embed.setImage(setembed_general[4]);
        if (setembed_general[5] != "не указано" && setembed_general[6] == "не указано") embed.setFooter(setembed_general[5]);
        if (setembed_general[6] != "не указано" && setembed_general[5] != "не указано") embed.setFooter(setembed_general[5], setembed_general[6]);
        if (setembed_general[3] != "не указано") embed.setTimestamp();
        message.channel.send(embed).catch(err => message.channel.send(`\`Хм.. Не получается. Возможно вы сделали что-то не так.\``));
        return message.delete();
    }
    
    // WARN SYSTEM BY ME
        if (message.content.startsWith("/mwarn")){
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice(`/mwarn`).split(/ +/);
        if (!user || !args[2]){
          message.reply(`\`ошибка выполнения! '/mwarn [пользователь] [причина]'\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        let reason = args.slice(2).join(" ");
        if (reason.length < 3 || reason.length > 70){
          message.reply(`\`ошибка выполнения! Причина должна быть больше 3-х и меньше 70-и символов.\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        if (user.hasPermission("ADMINISTRATOR") || !user.roles.some(r => ["Модератор Discord"].includes(r.name))){
          message.reply(`\`ошибка выполнения! Выдать можно только модераторам!\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        if (reason.includes("==>")){
          message.reply(`\`ошибка выполнения! Вы использовали запрещенный символ!\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        let db_server = bot.guilds.find(g => g.id == "521639035442036736");
        let db_parent = db_server.channels.find(c => c.name == 'db_users');
        let acc = db_server.channels.find(c => c.name == user.id);
        if (!acc){
          await db_server.createChannel(user.id).then(async chan => {
            await chan.setTopic(`<@${user.id}> - ${user.displayName}`);
            acc = chan;
          });
        }
        await acc.fetchMessages({limit: 1}).then(async messages => {
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
                user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                circle++;
              }
              
              moderation_warns++
              moderation_reason.push(reason);
              moderation_time.push(604800000 * +moderation_warns + 604800000 + +message.createdAt.valueOf());
              moderation_give.push(message.member.displayName);
              
              if (+moderation_warns < 3){
                let text_end = `Уровень модератора: ${moderation_level}\n` + 
                `Предупреждения модератора: ${+moderation_warns}`;
                for (var i = 0; i < moderation_reason.length; i++){
                  text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
                }
                text_end = text_end + `\nПредупреждений: ${+user_warns}`;
                for (var i = 0; i < user_reason.length; i++){
                  text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
                }
      
                sacc.edit(text_end);
                let ann = message.guild.channels.find(c => c.name == "модераторы");
                ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение (${moderation_warns}/3). Причина: ${reason}\``);
                return message.delete();
              }else{
                let text_end = `Уровень модератора: ${moderation_level}\n` + 
                `Предупреждения модератора: ${+moderation_warns}`;
                for (var i = 0; i < moderation_reason.length; i++){
                  text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
                }
                text_end = text_end + `\nПредупреждений: ${+user_warns}`;
                for (var i = 0; i < user_reason.length; i++){
                  text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
                }
                if (user.roles.some(r => ["Модератор Discord"].includes(r.name))){
                  await fs.appendFileSync(`./spwarn.txt`, `${text_end}`); // { files: [ `./ban.txt` ] }
                  let ann = message.guild.channels.find(c => c.name == "модераторы");
                  await ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение (${moderation_warns}/3). Причина: ${reason}\`\n\`Вы были сняты с должности Модератора Discord.\``, { files: [ `./spwarn.txt` ] });
                  fs.unlinkSync(`./spwarn.txt`);
                  user.removeRole(message.guild.roles.find(r => r.name == "Модератор Discord"))
                  if (user_warns == 0 && moderation_level == 0){ 
                    acc.delete();
                  }else{
                    moderation_warns = 0;
                    let moderation_reason = [];
                    let moderation_time = [];
                    let moderation_give = [];
                    let text_end = `Уровень модератора: ${moderation_level}\n` + 
                    `Предупреждения модератора: ${+moderation_warns}`;
                    for (var i = 0; i < moderation_reason.length; i++){
                      text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
                    }
                    text_end = text_end + `\nПредупреждений: ${+user_warns}`;
                    for (var i = 0; i < user_reason.length; i++){
                      text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
                    }
                    sacc.edit(text_end);
                  }
                  return message.delete();
                }
              }
            });
          }else{
            await acc.send(`Уровень модератора: 0\n` +
            `Предупреждения модератора: 1\n` +
            `${reason}==>${+message.createdAt.valueOf() + 604800000}==>${message.member.displayName}\n` +
            `Предупреждений: 0`);
            let ann = message.guild.channels.find(c => c.name == "модераторы");
            ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение (1/3). Причина: ${reason}\``);
            return message.delete();
          }
        });
      }
          
      if (message.content.startsWith("/unwarn")){
        if (!message.member.hasPermission("MANAGE_ROLES") && !message.member.roles.some(r => ["Модератор Discord"].includes(r.name))) return message.delete();
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
          message.reply(`\`пользователь не указан! '/unwarn [пользователь] [тип] [число]'\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        const args = message.content.slice(`/unwarn`).split(/ +/);
        if (!args[2]){
          message.reply(`\`тип не указан! '/unwarn [пользователь] [тип] [число]'\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        if (args[2] != 'user' && args[2] != 'mod'){
          message.reply(`\`тип может быть 'user' или 'mod'! '/unwarn [пользователь] [тип] [число]'\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        if (!args[3]){
          message.reply(`\`номер предупреждения не указан! '/unwarn [пользователь] [тип] [число]'\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        if (typeof(+args[3]) != "number"){
          message.reply(`\`укажите число! '/unwarn [пользователь] [тип] [число]'\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        if (+args[3] > 2 || +args[3] < 1){
          message.reply(`\`можно указать 1 или 2! '/unwarn [пользователь] [тип] [число]'\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        if (args[2] == "user"){
          if (user.roles.some(r => ["Модератор Discord"].includes(r.name)) && !message.member.hasPermission("ADMINISTRATOR")){
            message.reply(`\`модератору нельзя снимать предупреждения!\``).then(msg => msg.delete(9000));
            return message.delete();
          }
          let dataserver = bot.guilds.find(g => g.id == "521639035442036736");
          let report_channel = dataserver.channels.find(c => c.name == user.id);
          if (!report_channel){
            message.reply(`\`у пользователя нет предупреждений!\``).then(msg => msg.delete(9000));
            return message.delete();
          }
          await report_channel.fetchMessages({limit: 1}).then(async messages => {
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
                let rem = 0;
                while (+user_warns > circle){
                  if (+circle == +args[3] - 1){
                    rem++;
                    let genchannel = message.guild.channels.find(c => c.name == "🌐welcome");
                    genchannel.send(`<@${user.id}>, \`вам было снято одно предупреждение. Источник: ${message.member.displayName}\``);
                    let schat = message.guild.channels.find(c => c.name == "модераторы");
                    schat.send(`\`Модератор\` <@${message.author.id}> \`снял пользователю\` <@${user.id}> \`одно предупреждение.\nИнформация: Выдано было модератором: ${str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]} по причине: ${str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]}\``);
                  }else{
                    user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                    user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                    user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                  }
                  circle++;
                }
                user_warns = +user_warns - +rem;
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
                  report_channel.delete();
                }else{
                  sacc.edit(text_end);
                }
                message.delete()
              });
            }else{
              message.reply(`\`произошла ошибка. [USER=${user.id}]\``).then(msg => msg.delete(9000));
              return message.delete();
            }
          });
        }else if (args[2] == "mod"){
          if (!message.member.hasPermission("ADMINISTRATOR")){
            message.reply(`\`недостаточно прав доступа к данному разделу!\``).then(msg => msg.delete(9000));
            return message.delete();
          }
          let dataserver = bot.guilds.find(g => g.id == "521639035442036736");
          let report_channel = dataserver.channels.find(c => c.name == user.id);
          if (!report_channel){
            message.reply(`\`у пользователя нет предупреждений!\``).then(msg => msg.delete(9000));
            return message.delete();
          }
          await report_channel.fetchMessages({limit: 1}).then(async messages => {
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
                let rem = 0;
                while (+moderation_warns > circle){
                  if (+circle == +args[3] - 1){
                    rem++;
                    let schat = message.guild.channels.find(c => c.name == "модераторы");
                    schat.send(`<@${message.author.id}> \`снял модератору\` <@${user.id}> \`одно предупреждение.\nИнформация: Выдано было модератором: ${str.split('\n')[+circle + 2].split('==>')[2]} по причине: ${str.split('\n')[+circle + 2].split('==>')[0]}\``);
                  }else{
                    moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
                    moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
                    moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
                  }
                  circle++;
                }
      
                circle = 0;
                while (+user_warns > circle){
                  user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                  user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                  user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                  circle++;
                }
                moderation_warns = +moderation_warns - +rem;
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
                  report_channel.delete();
                }else{
                  sacc.edit(text_end);
                }
                message.delete()
              });
            }else{
              message.reply(`\`произошла ошибка. [USER=${user.id}]\``).then(msg => msg.delete(9000));
              return message.delete();
            }
          });
        }
      }
          
      if (message.content.startsWith("/getmwarns")){
        if (!message.member.hasPermission("MANAGE_ROLES") && !message.member.roles.some(r => ["Модератор Discord"].includes(r.name))) return message.delete();
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
          message.reply(`\`для выполнения нужно указать пользователя. '/getmwarns [user]'\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        if (user.id == message.author.id){
          let db_server = bot.guilds.find(g => g.id == "521639035442036736");
          let acc = db_server.channels.find(c => c.name == user.id);
          if (!acc){
            message.reply(`\`у вас нет текущих предупреждений.\``).then(msg => msg.delete(12000));
            return message.delete();
          }
          await acc.fetchMessages({limit: 1}).then(async messages => {
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
                  user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                  user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                  user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                  circle++;
                }
                let text_end = `**Предупреждений: ${moderation_warns}**`;
                for (var i = 0; i < moderation_reason.length; i++){
                  text_end = text_end + `\n**[#${+i + 1}] Выдано модератором: \`${moderation_give[i]}\`. Причина: \`${moderation_reason[i]}\`**`;
                }
                message.reply(`\`вот информация по поводу аккаунта:\` <@${user.id}>\n${text_end}`);
                return message.delete();
              });
            }else{
              message.reply(`\`ошибка выполнения 605. [ACC=${user.id}]\``).then(msg => msg.pin());
              return message.delete();
            }
          });
        }else{
          if (!message.member.hasPermission("ADMINISTRATOR")){
            message.reply(`\`у вас нет прав модератора для просмотра чужой статистики.\``).then(msg => msg.delete(7000));
            return message.delete();
          }
          let db_server = bot.guilds.find(g => g.id == "521639035442036736");
          let acc = db_server.channels.find(c => c.name == user.id);
          if (!acc){
            message.reply(`\`у пользователя нет предупреждений.\``).then(msg => msg.delete(12000));
            return message.delete();
          }
          await acc.fetchMessages({limit: 1}).then(async messages => {
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
                  user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                  user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                  user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                  circle++;
                }
                let text_end = `**Предупреждений: ${moderation_warns}**`;
                for (var i = 0; i < moderation_reason.length; i++){
                  text_end = text_end + `\n**[#${+i + 1}] Выдано модератором: \`${moderation_give[i]}\`. Причина: \`${moderation_reason[i]}\`**`;
                }
                message.reply(`\`вот информация по поводу аккаунта:\` <@${user.id}>\n${text_end}`);
                return message.delete();
              });
            }else{
              message.reply(`\`ошибка выполнения 605. [ACC=${user.id}]\``).then(msg => msg.pin());
              return message.delete();
            }
          });
        }
      }
          
      if (message.content.startsWith("/getwarns")){
        let user = message.guild.member(message.mentions.users.first());
        if (!user){
          message.reply(`\`для выполнения нужно указать пользователя. '/getwarns [user]'\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        if (user.id == message.author.id){
          let db_server = bot.guilds.find(g => g.id == "521639035442036736");
          let acc = db_server.channels.find(c => c.name == user.id);
          if (!acc){
            message.reply(`\`у вас нет текущих предупреждений.\``).then(msg => msg.delete(12000));
            return message.delete();
          }
          await acc.fetchMessages({limit: 1}).then(async messages => {
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
                  user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                  user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                  user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                  circle++;
                }
                let text_end = `**Предупреждений: ${user_warns}**`;
                for (var i = 0; i < user_reason.length; i++){
                  let date = new Date(+user_time[i] + 10800000);
                  let formate_date = `${date.getFullYear()}.` + 
                  `${(date.getMonth() + 1).toString().padStart(2, '0')}.` +
                  `${date.getDate().toString().padStart(2, '0')} в ` + 
                  `${date.getHours().toString().padStart(2, '0')}:` + 
                  `${date.getMinutes().toString().padStart(2, '0')}:` + 
                  `${date.getSeconds().toString().padStart(2, '0')}`;
                  text_end = text_end + `\n**[#${+i + 1}] Выдано модератором: \`${user_give[i]}\`. Причина: \`${user_reason[i]}\`\n[#${+i + 1}] Истекает: ${formate_date}**\n`;
                }
                message.reply(`\`вот информация по поводу аккаунта:\` <@${user.id}>\n${text_end}`);
                return message.delete();
              });
            }else{
              message.reply(`\`ошибка выполнения 605. [ACC=${user.id}]\``).then(msg => msg.pin());
              return message.delete();
            }
          });
        }else{
          if (!message.member.hasPermission("MANAGE_ROLES") && !message.member.roles.some(r => ["Модератор Discord"].includes(r.name))){
            message.reply(`\`у вас нет прав модератора для просмотра чужой статистики.\``).then(msg => msg.delete(7000));
            return message.delete();
          }
          let db_server = bot.guilds.find(g => g.id == "521639035442036736");
          let acc = db_server.channels.find(c => c.name == user.id);
          if (!acc){
            message.reply(`\`у пользователя нет предупреждений.\``).then(msg => msg.delete(12000));
            return message.delete();
          }
          await acc.fetchMessages({limit: 1}).then(async messages => {
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
                  user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                  user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                  user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                  circle++;
                }
                let text_end = `**Предупреждений: ${user_warns}**`;
                for (var i = 0; i < user_reason.length; i++){
                  let date = new Date(+user_time[i] + 10800000);
                  let formate_date = `${date.getFullYear()}.` + 
                  `${(date.getMonth() + 1).toString().padStart(2, '0')}.` +
                  `${date.getDate().toString().padStart(2, '0')} в ` + 
                  `${date.getHours().toString().padStart(2, '0')}:` + 
                  `${date.getMinutes().toString().padStart(2, '0')}:` + 
                  `${date.getSeconds().toString().padStart(2, '0')}`;
                  text_end = text_end + `\n**[#${+i + 1}] Выдано модератором: \`${user_give[i]}\`. Причина: \`${user_reason[i]}\`\n[#${+i + 1}] Истекает: ${formate_date}**\n`;
                }
                message.reply(`\`вот информация по поводу аккаунта:\` <@${user.id}>\n${text_end}`);
                return message.delete();
              });
            }else{
              message.reply(`\`ошибка выполнения 605. [ACC=${user.id}]\``).then(msg => msg.pin());
              return message.delete();
            }
          });
        }
      }
      
      if (message.content.startsWith("/warn")){
        if (!message.member.hasPermission("MANAGE_ROLES") && !message.member.roles.some(r => ["Модератор Discord"].includes(r.name))) return
        if (warn_cooldown.has(message.author.id)) return message.delete();
        warn_cooldown.add(message.author.id)
        setTimeout(() => {
          if (warn_cooldown.has(message.author.id)) warn_cooldown.delete(message.author.id);
        }, 30000);
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice(`/warn`).split(/ +/);
        if (!user || !args[2]){
          message.reply(`\`ошибка выполнения! '/warn [пользователь] [причина]'\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        let reason = args.slice(2).join(" ");
        if (reason.length < 3 || reason.length > 70){
          message.reply(`\`ошибка выполнения! Причина должна быть больше 3-х и меньше 70-и символов.\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        if (user.hasPermission("ADMINISTRATOR") || user.roles.some(r => ["Модератор Discord", "⚀ Администратор 1 ур. ⚀", "⚁ Администратор 2 ур. ⚁", "⚂ Администратор 3 ур. ⚂", "⚃ Администратор 4 ур. ⚃"].includes(r.name))){
          if (!message.member.hasPermission("ADMINISTRATOR")){
            message.reply(`\`ошибка выполнения! Данному пользователю нельзя выдать предупреждение!\``).then(msg => msg.delete(9000));
            return message.delete();
          }
        }
        if (reason.includes("==>")){
          message.reply(`\`ошибка выполнения! Вы использовали запрещенный символ!\``).then(msg => msg.delete(9000));
          return message.delete();
        }
        let db_server = bot.guilds.find(g => g.id == "521639035442036736");
        let db_parent = db_server.channels.find(c => c.name == 'db_users');
        let acc = db_server.channels.find(c => c.name == user.id);
        if (!acc){
          await db_server.createChannel(user.id).then(async chan => {
            await chan.setTopic(`<@${user.id}> - ${user.displayName}`);
            acc = chan;
          });
        }
        await acc.fetchMessages({limit: 1}).then(async messages => {
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
                user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
                user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
                user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
                circle++;
              }
              
              user_warns++
              user_reason.push(reason);
              user_time.push(259200000 * +user_warns + 259200000 + +message.createdAt.valueOf());
              user_give.push(message.member.displayName);
              
              let text_end = `Уровень модератора: ${moderation_level}\n` + 
              `Предупреждения модератора: ${moderation_warns}`;
              for (var i = 0; i < moderation_reason.length; i++){
                text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
              }
              text_end = text_end + `\nПредупреждений: ${+user_warns}`;
              for (var i = 0; i < user_reason.length; i++){
                text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
              }
              if (+user_warns < 3){
                sacc.edit(text_end);
                let ann = message.guild.channels.find(c => c.name == "🌐welcome");
                ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение (${user_warns}/3). Причина: ${reason}\nЕсли вы не согласны с модератором, вы можете написать в нашу поддержку\` <#${message.guild.channels.find(c => c.name == "support").id}>`);
                return message.delete();
              }else{
                await fs.appendFileSync(`./ban.txt`, `${text_end}`);
                await message.guild.channels.find(c => c.name == "модераторы").send(`\`Привет! Я тут чела за нарушение правил забанил!\``, { files: [ `./ban.txt` ] });
                fs.unlinkSync(`./ban.txt`);
                acc.delete();
                let ann = message.guild.channels.find(c => c.name == "🌐welcome");
                await ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение (${user_warns}/3). Причина: ${reason}\nВам была выдана блокировка за нарушение правил (3/3)!\``);
                user.ban("Максимальное количество предупреждений");
                return message.delete();
              }
            });
          }else{
            await acc.send(`Уровень модератора: 0\n` +
            `Предупреждения модератора: 0\n` +
            `Предупреждений: 1\n` +
            `${reason}==>${+message.createdAt.valueOf() + 604800000}==>${message.member.displayName}`);
            let ann = message.guild.channels.find(c => c.name == "🌐welcome");
            ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение. Причина: ${reason}\nЕсли вы не согласны с модератором, вы можете написать в нашу поддержку\` <#${message.guild.channels.find(c => c.name == "support").id}>`);
            return message.delete();
          }
        });
      }
    // END SYSTEM WARN
    
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
                return message.delete();
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
