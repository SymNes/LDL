import { getSeasonsInfo, getRankingsBySeason } from "@/lib/db/queries";
import ClassementPageClient from "./ClassementPageClient";

interface ClassementPageProps {
  searchParams: { saison?: string };
}

export default async function ClassementPage({ searchParams }: ClassementPageProps) {
  const { currentSeason, seasons } = await getSeasonsInfo();
  const selectedSeason = searchParams.saison || currentSeason;
  
  const rankings = await getRankingsBySeason(selectedSeason);

  return (
    <ClassementPageClient 
      seasons={seasons} 
      currentSeason={selectedSeason} 
      rankings={rankings} 
    />
  );
}
