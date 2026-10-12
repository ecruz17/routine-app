import { HomeScreen } from "@/components/home/HomeScreen";
import { ProfileGate } from "@/components/navigation/ProfileGate";

export default function HomePage() {
  return (
    <ProfileGate>
      <HomeScreen />
    </ProfileGate>
  );
}
