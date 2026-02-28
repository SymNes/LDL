import { getAllTopPlayers } from "@/lib/db/queries";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
  // Single query to get all top players at once
  const { topPoints, topBullseyes, topTriples } = await getAllTopPlayers();

  return (
    <HomePageClient
      topPoints={topPoints}
      topBullseyes={topBullseyes}
      topTriples={topTriples}
    />
  );
}
