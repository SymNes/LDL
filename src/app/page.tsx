import { getTopPlayersByPoints, getTopPlayersByBullseyes, getTopPlayersByTriples, getNextEvent, getLastEvent } from "@/lib/db/queries";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  const [topPoints, topBullseyes, topTriples, nextEvent, lastEvent] = await Promise.all([
    getTopPlayersByPoints(3),
    getTopPlayersByBullseyes(3),
    getTopPlayersByTriples(3),
    getNextEvent(),
    getLastEvent(),
  ]);

  return (
    <HomePageClient 
      topPoints={topPoints}
      topBullseyes={topBullseyes}
      topTriples={topTriples}
      nextEvent={nextEvent}
      lastEvent={lastEvent}
    />
  );
}
