
const BASE_URL = 'https://query1.finance.yahoo.com/v8/finance/chart';

async function fetchYahooData(symbol: string): Promise<any> {
    const url = `${BASE_URL}/${symbol}?range=1d&interval=1m`;
    const response = await (await fetch(url)).json();

    return response.chart.result[0];
}

export async function fetchMarketData() {
    // Fetch VIX
    const vixData = await fetchYahooData('^VIX');
    const vix = vixData.meta.regularMarketPrice; // current VIX value

    // Fetch SPY
    const spyData = await fetchYahooData('SPY');
    const spyClose = spyData.meta.regularMarketPrice;
    const spyPrevClose = spyData.meta.chartPreviousClose;
    const spyVolume = spyData.indicators.quote[0].volume.slice(-1)[0];

    // Fetch QQQ
    const qqqData = await fetchYahooData('QQQ');
    const qqqClose = qqqData.meta.regularMarketPrice;
    const qqqPrevClose = qqqData.meta.chartPreviousClose;

    // Fetch DIA
    const diaData = await fetchYahooData('DIA');
    const diaClose = diaData.meta.regularMarketPrice;
    const diaPrevClose = diaData.meta.chartPreviousClose;

    // Calculate daily % changes
    const spyChange = ((spyClose - spyPrevClose) / spyPrevClose) * 100;
    const qqqChange = ((qqqClose - qqqPrevClose) / qqqPrevClose) * 100;
    const diaChange = ((diaClose - diaPrevClose) / diaPrevClose) * 100;

    // Approximate SPY average volume (this would ideally be a 30-day average, but you can hardcode ~80M as rough avg)
    const spyAverageVolume = 80000000; // 80 million (SPY rough avg)

    return {
        vix,
        spyChange,
        qqqChange,
        diaChange,
        spyVolume,
        spyAverageVolume,
    };
}

type MarketData = {
    vix: number; // current VIX value
    spyChange: number; // % daily change
    qqqChange: number;
    diaChange: number;
    spyVolume: number; // current SPY volume
    spyAverageVolume: number; // 30-day average SPY volume
};

export function calculateFearIndex(data: MarketData): number {
    const normalizedVIX = normalize(data.vix, 10, 40); // VIX usually between 10 and 80 historically
    const avgMarketMove = Math.abs((data.spyChange + data.qqqChange + data.diaChange) / 3);
    const normalizedMarketMove = normalize(avgMarketMove, 0, 5); // Usually market moves between 0%-5%

    const volumeSpike = data.spyVolume / data.spyAverageVolume;
    const normalizedVolume = normalize(volumeSpike, 1, 3); // 1x to 3x average volume

    const fearScore = (normalizedVIX * 0.6) + (normalizedMarketMove * 0.3) + (normalizedVolume * 0.1);

    return Math.min(100, Math.max(0, fearScore)); // Clamp to 0-100
}

function normalize(value: number, min: number, max: number): number {
    return ((value - min) / (max - min)) * 100;
}

export function getFearLabel(score: number): { label: string; emoji: string } {
    if (score < 25) {
        return { label: 'Chillin', emoji: '😎' };
    } else if (score < 50) {
        return { label: 'Getting Worried', emoji: '😬' };
    } else if (score < 75) {
        return { label: 'Nervous', emoji: '😰' };
    } else {
        return { label: 'Full Panic', emoji: '😱' };
    }
}
