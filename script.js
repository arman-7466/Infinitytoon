/* ==========================================
   INFINITYTOONS - FINAL FIXED SCRIPT ENGINE
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
        "naruto shippuden": { 
            name: "Naruto Shippuden", 
            episodes: { 
                1: { server1: "https://filemoon.org/en/APVmaXbjGXo8/embed", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                2: { server1: "https://filemoon.org/en/ex5z2DXlmKqk/embed", server2: "https://www.youtube.com/embed/xyz" },
                3: { server1: "https://filemoon.org/en/ZvqzlDpYzaD2/embed", server2: "https://www.youtube.com/embed/xyz" },
                4: { server1: "https://filemoon.org/en/N2p3DKdVmMa5/embed", server2: "https://www.youtube.com/embed/xyz" },
                5: { server1: "https://filemoon.org/en/RMKGJ9W8z1oP/embed", server2: "https://www.youtube.com/embed/xyz" },
                6: { server1: "https://filemoon.org/en/qLQ36rXw319j/embed", server2: "https://www.youtube.com/embed/xyz" },
                7: { server1: "https://filemoon.org/en/M2BGwpLNmj40/embed", server2: "https://www.youtube.com/embed/xyz" },
                8: { server1: "https://filemoon.org/en/EL73gXkEz9Ba/embed", server2: "https://www.youtube.com/embed/xyz" },
                9: { server1: "https://filemoon.org/en/APVmaXbjGXo8/embed", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                10: { server1: "https://filemoon.org/en/ex5z2DXlmKqk/embed", server2: "https://www.youtube.com/embed/xyz" },
                11: { server1: "https://filemoon.org/en/ZvqzlDpYzaD2/embed", server2: "https://www.youtube.com/embed/xyz" },
                12: { server1: "https://filemoon.org/en/N2p3DKdVmMa5/embed", server2: "https://www.youtube.com/embed/xyz" },
                13: { server1: "https://filemoon.org/en/RMKGJ9W8z1oP/embed", server2: "https://www.youtube.com/embed/xyz" },
                14: { server1: "https://filemoon.org/en/qLQ36rXw319j/embed", server2: "https://www.youtube.com/embed/xyz" },
                15: { server1: "https://filemoon.org/en/M2BGwpLNmj40/embed", server2: "https://www.youtube.com/embed/xyz" },
                16: { server1: "https://filemoon.org/en/EL73gXkEz9Ba/embed", server2: "https://www.youtube.com/embed/xyz" },
                17: { server1: "https://filemoon.org/en/APVmaXbjGXo8/embed", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                18: { server1: "https://filemoon.org/en/ex5z2DXlmKqk/embed", server2: "https://www.youtube.com/embed/xyz" },
                19: { server1: "https://filemoon.org/en/ZvqzlDpYzaD2/embed", server2: "https://www.youtube.com/embed/xyz" },
                20: { server1: "https://filemoon.org/en/N2p3DKdVmMa5/embed", server2: "https://www.youtube.com/embed/xyz" },
                21: { server1: "https://playmogo.com/e/3t4t1uk90yje", server2: "https://www.youtube.com/embed/xyz" },
                22: { server1: "https://playmogo.com/e/14lsewvb9onq", server2: "https://www.youtube.com/embed/xyz" },
                23: { server1: "https://playmogo.com/e/gln2rqwdldcq", server2: "https://www.youtube.com/embed/xyz" },
                24: { server1: "https://playmogo.com/e/5chc3cma1t4n", server2: "https://www.youtube.com/embed/xyz" },
                25: { server1: "https://playmogo.com/e/ahl84o1b01fp", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                26: { server1: "https://playmogo.com/e/ul9nsqzrjpps", server2: "https://www.youtube.com/embed/xyz" },
                27: { server1: "https://playmogo.com/e/oybkl22yhozb", server2: "https://www.youtube.com/embed/xyz" },
                28: { server1: "https://playmogo.com/e/3rpvv0zbte9b", server2: "https://www.youtube.com/embed/xyz" },
                29: { server1: "https://playmogo.com/e/xkkutf694m7m", server2: "https://www.youtube.com/embed/xyz" },
                30: { server1: "https://playmogo.com/e/o0vpm9agyz2q", server2: "https://www.youtube.com/embed/xyz" },
                31: { server1: "https://playmogo.com/e/r06zurxelnwj", server2: "https://www.youtube.com/embed/xyz" },
                32: { server1: "https://playmogo.com/e/v9cwdjh5gt3k", server2: "https://www.youtube.com/embed/xyz" },
                33: { server1: "https://playmogo.com/e/nwg3l34w16xa", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                34: { server1: "https://playmogo.com/e/5i5i0rvc22d6", server2: "https://www.youtube.com/embed/xyz" },
                35: { server1: "https://playmogo.com/e/juauvlqujjf1", server2: "https://www.youtube.com/embed/xyz" },
                36: { server1: "https://playmogo.com/e/l9xdv8gmpaqk", server2: "https://www.youtube.com/embed/xyz" },
                37: { server1: "https://playmogo.com/e/313w5se68mr1", server2: "https://www.youtube.com/embed/xyz" },
                38: { server1: "https://playmogo.com/e/9klteaymj8h0", server2: "https://www.youtube.com/embed/xyz" },
                39: { server1: "https://playmogo.com/e/haxnku9e9m0s", server2: "https://www.youtube.com/embed/xyz" },
                40: { server1: "https://playmogo.com/e/tg3y3uq1xtvv", server2: "https://www.youtube.com/embed/xyz" },
                41: { server1: "https://playmogo.com/e/evn1742qvqh7", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                42: { server1: "https://playmogo.com/e/e9fwmaht2er1", server2: "https://www.youtube.com/embed/xyz" },
                43: { server1: "https://playmogo.com/e/qcu5t3hynes9", server2: "https://www.youtube.com/embed/xyz" },
                44: { server1: "https://playmogo.com/e/4wppmpf2lrkf", server2: "https://www.youtube.com/embed/xyz" },
                45: { server1: "https://playmogo.com/e/dnclc6ix7t83", server2: "https://www.youtube.com/embed/xyz" },
                46: { server1: "https://playmogo.com/e/rpmfjy1v76c1", server2: "https://www.youtube.com/embed/xyz" },
                47: { server1: "https://playmogo.com/e/98w9rt0yaipm", server2: "https://www.youtube.com/embed/xyz" },
                48: { server1: "https://playmogo.com/e/3o8jjjbfnr4p", server2: "https://www.youtube.com/embed/xyz" },
                49: { server1: "https://playmogo.com/e/g08t878nskqq", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                50: { server1: "https://playmogo.com/e/bzuo9fz9khmn", server2: "https://www.youtube.com/embed/xyz" },
                51: { server1: "https://playmogo.com/e/gtimmhb2dr59", server2: "https://www.youtube.com/embed/xyz" },
                52: { server1: "https://playmogo.com/e/2pwcfriadmfq", server2: "https://www.youtube.com/embed/xyz" },
                53: { server1: "https://playmogo.com/e/z18vgegl6xwf", server2: "https://www.youtube.com/embed/xyz" },
                54: { server1: "https://playmogo.com/e/g1jn1mmpzilt", server2: "https://www.youtube.com/embed/xyz" },
                55: { server1: "https://playmogo.com/e/eztw2bx9jqej", server2: "https://www.youtube.com/embed/xyz" },
                56: { server1: "https://playmogo.com/e/emacq319witg", server2: "https://www.youtube.com/embed/xyz" },
                57: { server1: "https://playmogo.com/e/q1vb5vaizjqy", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                58: { server1: "https://playmogo.com/e/qx89udx8ua11", server2: "https://www.youtube.com/embed/xyz" },
                59: { server1: "https://playmogo.com/e/f4o497olr04o", server2: "https://www.youtube.com/embed/xyz" },
                60: { server1: "https://playmogo.com/e/y392wmwt5ou1", server2: "https://www.youtube.com/embed/xyz" },
                61: { server1: "https://playmogo.com/e/sn6vez4fgno4", server2: "https://www.youtube.com/embed/xyz" },
                62: { server1: "https://playmogo.com/e/1oak998osokz", server2: "https://www.youtube.com/embed/xyz" },
                63: { server1: "https://playmogo.com/e/ic6w1hgzwm4l", server2: "https://www.youtube.com/embed/xyz" },
                64: { server1: "https://playmogo.com/e/yuw1wpnwrdyl", server2: "https://www.youtube.com/embed/xyz" },
                65: { server1: "https://playmogo.com/e/0dz956x4g85b", server2: "https://www.youtube.com/embed/xyz" },
                66: { server1: "https://playmogo.com/e/1lemm5u846vv", server2: "https://www.youtube.com/embed/xyz" },
                67: { server1: "https://playmogo.com/e/h535htvjjyhd", server2: "https://www.youtube.com/embed/xyz" },
                68: { server1: "https://playmogo.com/e/h5jl2on36fpu", server2: "https://www.youtube.com/embed/xyz" },
                69: { server1: "https://playmogo.com/e/7jzknavuoqqt", server2: "https://www.youtube.com/embed/xyz" },
                70: { server1: "https://playmogo.com/e/19a2xwswavhl", server2: "https://www.youtube.com/embed/xyz" },
                71: { server1: "https://playmogo.com/e/b4og3az2t14i", server2: "https://www.youtube.com/embed/xyz" },
                72: { server1: "https://playmogo.com/e/qtilnp5em4u0", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                73: { server1: "https://playmogo.com/e/qfme856e5edz", server2: "https://www.youtube.com/embed/xyz" },
                74: { server1: "https://playmogo.com/e/hwivpswq6rpr", server2: "https://www.youtube.com/embed/xyz" },
                75: { server1: "https://playmogo.com/e/645s3js3yyar", server2: "https://www.youtube.com/embed/xyz" },
                76: { server1: "https://playmogo.com/e/nuxov5nlojr5", server2: "https://www.youtube.com/embed/xyz" },
                77: { server1: "https://playmogo.com/e/c4aomiehmdus", server2: "https://www.youtube.com/embed/xyz" },
                78: { server1: "https://playmogo.com/e/tfjukk2g94zu", server2: "https://www.youtube.com/embed/xyz" },
                79: { server1: "https://playmogo.com/e/sz2kxbpjercx", server2: "https://www.youtube.com/embed/xyz" },
                80: { server1: "https://playmogo.com/e/6aiv2r7hy9jx", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                81: { server1: "https://playmogo.com/e/vfqj2n39czbl", server2: "https://www.youtube.com/embed/xyz" },
                82: { server1: "https://playmogo.com/e/urymym8kqneg", server2: "https://www.youtube.com/embed/xyz" },
                83: { server1: "https://playmogo.com/e/ctzgrnsq77nj", server2: "https://www.youtube.com/embed/xyz" },
                84: { server1: "https://playmogo.com/e/opo38yq5wkrh", server2: "https://www.youtube.com/embed/xyz" },
                85: { server1: "https://playmogo.com/e/hftyin78jdvi", server2: "https://www.youtube.com/embed/xyz" },
                86: { server1: "https://playmogo.com/e/3ay4z7zixawv", server2: "https://www.youtube.com/embed/xyz" },
                87: { server1: "https://playmogo.com/e/lysekoi0vet1", server2: "https://www.youtube.com/embed/xyz" },
                88: { server1: "https://playmogo.com/e/iv0t6oyl9mir", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                89: { server1: "https://playmogo.com/e/duq4amw1zaqa", server2: "https://www.youtube.com/embed/xyz" },
                90: { server1: "https://playmogo.com/e/hckxvztw7njy", server2: "https://www.youtube.com/embed/xyz" },
                91: { server1: "https://playmogo.com/e/ybpngpdd2loz", server2: "https://www.youtube.com/embed/xyz" },
                92: { server1: "https://playmogo.com/e/3id87s8hab1n", server2: "https://www.youtube.com/embed/xyz" },
                93: { server1: "https://playmogo.com/e/4xupgzj29ezm", server2: "https://www.youtube.com/embed/xyz" },
                94: { server1: "https://playmogo.com/e/s6turja41p65", server2: "https://www.youtube.com/embed/xyz" },
                95: { server1: "https://playmogo.com/e/0pc07qxfza1q", server2: "https://www.youtube.com/embed/xyz" },
                96: { server1: "https://playmogo.com/e/ty45oc0kty4o", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                97: { server1: "https://playmogo.com/e/zrwd1un39y2z", server2: "https://www.youtube.com/embed/xyz" },
                98: { server1: "https://playmogo.com/e/62r6itxpdxqh", server2: "https://www.youtube.com/embed/xyz" },
                99: { server1: "https://playmogo.com/e/lfzmft5dtlvo", server2: "https://www.youtube.com/embed/xyz" },
                100: { server1: "https://playmogo.com/e/klryt8dikn85", server2: "https://www.youtube.com/embed/xyz" },
                101: { server1: "https://playmogo.com/e/muirt54labbh", server2: "https://www.youtube.com/embed/xyz" },
                102: { server1: "https://playmogo.com/e/1j87tm59h3rh", server2: "https://www.youtube.com/embed/xyz" },
                103: { server1: "https://playmogo.com/e/bplek34i4at5", server2: "https://www.youtube.com/embed/xyz" },
                104: { server1: "https://playmogo.com/e/66pkphc1tamw", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                105: { server1: "https://playmogo.com/e/5k9cbnx7z4un", server2: "https://www.youtube.com/embed/xyz" },
                106: { server1: "https://playmogo.com/e/yvcvva1wn9ze", server2: "https://www.youtube.com/embed/xyz" },
                107: { server1: "https://playmogo.com/e/hn5p2gn6xbme", server2: "https://www.youtube.com/embed/xyz" },
                108: { server1: "https://playmogo.com/e/yidwhrihyvwz", server2: "https://www.youtube.com/embed/xyz" },
                109: { server1: "https://playmogo.com/e/4rh7g8l17s0r", server2: "https://www.youtube.com/embed/xyz" },
                110: { server1: "https://playmogo.com/e/r3ny0ctekzne", server2: "https://www.youtube.com/embed/xyz" },
                111: { server1: "https://playmogo.com/e/vwdnuapq4s0p", server2: "https://www.youtube.com/embed/xyz" },
                112: { server1: "https://playmogo.com/e/b2y7etvhv1iv", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                113: { server1: "https://playmogo.com/e/6lplc2kzivcs", server2: "https://www.youtube.com/embed/xyz" },
                114: { server1: "https://playmogo.com/e/75fpvc0ak2sk", server2: "https://www.youtube.com/embed/xyz" },
                115: { server1: "https://playmogo.com/e/ndwl9ecoma9v", server2: "https://www.youtube.com/embed/xyz" },
                116: { server1: "https://playmogo.com/e/4jm4g6ofy881", server2: "https://www.youtube.com/embed/xyz" },
                117: { server1: "https://playmogo.com/e/tasxq9ju98bb", server2: "https://www.youtube.com/embed/xyz" },
                118: { server1: "https://playmogo.com/e/gz9iyl9avm1m", server2: "https://www.youtube.com/embed/xyz" },
                119: { server1: "https://playmogo.com/e/l555wgnqq5nf", server2: "https://www.youtube.com/embed/xyz" },
                120: { server1: "https://playmogo.com/e/t3qzrv2k901x", server2: "https://www.youtube.com/embed/xyz" },
                121: { server1: "https://playmogo.com/e/1knh1g46urcd", server2: "https://www.youtube.com/embed/xyz" },
                122: { server1: "https://playmogo.com/e/cqj01esv7cts", server2: "https://www.youtube.com/embed/xyz" },
                123: { server1: "https://playmogo.com/e/pzomc6ho23va", server2: "https://www.youtube.com/embed/xyz" },
                124: { server1: "https://playmogo.com/e/1918o0ct24gb", server2: "https://www.youtube.com/embed/xyz" },
                125: { server1: "https://playmogo.com/e/30wo2bvso11o", server2: "https://www.youtube.com/embed/xyz" },
                126: { server1: "https://playmogo.com/e/vcp2pub0qnh7", server2: "https://www.youtube.com/embed/xyz" },
                127: { server1: "https://playmogo.com/e/kfqv9e3fads5", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                128: { server1: "https://playmogo.com/e/01wwqlj5vpvv", server2: "https://www.youtube.com/embed/xyz" },
                129: { server1: "https://playmogo.com/e/muo13k5bgwv5", server2: "https://www.youtube.com/embed/xyz" },
                130: { server1: "https://playmogo.com/e/lm1iqxyjixh6", server2: "https://www.youtube.com/embed/xyz" },
                131: { server1: "https://playmogo.com/e/qpbgrdu6c7xh", server2: "https://www.youtube.com/embed/xyz" },
                132: { server1: "https://playmogo.com/e/3yvdkfugmrth", server2: "https://www.youtube.com/embed/xyz" },
                133: { server1: "https://playmogo.com/e/rymvl44qgj7b", server2: "https://www.youtube.com/embed/xyz" },
                134: { server1: "https://playmogo.com/e/qfzqwd3uf83h", server2: "https://www.youtube.com/embed/xyz" },
                135: { server1: "https://playmogo.com/e/pp5zrwt41ime", server2: "https://www.youtube.com/embed/w1my8nj0euez" }, 
                136: { server1: "https://playmogo.com/e/e9sgppt5g38w", server2: "https://www.youtube.com/embed/xyz" },
                137: { server1: "https://playmogo.com/e/639gwrh0zeqa", server2: "https://www.youtube.com/embed/xyz" },
                138: { server1: "https://playmogo.com/e/o49bfanzj417", server2: "https://www.youtube.com/embed/xyz" },
                139: { server1: "https://playmogo.com/e/xpjcm0ny9aq8", server2: "https://www.youtube.com/embed/xyz" },
                140: { server1: "https://playmogo.com/e/ogmz1n0igo79", server2: "https://www.youtube.com/embed/xyz" },
                141: { server1: "https://playmogo.com/e/5f47mf2igue2", server2: "https://www.youtube.com/embed/xyz" },
                142: { server1: "https://playmogo.com/e/8u2ahbvd1jyu", server2: "https://www.youtube.com/embed/xyz" },
                143: { server1: "https://playmogo.com/e/61scgye4yiwo", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                144: { server1: "https://playmogo.com/e/bbiqp4z8pjbl", server2: "https://www.youtube.com/embed/xyz" },
                145: { server1: "https://playmogo.com/e/js9lg81ir92a", server2: "https://www.youtube.com/embed/xyz" },
                146: { server1: "https://playmogo.com/e/b5hoxhfk9f5s", server2: "https://www.youtube.com/embed/xyz" },
                147: { server1: "https://playmogo.com/e/64n9phpsxl8b", server2: "https://www.youtube.com/embed/xyz" },
                148: { server1: "https://playmogo.com/e/fx099jb5q44t", server2: "https://www.youtube.com/embed/xyz" },
                149: { server1: "https://playmogo.com/e/g08t878nskqq", server2: "https://www.youtube.com/embed/xyz" },
                150: { server1: "https://playmogo.com/e/yhf6exi6zgr7", server2: "https://www.youtube.com/embed/xyz" },
                151: { server1: "https://playmogo.com/e/gtimmhb2dr59", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                152: { server1: "https://playmogo.com/e/ry5yo6kyzyhx", server2: "https://www.youtube.com/embed/xyz" },
                153: { server1: "https://playmogo.com/e/uksb8wmlayb8", server2: "https://www.youtube.com/embed/xyz" },
                154: { server1: "https://playmogo.com/e/hpp9wc52p83x", server2: "https://www.youtube.com/embed/xyz" },
                155: { server1: "https://playmogo.com/e/m19eg6x35e4d", server2: "https://www.youtube.com/embed/xyz" },
                156: { server1: "https://playmogo.com/e/idojmkowh75c", server2: "https://www.youtube.com/embed/xyz" },
                157: { server1: "https://playmogo.com/e/qjh6jn33dok4", server2: "https://www.youtube.com/embed/xyz" },
                158: { server1: "https://playmogo.com/e/3z54k8jsjrar", server2: "https://www.youtube.com/embed/xyz" },
                159: { server1: "https://playmogo.com/e/dhcy19k42cha", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                160: { server1: "https://playmogo.com/e/xjxe05pcdelr", server2: "https://www.youtube.com/embed/xyz" },
                161: { server1: "https://playmogo.com/e/t7k458i2aecu", server2: "https://www.youtube.com/embed/xyz" },
                162: { server1: "https://filemoon.org/en/N2p3DKdVmMa5/embed", server2: "https://www.youtube.com/embed/xyz" },
                163: { server1: "https://filemoon.org/en/RMKGJ9W8z1oP/embed", server2: "https://www.youtube.com/embed/xyz" },
                164: { server1: "https://filemoon.org/en/qLQ36rXw319j/embed", server2: "https://www.youtube.com/embed/xyz" },
                165: { server1: "https://filemoon.org/en/M2BGwpLNmj40/embed", server2: "https://www.youtube.com/embed/xyz" },
                166: { server1: "https://filemoon.org/en/EL73gXkEz9Ba/embed", server2: "https://www.youtube.com/embed/xyz" },
                167: { server1: "https://filemoon.org/en/APVmaXbjGXo8/embed", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                168: { server1: "https://filemoon.org/en/ex5z2DXlmKqk/embed", server2: "https://www.youtube.com/embed/xyz" },
                169: { server1: "https://filemoon.org/en/ZvqzlDpYzaD2/embed", server2: "https://www.youtube.com/embed/xyz" },
                170: { server1: "https://filemoon.org/en/N2p3DKdVmMa5/embed", server2: "https://www.youtube.com/embed/xyz" },
                171: { server1: "https://filemoon.org/en/RMKGJ9W8z1oP/embed", server2: "https://www.youtube.com/embed/xyz" },
                172: { server1: "https://filemoon.org/en/qLQ36rXw319j/embed", server2: "https://www.youtube.com/embed/xyz" },
                173: { server1: "https://filemoon.org/en/M2BGwpLNmj40/embed", server2: "https://www.youtube.com/embed/xyz" },
                174: { server1: "https://filemoon.org/en/EL73gXkEz9Ba/embed", server2: "https://www.youtube.com/embed/xyz" },
                349: { server1: "https://playmogo.com/e/3dxest1x5dcw", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                350: { server1: "https://playmogo.com/e/ek70b0wghywy", server2: "https://www.youtube.com/embed/xyz" },
                351: { server1: "https://playmogo.com/e/utyxyvlz212p", server2: "https://www.youtube.com/embed/xyz" },
                352: { server1: "https://playmogo.com/e/f9weocunwmcm", server2: "https://www.youtube.com/embed/xyz" },
                353: { server1: "https://playmogo.com/e/nlbdxuyvig0f", server2: "https://www.youtube.com/embed/xyz" },
                354: { server1: "https://playmogo.com/e/1pjwvmxramkp", server2: "https://www.youtube.com/embed/xyz" },
                355: { server1: "https://playmogo.com/e/emv7g04hcnab", server2: "https://www.youtube.com/embed/xyz" },
                356: { server1: "https://playmogo.com/e/ngd51v5y338o", server2: "https://www.youtube.com/embed/xyz" },
                357: { server1: "https://playmogo.com/e/rqcclvvvopo9", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                358: { server1: "https://playmogo.com/e/kaga8fcmtk8u", server2: "https://www.youtube.com/embed/xyz" },
                359: { server1: "https://playmogo.com/e/esordfdc5whi", server2: "https://www.youtube.com/embed/xyz" },
                360: { server1: "https://playmogo.com/e/6jul8jb2no1l", server2: "https://www.youtube.com/embed/xyz" },
                361: { server1: "https://playmogo.com/e/6xcckypdxxn9", server2: "https://www.youtube.com/embed/xyz" },
                362: { server1: "https://playmogo.com/e/abiwqv51lql6", server2: "https://www.youtube.com/embed/xyz" },
                363: { server1: "https://playmogo.com/e/4e5dhtwccq15", server2: "https://www.youtube.com/embed/xyz" },
                364: { server1: "https://playmogo.com/e/0pb1r355zd8r", server2: "https://www.youtube.com/embed/xyz" },
                365: { server1: "https://playmogo.com/e/pwu18nvesere", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                366: { server1: "https://playmogo.com/e/os3fdam7miwh", server2: "https://www.youtube.com/embed/xyz" },
                367: { server1: "https://playmogo.com/e/g9egi4qdax5v", server2: "https://www.youtube.com/embed/xyz" },
                368: { server1: "https://playmogo.com/e/0vbvwt474fy7", server2: "https://www.youtube.com/embed/xyz" },
                369: { server1: "https://playmogo.com/e/mddqhqi55un5", server2: "https://www.youtube.com/embed/xyz" },
                370: { server1: "https://playmogo.com/e/y6970qpvamw5", server2: "https://www.youtube.com/embed/xyz" },
                371: { server1: "https://playmogo.com/e/24jxl7e7pyps", server2: "https://www.youtube.com/embed/xyz" },
                372: { server1: "https://playmogo.com/e/o7hzia6gugzs", server2: "https://www.youtube.com/embed/xyz" },
                373: { server1: "https://playmogo.com/e/rshflyt7ifuf", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                374: { server1: "https://playmogo.com/e/m1hiw00f81ts", server2: "https://www.youtube.com/embed/xyz" },
                375: { server1: "https://filemoon.org/en/ZvqzlDpYzaD2/embed", server2: "https://www.youtube.com/embed/xyz" },
                376: { server1: "https://filemoon.org/en/N2p3DKdVmMa5/embed", server2: "https://www.youtube.com/embed/xyz" },
                377: { server1: "https://filemoon.org/en/RMKGJ9W8z1oP/embed", server2: "https://www.youtube.com/embed/xyz" },
                378: { server1: "https://filemoon.org/en/qLQ36rXw319j/embed", server2: "https://www.youtube.com/embed/xyz" },
                379: { server1: "https://filemoon.org/en/M2BGwpLNmj40/embed", server2: "https://www.youtube.com/embed/xyz" },
                380: { server1: "https://filemoon.org/en/EL73gXkEz9Ba/embed", server2: "https://www.youtube.com/embed/xyz" },
                381: { server1: "https://filemoon.org/en/APVmaXbjGXo8/embed", server2: "https://playmogo.com/e/w1my8nj0euez" }, 
                382: { server1: "https://filemoon.org/en/ex5z2DXlmKqk/embed", server2: "https://www.youtube.com/embed/xyz" },
                383: { server1: "https://filemoon.org/en/ZvqzlDpYzaD2/embed", server2: "https://www.youtube.com/embed/xyz" },
                384: { server1: "https://filemoon.org/en/N2p3DKdVmMa5/embed", server2: "https://www.youtube.com/embed/xyz" },
                385: { server1: "https://filemoon.org/en/RMKGJ9W8z1oP/embed", server2: "https://www.youtube.com/embed/xyz" },
                386: { server1: "https://filemoon.org/en/qLQ36rXw319j/embed", server2: "https://www.youtube.com/embed/xyz" },
                387: { server1: "https://filemoon.org/en/M2BGwpLNmj40/embed", server2: "https://www.youtube.com/embed/xyz" },
                388: { server1: "https://filemoon.org/en/EL73gXkEz9Ba/embed", server2: "https://www.youtube.com/embed/xyz" }
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

    // 4. TMDB Fetcher (Filtered strictly for Animation genre ID 16)
    async function fetchTMDB(search) {
        try {
            if (!search) return [];
            let url = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(search)}`;
            const res = await fetch(url);
            if (!res.ok) return [];
            const data = await res.json();

            return (data.results || []).filter(item => item.genre_ids && item.genre_ids.includes(16)).map(item => ({
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

    // 5. Pure Anime Top 10 Using AniList GraphQL
    async function loadTopRatedAnime() {
        const topContainer = document.querySelector(".top-rated-container");
        if (!topContainer) return;

        try {
            const query = `
                query {
                    Page(page: 1, perPage: 10) {
                        media(type: ANIME, sort: SCORE_DESC) {
                            id
                            siteUrl
                            title { romaji english }
                            coverImage { extraLarge large }
                        }
                    }
                }
            `;
            const response = await fetch(ANILIST_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ query })
            });
            const result = await response.json();
            const mediaList = result?.data?.Page?.media || [];

            if (mediaList.length > 0) {
                topContainer.innerHTML = mediaList.map((item, index) => {
                    const title = item.title.english || item.title.romaji || "Top Rated";
                    const poster = item.coverImage?.extraLarge || item.coverImage?.large || "";
                    const rank = index + 1;
                    return `
                        <a href="watch.html?anime=${encodeURIComponent(title)}&episode=1" class="top-card">
                            <div class="rank-number">${rank}</div>
                            <div class="top-img-box">
                                <img src="${escapeHTML(poster)}" alt="${escapeHTML(title)}" loading="lazy">
                            </div>
                        </a>
                    `;
                }).join("");
            }
        } catch (e) {
            console.error("Top Rated Anime load error:", e);
        }
    }

    // 6. Ultimate Combined Aggregator
    async function fetchAnimeCombined(page, search, format, id) {
        const promises = [fetchAnilist(page, search, format, id)];
        if (search) {
            promises.push(fetchJikan(search, page), fetchKitsu(search), fetchTMDB(search));
        }

        const results = await Promise.all(promises);
        const anilistData = results[0];
        let mediaList = anilistData?.media || [];
        let hasNext = anilistData?.pageInfo?.hasNextPage || false;

        if (search) {
            const jikanRes = results[1] || [];
            const kitsuRes = results[2] || [];
            const tmdbRes = results[3] || [];
            const merged = [...mediaList, ...jikanRes, ...kitsuRes, ...tmdbRes];
            const uniqueMap = new Map();

            merged.forEach(item => {
                const titleKey = (item.title?.english || item.title?.romaji || item.title?.native || "").toLowerCase().trim();
                if (titleKey && !uniqueMap.has(titleKey)) {
                    uniqueMap.set(titleKey, item);
                }
            });

            mediaList = Array.from(uniqueMap.values());
        }

        return {
            media: mediaList,
            pageInfo: { currentPage: page, hasNextPage: hasNext }
        };
    }

    function createCard(anime) {
        const title = anime.title?.english || anime.title?.romaji || anime.title?.native || "Unknown Anime";
        const image = anime.coverImage?.extraLarge || anime.coverImage?.large || "";
        const href = `watch.html?anime=${encodeURIComponent(title)}&episode=1`;

        return `
            <a href="${escapeHTML(href)}" class="premium-card search-item anilist-card" data-title="${escapeHTML(title.toLowerCase())}">
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
        const grid = document.getElementById("anilist-results-grid") || document.getElementById("mixed-container");
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
            const cards = data.media.filter(anime => {
                const title = (anime.title?.english || anime.title?.romaji || anime.title?.native || "").toLowerCase();
                return !existing.has(title) && anime.coverImage;
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
        let grid = document.getElementById("anilist-results-grid") || document.getElementById("mixed-container");
        const container = document.getElementById("mixed-container");

        if (!grid) {
            const targetParent = container || document.querySelector("main") || document.body;
            const section = document.createElement("section");
            section.id = "anilist-section";
            section.innerHTML = `
                <h2>Global Search Results</h2>
                <p id="anilist-status" role="status" aria-live="polite"></p>
                <div id="anilist-results-grid"></div>
                <button id="anilist-load-more" type="button" style="margin:24px auto;padding:12px 24px;display:block;">Load More</button>
            `;
            targetParent.insertAdjacentElement("beforeend", section);
            grid = document.getElementById("anilist-results-grid");
        }

        const loadMoreBtn = document.getElementById("anilist-load-more");
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener("click", () => loadAnime());
        }

        // Universal search bar binding for all pages
        const inputs = document.querySelectorAll("#animeSearch, input[type='search'], input[name='search']");
        inputs.forEach(input => {
            input.addEventListener("input", (e) => {
                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => {
                    currentSearch = e.target.value.trim();
                    requestId++;
                    loading = false;
                    loadAnime(true);
                }, 300);
            });
        });

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
        loadTopRatedAnime();
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
            const response = await fetch(ANILIST_URL, {
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
        const href = `watch.html?anime=${encodeURIComponent(title)}&episode=1`;

        return `
            <a href="${escapeHTML(href)}" class="premium-card anilist-card" data-title="${escapeHTML(title.toLowerCase())}">
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
            <div class="hero-message section-header" style="width:100%; display:flex; justify-content:space-between; margin-bottom:12px;">
                <span>${title}</span>
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
