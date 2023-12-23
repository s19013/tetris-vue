// aiに面白いやり方を教えてもらった

export const levelConfig = [
    { threshold: 270, level: 10, autoDropInterval: 1100, ojyamaInterval: 6000 },
    { threshold: 216, level: 9,  autoDropInterval: 1200, ojyamaInterval: 7000 },
    { threshold: 168, level: 8,  autoDropInterval: 1300, ojyamaInterval: 8000 },
    { threshold: 126, level: 7,  autoDropInterval: 1400, ojyamaInterval: 9000 },
    { threshold: 90,  level: 6,  autoDropInterval: 1500, ojyamaInterval: 10000 },
    { threshold: 60,  level: 5,  autoDropInterval: 1600, ojyamaInterval: 11000 },
    { threshold: 36,  level: 4,  autoDropInterval: 1700, ojyamaInterval: 12000 },
    { threshold: 18,  level: 3,  autoDropInterval: 1800, ojyamaInterval: 13000 },
    { threshold: 6,   level: 2,  autoDropInterval: 1900, ojyamaInterval: 14000 },
    { threshold: 0,   level: 1,  autoDropInterval: 2000, ojyamaInterval: 15000 },
];
/**
 * levelConfig.find(config => countOfLinesVanished >= config.threshold);
 * 設定した値 がしきい値を初めて超える時のオブジェクトを返す
 * 
 * 例:countOfLinesVanished = 100の時
 * 上から見て言って､ 4番目の100 > 126までは成立しないが
 * 5番目の100 > 90で初めて成立するので5番目のオブジェクトが返される
 * 
 * js公式の((element) => element > 10)をイメージするとわかりやすいと思う
 */
