import { calculateFearIndex, fetchMarketData, getFearLabel } from "./utils";
import { StaticGauge } from "./components/StaticGauge";

export const revalidate = 60;

const segments = [
  { label: 'Chill', start: 0, end: 45, color: '#4ade80' },
  { label: 'Normal', start: 45, end: 90, color: '#facc15' },
  { label: 'Worried', start: 90, end: 135, color: '#f97316' },
  { label: 'Panic', start: 135, end: 180, color: '#ef4444' },
];

export default async function Home() {
  const marketData = await fetchMarketData();
  // const marketData = { "vix": 40, "spyChange": 0.7234358915703913, "qqqChange": 0.7732305347617527, "diaChange": 0.5913869793772683, "spyVolume": 0, "spyAverageVolume": 80000000 }

  const fearIndex = calculateFearIndex(marketData);
  const { label, emoji } = getFearLabel(fearIndex);

  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Market Fear Meter</h1>
      {/* <FearMeter fearScore={fearIndex} /> */}
      <div className="w-full xl:w-3/4">
        <StaticGauge fearScore={fearIndex} segments={segments} />

      </div>
      <div className="text-2xl mt-6">
        <span>The market is currently</span>
        {" "}
        <span className="font-bold">{label} {emoji}</span>
      </div>
    </main>
  );
}
