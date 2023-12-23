
/** レベル計測 
 *  1000ms秒ずつ短くしたいけど良い書き方が思い浮かばない
 * 単純に書くと効果が重複するし
*/
export function levelCalculation(countOfLinesVanished){
    if (countOfLinesVanished >= 270) { 
        return {
            level:10,
            autoDropInterval:1100,
            ojyamaInterval:6000
        }
    }

    if (countOfLinesVanished >= 216) { 
        return {
            level:9,
            autoDropInterval : 1200,
            ojyamaInterval : 7000
        }
    }

    if (countOfLinesVanished >= 168) { 
        return {
            level:8,
            autoDropInterval : 1300,
            ojyamaInterval : 8000
        }
    }

    if (countOfLinesVanished >= 126) { 
        return {
            level:7,
            autoDropInterval : 1400,
            ojyamaInterval : 9000,
        }
    }

    if (countOfLinesVanished >= 90) { 
        return {
            level:6,
            autoDropInterval : 1500,
            ojyamaInterval : 10000,
        }
    }

    if (countOfLinesVanished >= 60) { 
        return {
            level:5,
            autoDropInterval : 1600,
            ojyamaInterval :11000
        }
    }

    if (countOfLinesVanished >= 36) { 
        return {
            level:4,
            autoDropInterval : 1700,
            ojyamaInterval :12000
        }
    }

    if (countOfLinesVanished >= 18) { 
        return {
            level:3,
            autoDropInterval : 1800,
            ojyamaInterval :13000
        }
    }

    if (countOfLinesVanished >= 6) { 
        return {
            level:2,
            autoDropInterval : 1900,
            ojyamaInterval : 14000
        }
    }

    return {
        level:1,
        autoDropInterval : 2000,
        ojyamaInterval : 15000

    }
}