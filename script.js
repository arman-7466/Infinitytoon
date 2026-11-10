/* ==========================================
   INFINITYTOONS - COMPLETE LINKS & GLOBAL MULTI-API ENGINE
   AniList + Jikan + Kitsu + TMDB + All Links Intact
   ========================================== */

(() => {
    "use strict";

    const ANILIST_URL = "https://graphql.anilist.co";
    const JIKAN_URL = "https://api.jikan.moe/v4";
    const KITSU_URL = "https://kitsu.io/api/edge";
    const TMDB_API_KEY = "3fd2be6f0c70a2a598f084ddfb75487c"; 
    const PER_PAGE = 24;

    // 3. VIDEO LINKS DATABASE WITH SERVER 1 & SERVER 2 (Aapke saare links bilkul safe hain)
    const videoDatabase = {
        "attack on titan": { 
            name: "Attack On Titan", 
            episodes: { 
                1: { server1: "https://www.youtube.com/embed/MGRm4IzK1SQ", server2: "https://filemoon.org/embed/demo" }, 
                2: { server1: "https://www.youtube.com/embed/xyz", server2: "https://filemoon.org/embed/demo" }
            }
        },
        "tomb raider king": { 
            name: "Tomb Raider King", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/ab4igs6kn8mb", server2: "https://playmogo.com/e/ab4igs6kn8mb" }, 
                2: { server1: "https://playmogo.com/e/83a06vifx6w9", server2: "https://playmogo.com/e/83a06vifx6w9" }, 
                3: { server1: "https://playmogo.com/e/19djbuyduotk", server2: "https://playmogo.com/e/19djbuyduotk" },
                4: { server1: "https://playmogo.com/e/yfz4ct32fjw1", server2: "https://playmogo.com/e/yfz4ct32fjw1" }, 
                5: { server1: "https://playmogo.com/e/1ozmn41g1i1y", server2: "https://playmogo.com/e/1ozmn41g1i1y" },
                6: { server1: "https://playmogo.com/e/af2yhpa1deud", server2: "https://playmogo.com/e/af2yhpa1deud" }, 
                7: { server1: "https://playmogo.com/e/ik8yde5iz35v", server2: "https://playmogo.com/e/ik8yde5iz35v" },
                8: { server1: "https://playmogo.com/e/zftabe5zr9y5", server2: "https://playmogo.com/e/zftabe5zr9y5" }, 
                9: { server1: "https://playmogo.com/e/ssnn8a6elx9e", server2: "https://playmogo.com/e/ssnn8a6elx9e" },
                10: { server1: "https://playmogo.com/e/ievapywxjuiz", server2: "https://playmogo.com/e/ievapywxjuiz" }, 
                11: { server1: "https://playmogo.com/e/ni6hnlzp2h7g", server2: "https://playmogo.com/e/ni6hnlzp2h7g" },
                12: { server1: "https://playmogo.com/e/1z7ztq0wq5oc", server2: "https://playmogo.com/e/1z7ztq0wq5oc" }
            }
        },
        "black torch": { 
            name: "Black Torch", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/wenkxuw7r4jr", server2: "https://playmogo.com/e/wenkxuw7r4jr" }, 
                2: { server1: "https://www.youtube.com/embed/xyz", server2: "https://filemoon.org/embed/demo" }
            }
        },
        " the one piece": { 
            name: " The One Piece", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/1e97vy4fxhqv", server2: "https://playmogo.com/e/1e97vy4fxhqv" }, 
                2: { server1: "https://playmogo.com/e/8147f2qyqu5y", server2: "https://playmogo.com/e/8147f2qyqu5y" },
                3: { server1: "https://playmogo.com/e/as779mmfurut", server2: "https://playmogo.com/e/1e97vy4fxhqv" }, 
                4: { server1: "https://playmogo.com/e/54irw88qhkxx", server2: "https://playmogo.com/e/8147f2qyqu5y" },
                5: { server1: "https://playmogo.com/e/3v613taczdul", server2: "https://playmogo.com/e/1e97vy4fxhqv" }, 
                6: { server1: "https://playmogo.com/e/8147f2qyqu5y", server2: "https://playmogo.com/e/8147f2qyqu5y" },
            }
        },
        "lord of mysteries": { 
            name: "Lord Of Mysteries", 
            episodes: { 
                1: { server1: "https://player.abyssplayer.com/hcl0dZdwt", server2: "https://playmogo.com/e/d8knxtcvzsfy" }, 
                2: { server1: "https://player.abyssplayer.com/W9b-2Uw3h", server2: "https://playmogo.com/e/d82q5jnngv0h" },
                3: { server1: "https://player.abyssplayer.com/Yy4JfWI1H", server2: "https://playmogo.com/e/1e97vy4fxhqv" }, 
                4: { server1: "https://playmogo.com/e/54irw88qhkxx", server2: "https://playmogo.com/e/8147f2qyqu5y" },
                5: { server1: "https://playmogo.com/e/3v613taczdul", server2: "https://playmogo.com/e/1e97vy4fxhqv" }, 
                6: { server1: "https://playmogo.com/e/8147f2qyqu5y", server2: "https://playmogo.com/e/8147f2qyqu5y" },
            }
        },
        "5 centimeters per second": { 
            name: " 5 Centimeters per Second ", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/b9xdf8q7tqm5", server2: "https://player.abyssplayer.com/iHVG_-Ow-" },
            }
        },
        "jujutsu kaisen 0": { 
            name: "JUJUTSU KAISEN 0", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/0d9m5tcinlkd", server2: "https://playmogo.com/e/0d9m5tcinlkd" },
            }
        },
        "jujutsu kaisen season 3 the culling game part 1": { 
            name: "Jujutsu Kaisen Season 3: The Culling Game Part 1", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/nxjgas65xk8j", server2: "https://playmogo.com/e/nxjgas65xk8j" }, 
                2: { server1: "https://playmogo.com/e/fllc0nt4m9ri", server2: "https://playmogo.com/e/fllc0nt4m9ri" },
                3: { server1: "https://playmogo.com/e/xbix3m9inmvz", server2: "https://playmogo.com/e/xbix3m9inmvz" }, 
                4: { server1: "https://playmogo.com/e/ggt53obyh2ox", server2: "https://playmogo.com/e/ggt53obyh2ox" },
                5: { server1: "https://playmogo.com/e/1t7xw492sifu", server2: "https://playmogo.com/e/1t7xw492sifu" }, 
                6: { server1: "https://playmogo.com/e/7iyf2zgmyz83", server2: "https://playmogo.com/e/7iyf2zgmyz83" },
                7: { server1: "https://playmogo.com/e/nxjgas65xk8j", server2: "https://playmogo.com/e/nxjgas65xk8j" }, 
                8: { server1: " ", server2: " " },
                9: { server1: " ", server2: " " }, 
                10: { server1: " ", server2: " " },
                11: { server1: " ", server2: " " }, 
                12: { server1: " ", server2: " " }
            }
        },
        "jujutsu kaisen ": { 
            name: "Jujutsu Kaisen ", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/o2ja8aok3ln2", server2: " " }, 
                2: { server1: "https://playmogo.com/e/hksts3o794nw", server2: " " },
                3: { server1: "", server2: " " }, 
                4: { server1: "", server2: " " },
                5: { server1: " ", server2: " " }, 
                6: { server1: " ", server2: " " },
                7: { server1: " ", server2: " " }, 
                8: { server1: " ", server2: " " },
                9: { server1: " ", server2: " " }, 
                10: { server1: " ", server2: " " },
                11: { server1: " ", server2: " " }, 
                12: { server1: " ", server2: " " }
            }
        },
        "dr.stone ": { 
            name: "Dr.Stone ", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/rzrspb9b9qob", server2: "https://player.abyssplayer.com/IRLtUmnUf" }, 
                2: { server1: "https://playmogo.com/e/acd1mp915wpv", server2: "https://player.abyssplayer.com/vPzziMTVoE" },
                3: { server1: "https://playmogo.com/e/dylgjy43wdb4", server2: " " }, 
                4: { server1: "https://playmogo.com/e/l6zenx5okf14", server2: " " },
                5: { server1: "https://playmogo.com/e/r84f7zqw7ezf", server2: " " }, 
                6: { server1: "https://playmogo.com/e/4dyxbcy6ns85", server2: " " },
                7: { server1: " ", server2: " " }, 
                8: { server1: " ", server2: " " },
                9: { server1: " ", server2: " " }, 
                10: { server1: " ", server2: " " },
                11: { server1: " ", server2: " " }, 
                12: { server1: " ", server2: " " }
            }
        },
        "dragon ball super": { 
            name: "Dragon Ball Super ", 
            episodes: { 
                1: { server1: "https://player.abyssplayer.com/5djudzuPJm", server2: "https://player.abyssplayer.com/IRLtUmnUf" }, 
                2: { server1: "https://player.abyssplayer.com/DQ7VJS-LW", server2: "https://player.abyssplayer.com/vPzziMTVoE" },
                3: { server1: "https://player.abyssplayer.com/e8HSHtsYv", server2: " " }, 
                4: { server1: "https://player.abyssplayer.com/S3Ndg8SHS", server2: " " },
                5: { server1: "https://player.abyssplayer.com/Nj0-0oME2", server2: " " }, 
                6: { server1: "https://player.abyssplayer.com/Rucrbq8hH", server2: " " },
                7: { server1: "https://player.abyssplayer.com/Dlprq8qgg ", server2: " " }, 
                8: { server1: "https://player.abyssplayer.com/JlDnNmxcI ", server2: " " },
                9: { server1: "https://player.abyssplayer.com/m1TzY9L3z ", server2: " " }, 
                10: { server1: "https://player.abyssplayer.com/ag__k0Lah ", server2: " " },
                11: { server1: "https://player.abyssplayer.com/DZiTtUmVQ_a ", server2: " " }, 
                12: { server1: "https://player.abyssplayer.com/B3FCbgy-d ", server2: " " }
            }
        },
        " ameku m.d.: doctor detective ": { 
            name: " Ameku M.D.: Doctor Detective", 
            episodes: { 
                1: { server1: "https://player.abyssplayer.com/ZLNghlrGL", server2: "https://playmogo.com/e/0xgtz7xs8p9n" }, 
                2: { server1: "https://player.abyssplayer.com/h3EGNfXlc", server2: "https://playmogo.com/e/54fgmt9k1ykw" },
                3: { server1: "https://player.abyssplayer.com/Ddr7xijDj", server2: "https://playmogo.com/e/xg5r0rhkylgz" }, 
                4: { server1: "https://player.abyssplayer.com/Jc7uLOrP1", server2: "https://playmogo.com/e/5m4vg1mwplzd " },
                5: { server1: "https://player.abyssplayer.com/m4pzlNy0r", server2: "https://playmogo.com/e/y7m8ggt3yubv " }, 
                6: { server1: "https://player.abyssplayer.com/qlReVyatI", server2: "https://playmogo.com/e/txbnw0z5vo94 " },
                7: { server1: "https://player.abyssplayer.com/Tfx8hCGjF ", server2: "https://playmogo.com/e/ocnu611ksmtg " }, 
                8: { server1: "https://player.abyssplayer.com/zSgreW-bp ", server2: " https://playmogo.com/e/gepvdz69v1xe" },
                9: { server1: "https://player.abyssplayer.com/rpCodjDWZ ", server2: "https://playmogo.com/e/lzohkjo8olhu " }, 
                10: { server1: "https://player.abyssplayer.com/96DSJJ1VO", server2: " https://playmogo.com/e/91o4zjjaa7fz" },
                11: { server1: "https://player.abyssplayer.com/ObEov_J44 ", server2: "https://playmogo.com/e/tdcu92lh4wvb " }, 
                12: { server1: "https://player.abyssplayer.com/kF-aIF8dg ", server2: " https://playmogo.com/e/o73xubzi44uv" }
            }
        },
        "gantz": { 
            name: "Gantz", 
            episodes: { 
                1: { server1: "https://player.abyssplayer.com/FFwdRs9e4", server2: "https://playmogo.com/e/3lb4andlii4t " }, 
                2: { server1: "https://player.abyssplayer.com/k1ZnBe0gq", server2: "https://playmogo.com/e/o60ir330plvz " },
                3: { server1: "https://player.abyssplayer.com/05gdfEtHm", server2: "https://playmogo.com/e/fl6ibutce4bg" }, 
                4: { server1: "https://player.abyssplayer.com/lS7UVAuBuM", server2: " https://playmogo.com/e/nl85uq9df414" },
                5: { server1: "https://player.abyssplayer.com/5SE1a5plu", server2: "https://playmogo.com/e/r76aaoua7xw8 " }, 
                6: { server1: "https://player.abyssplayer.com/qlReVyatI", server2: " https://playmogo.com/e/rl0kt1rlnbhg" },
                7: { server1: "https://player.abyssplayer.com/Tfx8hCGjF ", server2: "https://playmogo.com/e/xdwpuea8frkv " }, 
                8: { server1: "https://player.abyssplayer.com/zSgreW-bp ", server2: "https://playmogo.com/e/f3c7x382lj64 " },
                9: { server1: "https://player.abyssplayer.com/rpCodjDWZ ", server2: "https://playmogo.com/e/cf8fyt35736n " }, 
                10: { server1: "https://player.abyssplayer.com/96DSJJ1VO", server2: "https://playmogo.com/e/5goe8kyawrbw " },
                11: { server1: "https://player.abyssplayer.com/ObEov_J44 ", server2: "https://playmogo.com/e/f8bbnx1z5rbr " }, 
                12: { server1: "https://player.abyssplayer.com/kF-aIF8dg ", server2: "https://playmogo.com/e/vnwhsldr6nzg " }
            }
        },
        "sakamoto days season 2": { 
            name: "Sakamoto Days Season 2", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/0jyi9678x5ug", server2: "https://player.abyssplayer.com/Eybm5vtGJ" }, 
                2: { server1: "https://playmogo.com/e/f2ivxa6upekm", server2: "https://player.abyssplayer.com/kDFZJrRag" },
                3: { server1: "https://playmogo.com/e/hsf36wq6m1oq", server2: "https://player.abyssplayer.com/mtNxnx_E8" }, 
                4: { server1: "https://playmogo.com/e/ia2j6b0r0jqh", server2: "https://player.abyssplayer.com/IpMX629ZP" },
                5: { server1: "https://playmogo.com/e/55zigmlytlnz", server2: "https://player.abyssplayer.com/VYwpxSQmd" }, 
                6: { server1: "https://playmogo.com/e/awuhpodywiid", server2: "https://player.abyssplayer.com/dziRI2Khx" },
                7: { server1: "https://playmogo.com/e/mr36oh2lj648", server2: "https://player.abyssplayer.com/lBgv8D8Zm" }, 
                8: { server1: "https://playmogo.com/e/je57gv92uni7", server2: "https://player.abyssplayer.com/72_PKeavG" },
                9: { server1: "https://playmogo.com/e/aup4tb51busp", server2: "https://player.abyssplayer.com/fdN0V7NEK" }, 
                10: { server1: "https://playmogo.com/e/7m7gj0pt1mii", server2: "https://player.abyssplayer.com/AP5FmyVXk" },
                11: { server1: "https://playmogo.com/e/fw9n4qxq35e8", server2: "https://player.abyssplayer.com/maw7DnuJKY" } 
            }
        },
        "the drops of god": { 
            name: "The Drops Of God", 
            episodes: { 
                1: { server1: "", server2: "https://player.abyssplayer.com/Eybm5vtGJ" }, 
                2: { server1: " ", server2: "https://player.abyssplayer.com/kDFZJrRag" },
                3: { server1: " ", server2: "https://player.abyssplayer.com/mtNxnx_E8" }, 
                4: { server1: " ", server2: "https://player.abyssplayer.com/IpMX629ZP" },
                5: { server1: " ", server2: "https://player.abyssplayer.com/VYwpxSQmd" }, 
                6: { server1: " ", server2: "https://player.abyssplayer.com/dziRI2Khx" },
                7: { server1: " ", server2: "https://player.abyssplayer.com/lBgv8D8Zm" }, 
                8: { server1: " ", server2: "https://player.abyssplayer.com/72_PKeavG" },
                9: { server1: " ", server2: "https://playmogo.com/e/nxjgas65xk8j" }, 
                10: { server1: " ", server2: "https://playmogo.com/e/3omu0luzw2cl" },
                11: { server1: " ", server2: "https://playmogo.com/e/nxjgas65xk8j" },
                12: { server1: " ", server2: "https://playmogo.com/e/ukvo7z62flks" }
            }
        },
        "trillion game": { 
            name: "Trillion Game", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/m08hw5af9963", server2: "https://player.abyssplayer.com/EVflorCZE" }, 
                2: { server1: "https://playmogo.com/e/000iibrr7nj5", server2: "https://player.abyssplayer.com/ePIOhePA_" },
                3: { server1: "https://playmogo.com/e/70ul0vxo85jk", server2: "https://player.abyssplayer.com/lSKJ8CfIW" }, 
                4: { server1: "https://playmogo.com/e/rxstsxsl8pfj", server2: "https://player.abyssplayer.com/lPOCTUp0C" },
                5: { server1: "https://playmogo.com/e/9b10yw6hlpjy", server2: "https://player.abyssplayer.com/VYwpxSQmd" }, 
                6: { server1: "https://playmogo.com/e/jq3rl9g0dunx", server2: "https://player.abyssplayer.com/7V43lrJ03" },
                7: { server1: "https://playmogo.com/e/kdvahaffj4dy", server2: "https://player.abyssplayer.com/_Oe6_Z8H7" }, 
                8: { server1: "https://playmogo.com/e/eu80gmrygjcd", server2: "https://player.abyssplayer.com/CgybvkRyY" },
                9: { server1: "https://playmogo.com/e/lzoa21m9ff8b", server2: "https://playmogo.com/e/nxjgas65xk8j" }, 
                10: { server1: "https://playmogo.com/e/8r8x4rqaydej", server2: "https://playmogo.com/e/3omu0luzw2cl" },
                11: { server1: "https://playmogo.com/e/0aqzh9y6b6w7", server2: "https://playmogo.com/e/nxjgas65xk8j" },
                12: { server1: "https://playmogo.com/e/waxn3x78zyxm", server2: "https://playmogo.com/e/ukvo7z62flks" },
                13: { server1: "https://playmogo.com/e/53hbif9tlyi7", server2: "https://player.abyssplayer.com/EVflorCZE" }, 
                14: { server1: "https://playmogo.com/d/10v1i7xkim13", server2: "https://player.abyssplayer.com/ePIOhePA_" },
                15: { server1: "https://playmogo.com/e/nbp2s0447qae", server2: "https://player.abyssplayer.com/lSKJ8CfIW" }, 
                16: { server1: "https://playmogo.com/e/rxstsxsl8pfj", server2: "https://player.abyssplayer.com/IpMX629ZP" },
                17: { server1: "https://playmogo.com/e/2yndqk81vgtp", server2: "https://player.abyssplayer.com/VYwpxSQmd" }, 
                18: { server1: "https://playmogo.com/e/7q5kgxka6l06", server2: "https://player.abyssplayer.com/dziRI2Khx" },
                19: { server1: "https://playmogo.com/e/zotz3v6v903o", server2: "https://player.abyssplayer.com/lBgv8D8Zm" }, 
                20: { server1: "https://playmogo.com/e/kqziwjaxra7i", server2: "https://player.abyssplayer.com/72_PKeavG" },
                21: { server1: "https://playmogo.com/e/7vynznczt1u7", server2: "https://playmogo.com/e/nxjgas65xk8j" }, 
                22: { server1: "https://playmogo.com/e/9ic3wsw80icl", server2: "https://playmogo.com/e/3omu0luzw2cl" },
                23: { server1: "https://playmogo.com/e/e66rp8ub8gyg", server2: "https://playmogo.com/e/nxjgas65xk8j" },
                24: { server1: "https://playmogo.com/e/ws649ttq3a35", server2: "https://playmogo.com/e/ukvo7z62flks" },
                25: { server1: "https://playmogo.com/e/vbmaid4x3ruo", server2: "https://playmogo.com/e/nxjgas65xk8j" },
                26: { server1: "https://playmogo.com/e/jsm2k6pz1sx8", server2: "https://playmogo.com/e/ukvo7z62flks" }
            }
        },
        "demon slayer": { 
            name: "Demon Slayer", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/ezuxvzl5p23f", server2: "https://playmogo.com/e/ezuxvzl5p23f" }, 
                2: { server1: "https://playmogo.com/e/i3sc06agzf9b", server2: "https://playmogo.com/e/i3sc06agzf9b" },
                3: { server1: "https://playmogo.com/e/mp2yy6cot1yh", server2: "https://playmogo.com/e/mp2yy6cot1yh" }, 
                4: { server1: "https://playmogo.com/e/4vgmr5t1yk4y", server2: "https://playmogo.com/e/4vgmr5t1yk4y" },
                5: { server1: "https://playmogo.com/e/okzfrcdfbdn4", server2: "https://playmogo.com/e/okzfrcdfbdn4" }, 
                6: { server1: "https://playmogo.com/e/979q364m0ee6", server2: "https://playmogo.com/e/979q364m0ee6" },
                7: { server1: "https://playmogo.com/e/4zm14t0m791k", server2: "https://playmogo.com/e/4zm14t0m791k" }, 
                8: { server1: "https://playmogo.com/e/waztjz1gfuig", server2: "https://playmogo.com/e/waztjz1gfuig" },
                9: { server1: "https://playmogo.com/e/nxjgas65xk8j", server2: "https://playmogo.com/e/nxjgas65xk8j" }, 
                10: { server1: "https://playmogo.com/e/3omu0luzw2cl", server2: "https://playmogo.com/e/3omu0luzw2cl" },
                11: { server1: "https://playmogo.com/e/nxjgas65xk8j", server2: "https://playmogo.com/e/nxjgas65xk8j" }, 
                12: { server1: "https://playmogo.com/e/ukvo7z62flks", server2: "https://playmogo.com/e/ukvo7z62flks" }
            }
        },
        "naruto": { 
            name: "Naruto", 
            episodes: { 
                1: { server1: "https://filemoon.org/en/APVmaXbjGXo8/embed", server2: "https://playmogo.com/e/w1my8nj0euez" }
            } 
        },
        "solo leveling": { 
            name: "Solo Leveling", 
            episodes: { 
                1: { server1: "https://filemoon.org/en/APVmaXWwGXo8/embed", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                2: { server1: "https://filemoon.org/en/0JgG7gYKGoYW/embed", server2: "https://playmogo.com/e/xzojw2qipdkt" },
                3: { server1: "https://filemoon.org/en/2bJG8xlDGOBE/embed", server2: "https://playmogo.com/e/yal5n8xjiduw" },
                4: { server1: "https://filemoon.org/en/2bJG8xlDGOBE/embed", server2: "https://playmogo.com/e/xx0xha6ocazf" },
                5: { server1: "https://filemoon.org/en/LK0G1OXj3917/embed", server2: "https://playmogo.com/e/ob1eeewgl3sf" },
                6: { server1: "https://filemoon.org/en/EL73gXo9z9Ba/embed", server2: "https://playmogo.com/e/9ziz8nl3jght" },
                7: { server1: "https://filemoon.org/en/Xkrzow4QzBOR/embed", server2: "https://playmogo.com/e/vxj3otdrv3fn" }, 
                8: { server1: "https://filemoon.org/en/gXeGOXldmAa7/embed", server2: "https://playmogo.com/e/pn7nh6v0mrav" }, 
                9: { server1: "https://filemoon.org/en/N2p3DKp9mMa5/embed", server2: "https://playmogo.com/e/ymxc69rf13j6" },
                10: { server1: "https://filemoon.org/en/QN9mEAPxm6dW/embed", server2: "https://playmogo.com/e/tizgsgz0prn1" },
                11: { server1: "https://filemoon.org/en/M2BGwplRmj40/embed", server2: "https://playmogo.com/e/crbuscmxx5rj" },
                12: { server1: "https://filemoon.org/en/M2BGwplRmj40/embed", server2: "https://playmogo.com/e/8t0m7rtkydnb" }
            } 
        },
        "death note": { 
            name: "Death Note", 
            episodes: { 
                1: { server1: "https://filemoon.org/en/b5OzdXY8zB8L/embed", server2: "https://playmogo.com/e/kc3g7giokpon" }, 
                2: { server1: "https://filemoon.org/en/Pbe3PXRe3lX6/embed", server2: "https://playmogo.com/e/ufw1wx9x4r1j" },
                3: { server1: "https://filemoon.org/en/jJD3VX40Ga5Q/embed", server2: "https://playmogo.com/e/7tc5qm1aragf" },
                4: { server1: "https://filemoon.org/en/9AqGQWMg3Mn6/embed", server2: "https://playmogo.com/e/8btv7to9z4ar" },
                5: { server1: "https://filemoon.org/en/0JgG7gNKGoYW/embed", server2: "https://playmogo.com/e/quyy8x8lfix2" },
                6: { server1: "https://filemoon.org/en/2bJG8xw5GOBE/embed", server2: "https://playmogo.com/e/vpvc3njz6zeg" },
                7: { server1: "https://filemoon.org/en/E1x3ARPRzyk6/embed", server2: "https://playmogo.com/e/5eqb2mqn35jv" }, 
                8: { server1: "https://filemoon.org/en/Y2xm06QpzRO1/embed", server2: "https://playmogo.com/e/who4hjqtq84a" }, 
                9: { server1: "https://filemoon.org/en/dZxG5r1emVjK/embed", server2: "https://playmogo.com/e/ig2eovttb3gf" },
                10: { server1: "https://filemoon.org/en/7d5GLYrlmxRJ/embed", server2: "https://playmogo.com/e/vhhwayvasro6" },
                11: { server1: "https://filemoon.org/en/LJlGnvVZG15w/embed", server2: "https://playmogo.com/e/1a8y9x0mm4ij" },
                12: { server1: "https://filemoon.org/en/5pVzNQaA37wv/embed", server2: "https://playmogo.com/e/ihi56q9f0101" },
                13: { server1: "https://filemoon.org/en/APVmaQgdmXo8/embed", server2: "https://playmogo.com/e/0tni9tblufc6" }, 
                14: { server1: "https://filemoon.org/en/0PdzyPkL3eAR/embed", server2: "https://playmogo.com/e/fhuy0tyuwtmi" },
                15: { server1: "https://filemoon.org/en/0JgG7xqemoYW/embed", server2: "https://playmogo.com/e/4budzzz5mgqc" },
                16: { server1: "https://filemoon.org/en/0JgG7xqemoYW/embed", server2: "https://playmogo.com/e/bcxrsr1oy0w6" },
                17: { server1: "https://filemoon.org/en/XkrzoErWmBOR/embed", server2: "https://playmogo.com/e/2zsspp5pnsse" }, 
                18: { server1: "https://filemoon.org/en/E1x3AMdD3yk6/embed", server2: "https://playmogo.com/e/06fyq1s0dlaw" },
                19: { server1: "https://filemoon.org/en/qw1zeQrxzXyn/embed", server2: "https://playmogo.com/e/giliqvk6o6kx" },
                20: { server1: "https://filemoon.org/en/qPez4wkM3OYn/embed", server2: "https://filemoon.org/en/9AqGQWMg3Mn6/embed" },
                21: { server1: "https://filemoon.org/en/E9Qz9JWWGOL2/embed", server2: "https://player.abyssplayer.com/TOqbLB23t" }, 
                22: { server1: "https://filemoon.org/en/dkD3YQqO3LQK/embed", server2: "https://filemoon.org/embed/demo" },
                23: { server1: "https://filemoon.org/en/LK0G1Dvez917/embed", server2: "https://filemoon.org/en/jJD3VX40Ga5Q/embed" },
                24: { server1: "https://filemoon.org/en/jar3XQrZz2dD/embed", server2: "https://filemoon.org/en/9AqGQWMg3Mn6/embed" },
                25: { server1: "https://filemoon.org/en/ex5z2v4ozKqk/embed", server2: "https://player.abyssplayer.com/TOqbLB23t" }, 
                26: { server1: "https://filemoon.org/en/qLQ36goPz19j/embed", server2: "https://filemoon.org/embed/demo" },
                27: { server1: "https://filemoon.org/en/jJD3VX40Ga5Q/embed", server2: "https://filemoon.org/en/jJD3VX40Ga5Q/embed" },
                28: { server1: "https://filemoon.org/en/ZvqzllR8zaD2/embed", server2: "https://filemoon.org/en/9AqGQWMg3Mn6/embed" },
                29: { server1: "https://filemoon.org/en/gXeGOQgK3Aa7/embed", server2: "https://filemoon.org/en/jJD3VX40Ga5Q/embed" },
                30: { server1: "https://filemoon.org/en/N2p3DAkpzMa5/embed", server2: "https://filemoon.org/en/9AqGQWMg3Mn6/embed" },
                31: { server1: "https://filemoon.org/en/qLQ36gp7z19j/embed", server2: "https://player.abyssplayer.com/TOqbLB23t" }, 
                32: { server1: "https://filemoon.org/en/gXeGOQRd3Aa7/embed", server2: "https://filemoon.org/embed/demo" },
                33: { server1: "https://filemoon.org/en/qLQ36go7z19j/embed", server2: "https://filemoon.org/en/jJD3VX40Ga5Q/embed" },
                34: { server1: "https://filemoon.org/en/LJlGnvo4G15w/embed", server2: "https://filemoon.org/en/9AqGQWMg3Mn6/embed" },
                35: { server1: "https://filemoon.org/en/5pVzNQxZ37wv/embed", server2: "https://player.abyssplayer.com/TOqbLB23t" }, 
                36: { server1: "https://filemoon.org/en/EL73gQ7aG9Ba/embed", server2: "https://filemoon.org/embed/demo" },
                37: { server1: "https://filemoon.org/en/2WVGrgdgmkx7/embed", server2: "https://filemoon.org/en/jJD3VX40Ga5Q/embed" }
            } 
        },
        "mob psycho 100 ii": { 
            name: "Mob Psycho 100 II", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/53uc7cdr8zgw", server2: "https://playmogo.com/e/53uc7cdr8zgw" }, 
                2: { server1: "https://playmogo.com/e/99hohfu53eg1", server2: "https://playmogo.com/e/99hohfu53eg1" },
                3: { server1: "https://playmogo.com/e/y8o912wg6aey", server2: "https://playmogo.com/e/y8o912wg6aey" },
                4: { server1: "https://playmogo.com/e/insf4ocwwq2e", server2: "https://playmogo.com/e/insf4ocwwq2e" },
                5: { server1: "https://playmogo.com/e/gl4s7l996wa1", server2: "https://playmogo.com/e/gl4s7l996wa1" },
                6: { server1: "https://playmogo.com/e/nm9ip7j227ul", server2: "https://playmogo.com/e/nm9ip7j227ul" },
                7: { server1: "https://playmogo.com/e/opdo85nr346r", server2: "https://playmogo.com/e/opdo85nr346r" }, 
                8: { server1: "https://playmogo.com/e/s55ie69ewspj", server2: "https://playmogo.com/e/s55ie69ewspj" }, 
                9: { server1: "https://playmogo.com/e/osxyzyei6kac", server2: "https://playmogo.com/e/osxyzyei6kac" },
                10: { server1: "https://playmogo.com/e/36cihkrkb6mj", server2: "https://playmogo.com/e/36cihkrkb6mj" },
                11: { server1: "https://playmogo.com/e/2d1oj9s0i0et", server2: "https://playmogo.com/e/2d1oj9s0i0et" },
                12: { server1: "https://playmogo.com/e/3mde5km9ba99", server2: "https://playmogo.com/e/3mde5km9ba99" }
            } 
        },
        "suzume": { 
            name: "Suzume", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/khyop3cgy6l4", server2: " " }
            } 
        },
        "a wishker away": { 
            name: "A Wishker Away", 
            episodes: { 
                1: { server1: "https://player.abyssplayer.com/dATeki9dF", server2: " " }
            } 
        },
        "chainsaw man the movie: reze arc": { 
            name: " Chainsaw Man The Movie: Reze Arc ", 
            episodes: { 
                1: { server1: "https://player.abyssplayer.com/TyoOC9q_J", server2: " " }
            } 
        },
        "my oni girl": { 
            name: "My Oni Girl", 
            episodes: { 
                1: { server1: "https://player.abyssplayer.com/O2tW2DgLB", server2: " " }
            } 
        },
        "i want to eat your pancreas": { 
            name: "I Want To Eat Your Pancreas", 
            episodes: { 
                1: { server1: "https://player.abyssplayer.com/kLjhdu6po", server2: "" }
            } 
        },
        "weathering with you": { 
            name: "Weathering With You", 
            episodes: { 
                1: { server1: "https://playmogo.com/e/a06938e62w47", server2: "https://playmogo.com/e/w1my8nj0euez" }
            } 
        },
        "baki": { 
            name: "Baki", 
            episodes: { 
                24: { server1: "https://playmogo.com/e/y1b3xapgxau1", server2: "https://playmogo.com/e/w1my8nj0euez" }
            } 
        },
        "demon slayer: kimetsu no yaiba infinity castle": { 
            name: "Demon Slayer: Kimetsu no Yaiba Infinity Castle", 
            episodes: { 
                24: { server1: "https://playmogo.com/e/7n2ay5pz6agu", server2: "https://playmogo.com/e/7n2ay5pz6agu" }
            } 
        }
    };

    let currentPage = 1;
    let currentSearch = "";
    let loading = false;
    let hasNextPage = true;
    let requestId = 0;
    let searchTimer;
    
    window.currentAnimeData = null;
    window.currentEpNumber = 1;

    const localTitles = () => {
        if (typeof allAnimeData === "undefined") return [];
        return allAnimeData.map(a => String(a.title || "").toLowerCase());
    };

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, ch => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
        })[ch]);
    }

    function getFormat() {
        const container = document.getElementById("mixed-container");
        const filter = (container?.dataset.filter || "").toUpperCase();
        const page = location.pathname.toLowerCase();

        if (filter === "MOVIE" || page.includes("movies")) return "MOVIE";
        if (filter === "SERIES" || page.includes("series")) return "TV";
        return null;
    }

    // 1. AniList Fetcher
    async function fetchAnilist(page, search, format, id) {
        try {
            const query = `
                query ($page: Int, $perPage: Int, $search: String, $format: MediaFormat) {
                    Page(page: $page, perPage: $perPage) {
                        pageInfo { currentPage hasNextPage }
                        media(search: $search, type: ANIME, format: $format, sort: POPULARITY_DESC) {
                            id siteUrl format
                            title { romaji english native }
                            coverImage { large extraLarge }
                        }
                    }
                }
            `;
            const response = await fetch(ANILIST_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ query, variables: { page, perPage: PER_PAGE, search: search || null, format: format || null } })
            });
            if (!response.ok) return null;
            const result = await response.json();
            if (id !== requestId) return null;
            return result.data?.Page;
        } catch (e) {
            return null;
        }
    }

    // 2. Jikan Fetcher
    async function fetchJikan(search, page) {
        try {
            let url = `${JIKAN_URL}/anime?page=${page}&limit=10`;
            if (search) url += `&q=${encodeURIComponent(search)}`;
            else url += `&order_by=popularity&sort=asc`;

            const res = await fetch(url);
            if (!res.ok) return [];
            const data = await res.json();
            
            return (data.data || []).map(item => ({
                id: item.mal_id,
                siteUrl: item.url,
                format: item.type === "Movie" ? "MOVIE" : "TV",
                title: {
                    romaji: item.title_japanese || item.title,
                    english: item.title_english || item.title,
                    native: item.title
                },
                coverImage: {
                    large: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
                    extraLarge: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url
                }
            }));
        } catch (e) {
            return [];
        }
    }

  // 3. Kitsu Fetcher
    async function fetchKitsu(search) {
        try {
            let url = `${KITSU_URL}/anime?page[limit]=10`;
            if (search) url += `&filter[text]=${encodeURIComponent(search)}`;

            const res = await fetch(url);
            if (!res.ok) return [];
            const data = await res.json();

            return (data.data || []).map(item => ({
                id: item.id,
                siteUrl: `https://kitsu.io/anime/${item.id}`,
                format: item.attributes?.subtype === "movie" ? "MOVIE" : "TV",
                title: {
                    romaji: item.attributes?.canonicalTitle,
                    english: item.attributes?.titles?.en || item.attributes?.canonicalTitle,
                    native: item.attributes?.titles?.ja_jp || ""
                },
                coverImage: {
                    large: item.attributes?.posterImage?.large || item.attributes?.posterImage?.original,
                    extraLarge: item.attributes?.posterImage?.original || item.attributes?.posterImage?.large
                }
            }));
        } catch (e) {
            return [];
        }
    }

    // 4. TMDB Fetcher (Netflix & Global Shows)
    async function fetchTMDB(search) {
        try {
            if (!search) return [];
            let url = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(search)}`;
            const res = await fetch(url);
            if (!res.ok) return [];
            const data = await res.json();

            return (data.results || []).map(item => ({
                id: item.id,
                siteUrl: `https://www.themoviedb.org/tv/${item.id}`,
                format: "TV",
                title: {
                    romaji: item.name,
                    english: item.name,
                    native: item.original_name || ""
                },
                coverImage: {
                    large: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
                    extraLarge: item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : ""
                }
            })).filter(item => item.coverImage.large);
        } catch (e) {
            return [];
        }
    }

    // 5. Ultimate Combined Aggregator (All 4 APIs)
    async function fetchAnimeCombined(page, search, format, id) {
        const anilistData = await fetchAnilist(page, search, format, id);
        let mediaList = anilistData?.media || [];
        let hasNext = anilistData?.pageInfo?.hasNextPage || false;

        const [jikanRes, kitsuRes, tmdbRes] = await Promise.all([
            fetchJikan(search, page),
            fetchKitsu(search),
            fetchTMDB(search)
        ]);

        const merged = [...mediaList, ...jikanRes, ...kitsuRes, ...tmdbRes];
        const uniqueMap = new Map();

        merged.forEach(item => {
            const titleKey = (item.title?.english || item.title?.romaji || item.title?.native || "").toLowerCase().trim();
            if (titleKey && !uniqueMap.has(titleKey)) {
                uniqueMap.set(titleKey, item);
            }
        });

        mediaList = Array.from(uniqueMap.values());

        return {
            media: mediaList,
            pageInfo: { currentPage: page, hasNextPage: hasNext }
        };
    }

    function createCard(anime) {
        const title = anime.title?.english || anime.title?.romaji || anime.title?.native || "Unknown Anime";
        const image = anime.coverImage?.extraLarge || anime.coverImage?.large || "";
        const local = typeof allAnimeData !== "undefined" ? allAnimeData.find(a => String(a.title || "").toLowerCase() === title.toLowerCase()) : null;
        const href = local ? local.link : anime.siteUrl;

        return `
            <a href="${escapeHTML(href)}" class="premium-card search-item anilist-card" data-title="${escapeHTML(title.toLowerCase())}" target="${local ? "_self" : "_blank"}" rel="noopener noreferrer">
                <div class="card-img-wrapper">
                    <img src="${escapeHTML(image)}" alt="${escapeHTML(title)}" class="card-img" loading="lazy" onerror="this.style.visibility='hidden'">
                    <div class="card-badges"><span class="badge sub">${anime.format === "MOVIE" ? "MOVIE" : "SERIES"}</span></div>
                    <div class="play-overlay"><i class="fas fa-play"></i></div>
                </div>
                <div class="card-info"><h3 class="card-title">${escapeHTML(title)}</h3></div>
            </a>
        `;
    }

    function showStatus(message) {
        const status = document.getElementById("anilist-status");
        if (status) status.textContent = message;
    }

    async function loadAnime(reset = false) {
        if (loading) return;
        const grid = document.getElementById("anilist-results-grid");
        const moreButton = document.getElementById("anilist-load-more");
        if (!grid) return;

        if (reset) {
            currentPage = 1;
            hasNextPage = true;
            grid.innerHTML = "";
        }

        if (!hasNextPage && !reset) return;
        loading = true;
        const id = ++requestId;
        if (moreButton) moreButton.disabled = true;
        showStatus("Duniya bhar ke shows search ho rahe hain...");

        try {
            const data = await fetchAnimeCombined(currentPage, currentSearch, getFormat(), id);
            if (!data || id !== requestId) return;

            const existing = new Set(Array.from(grid.querySelectorAll(".anilist-card")).map(card => card.dataset.title));
            const local = new Set(localTitles());
            const cards = data.media.filter(anime => {
                const title = (anime.title?.english || anime.title?.romaji || anime.title?.native || "").toLowerCase();
                return !existing.has(title) && !local.has(title) && anime.coverImage;
            });

            grid.insertAdjacentHTML("beforeend", cards.map(createCard).join(""));
            hasNextPage = data.pageInfo.hasNextPage;
            currentPage = data.pageInfo.currentPage + 1;
            showStatus(grid.querySelector(".anilist-card") ? "" : "Koi result nahi mila.");
            if (moreButton) moreButton.style.display = hasNextPage ? "block" : "none";
        } catch (error) {
            console.error("Search error:", error);
            showStatus("Search mein error aayi.");
        } finally {
            loading = false;
            if (moreButton) moreButton.disabled = false;
        }
    }

    function initAnimeSystem() {
        let grid = document.getElementById("anilist-results-grid");
        const container = document.getElementById("mixed-container");

        if (!grid) {
            const targetParent = container || document.querySelector("main") || document.body;
            const section = document.createElement("section");
            section.id = "anilist-section";
            section.innerHTML = `
                <h2>Global Search Results</h2>
                <p id="anilist-status" role="status" aria-live="polite"></p>
                <div id="anilist-results-grid" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(145px,1fr)); gap:16px;"></div>
                <button id="anilist-load-more" type="button" style="margin:24px auto;padding:12px 24px;display:block;">Load More</button>
            `;
            targetParent.insertAdjacentElement("beforeend", section);
            grid = document.getElementById("anilist-results-grid");
        }

        const loadMoreBtn = document.getElementById("anilist-load-more");
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener("click", () => loadAnime());
        }

        const input = document.getElementById("animeSearch");
        if (input) {
            input.addEventListener("input", () => {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => {
                    currentSearch = input.value.trim();
                    requestId++;
                    loading = false;
                    loadAnime(true);
                }, 400);
            });
        }

        loadAnime(true);
    }

    async function setWatchPageBackground(animeName) {
        try {
            const query = `
                query ($search: String) {
                    Media (search: $search, type: ANIME) {
                        bannerImage
                        coverImage { extraLarge large }
                    }
                }
            `;
            const response = await fetch(ANILIST_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ query, variables: { search: animeName } })
            });
            const result = await response.json();
            const media = result?.data?.Media;
            
            if (media) {
                const bgUrl = media.bannerImage || media.coverImage?.extraLarge || media.coverImage?.large;
                if (bgUrl) {
                    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('${bgUrl}')`;
                    document.body.style.backgroundSize = "cover";
                    document.body.style.backgroundPosition = "center";
                    document.body.style.backgroundAttachment = "fixed";
                    document.body.style.backgroundRepeat = "no-repeat";
                }
            }
        } catch (e) {
            console.error("Background image load karne mein error aayi:", e);
        }
    }

    function initEpisodePlayer() {
        const params = new URLSearchParams(window.location.search);
        let animeKey = (params.get("anime") || "naruto").toLowerCase().trim();
        const episode = Number(params.get("episode") || params.get("ep") || 1);
        const currentServer = params.get("server") || "server1"; 
        const player = document.getElementById("vidPlayer");

        if (!player) return;

        let cleanAnimeKey = animeKey.replace(/[^a-z0-9]/g, '');
        let matchedKey = Object.keys(videoDatabase).find(key => {
            let cleanDbKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            return cleanAnimeKey.includes(cleanDbKey) || cleanDbKey.includes(cleanAnimeKey);
        });
        
        if (!matchedKey || !videoDatabase[matchedKey]) {
            matchedKey = "naruto shippuden"; 
        }
        
        window.currentAnimeData = videoDatabase[matchedKey];
        window.currentEpNumber = episode;

        const animeObj = videoDatabase[matchedKey];
        const epData = animeObj?.episodes?.[episode] || animeObj?.episodes?.[1]; 
        const title = animeObj?.name || params.get("anime") || "Anime";

        setWatchPageBackground(title);

        const titleEl = document.getElementById("vidTitle");
        const nameEl = document.getElementById("animeNameText");
        const epEl = document.getElementById("epNumText");

        if (titleEl) titleEl.textContent = `${title} Episode ${episode}`;
        if (nameEl) nameEl.textContent = title;
        if (epEl) epEl.textContent = `Episode ${episode}`;

        let videoUrl = epData?.server1;
        if (currentServer === "server2" && epData?.server2) {
            videoUrl = epData.server2;
        } else {
            videoUrl = epData?.server1 || epData;
        }

        if (!videoUrl || typeof videoUrl !== "string") {
            player.removeAttribute("src");
            return;
        }

        player.src = videoUrl;
        player.setAttribute("allow", "autoplay; fullscreen; picture-in-picture; encrypted-media");
        player.setAttribute("allowfullscreen", "");
        player.setAttribute("referrerpolicy", "no-referrer-when-downgrade");

        const srv1Btn = document.getElementById("srv1Btn");
        const srv2Btn = document.getElementById("srv2Btn");
        if (currentServer === "server2") {
            if (srv2Btn) srv2Btn.classList.add("active");
            if (srv1Btn) srv1Btn.classList.remove("active");
        } else {
            if (srv1Btn) srv1Btn.classList.add("active");
            if (srv2Btn) srv2Btn.classList.remove("active");
        }

        const trayContainer = document.getElementById("episodeTray");
        if (trayContainer && animeObj?.episodes) {
            trayContainer.innerHTML = "";
            const episodeNumbers = Object.keys(animeObj.episodes).map(Number).sort((a, b) => a - b);
            
            episodeNumbers.forEach(i => {
                const epCard = document.createElement("a");
                epCard.className = `ep-tray-card ${i === episode ? "active-ep" : ""}`;
                epCard.href = `watch.html?anime=${encodeURIComponent(title)}&episode=${i}&server=${currentServer}`;
                epCard.textContent = `Episode ${i}`;
                trayContainer.appendChild(epCard);
            });

            const nextBtn = document.getElementById("nextEpBtn");
            if (nextBtn) {
                const currentIndex = episodeNumbers.indexOf(episode);
                if (currentIndex !== -1 && currentIndex < episodeNumbers.length - 1) {
                    const nextEpNum = episodeNumbers[currentIndex + 1];
                    nextBtn.style.display = "inline-block";
                    nextBtn.onclick = () => {
                        params.set("episode", nextEpNum);
                        params.set("server", currentServer);
                        window.location.search = params.toString();
                    };
                } else {
                    nextBtn.style.display = "none";
                }
            }
        }
    }

    window.switchServer = function(serverName) {
        const player = document.getElementById("vidPlayer");
        if (!player || !window.currentAnimeData) return;

        const epData = window.currentAnimeData.episodes?.[window.currentEpNumber];
        if (!epData) return;

        let targetUrl = "";
        const srv1Btn = document.getElementById("srv1Btn");
        const srv2Btn = document.getElementById("srv2Btn");

        if (serverName === 'server1') {
            targetUrl = epData.server1;
            if (srv1Btn) srv1Btn.classList.add("active");
            if (srv2Btn) srv2Btn.classList.remove("active");
        } else if (serverName === 'server2') {
            targetUrl = epData.server2 || epData.server1;
            if (srv2Btn) srv2Btn.classList.add("active");
            if (srv1Btn) srv1Btn.classList.remove("active");
        }

        if (targetUrl) {
            player.src = targetUrl;
            const params = new URLSearchParams(window.location.search);
            params.set("server", serverName);
            window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
        }
    };

    function initHeroVideoPosterFix() {
        const heroVideo = document.getElementById("heroVideo");
        const pageBackground = document.getElementById("pageBackground");
        if (!heroVideo || !pageBackground) return;

        function updateBackground() {
            const playing = !heroVideo.paused && !heroVideo.ended && heroVideo.readyState >= 2;
            pageBackground.style.visibility = playing ? "hidden" : "visible";
        }

        ["playing", "pause", "ended", "waiting", "loadeddata"].forEach(eventName => {
            heroVideo.addEventListener(eventName, updateBackground);
        });
        updateBackground();
    }

    function moveFiltersToBottom() {
        let checkInterval = setInterval(() => {
            const catalogTools = document.getElementById("catalog-tools");
            const destination = document.getElementById("bottom-filter-destination");
            if (catalogTools) {
                if (destination) {
                    destination.appendChild(catalogTools);
                } else {
                    document.body.appendChild(catalogTools);
                }
                clearInterval(checkInterval); 
            }
        }, 500);
    }

    function initPage() {
        initAnimeSystem();
        initEpisodePlayer();
        initHeroVideoPosterFix();
        initDynamicHomePage();
        moveFiltersToBottom(); 
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPage);
    } else {
        initPage();
    }

    async function fetchAnimeCategory(format, sort, title, containerId) {
        const query = `
            query {
                Page(page: 1, perPage: 12) {
                    media(type: ANIME, format: ${format}, sort: ${sort}) {
                        id siteUrl format
                        title { romaji english native }
                        coverImage { extraLarge large }
                    }
                }
            }
        `;

        try {
            const response = await fetch("https://graphql.anilist.co", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ query })
            });

            const result = await response.json();
            if (result?.data?.Page?.media) {
                renderCategorySection(title, result.data.Page.media, containerId);
            }
        } catch (error) {
            console.error(`Error loading ${title}:`, error);
        }
    }

    function createCardHTML(anime) {
        const title = anime.title.english || anime.title.romaji || "Unknown";
        const image = anime.coverImage?.extraLarge || anime.coverImage?.large || "";
        return `
            <a href="${escapeHTML(anime.siteUrl)}" class="premium-card anilist-card" data-title="${escapeHTML(title.toLowerCase())}" target="_blank">
                <div class="card-img-wrapper">
                    <img src="${escapeHTML(image)}" alt="${escapeHTML(title)}" class="card-img" loading="lazy">
                    <div class="card-badges"><span class="badge sub">${anime.format === "MOVIE" ? "MOVIE" : "SERIES"}</span></div>
                    <div class="play-overlay"><i class="fas fa-play"></i></div>
                </div>
                <div class="card-info"><h3 class="card-title">${escapeHTML(title)}</h3></div>
            </a>
        `;
    }

    function renderCategorySection(title, animeList, containerId) {
        const targetDiv = document.getElementById("dynamic-anime-sections");
        if (!targetDiv) return;

        const sectionHTML = `
            <div class="hero-message section-header">
                <span>${title}</span>
                <a href="#" class="view-more-btn">View more</a>
            </div>
            <div class="cards-row" id="${containerId}">
                ${animeList.map(a => createCardHTML(a)).join('')}
            </div>
        `;
        targetDiv.insertAdjacentHTML("beforeend", sectionHTML);
    }

    function initDynamicHomePage() {
        if (!document.getElementById("dynamic-anime-sections")) return;
        
        fetchAnimeCategory("TV", "TRENDING_DESC", "Anime Series", "row-series");
        setTimeout(() => fetchAnimeCategory("MOVIE", "TRENDING_DESC", "Anime Movies", "row-movies"), 500);
        setTimeout(() => fetchAnimeCategory("TV", "START_DATE_DESC", "New Arrivals", "row-new"), 1000);
        setTimeout(() => fetchAnimeCategory("TV", "POPULARITY_DESC", "Most Viewed Anime", "row-popular"), 1500);
    }
})();
