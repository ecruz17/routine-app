import { ProfileGate } from "@/components/navigation/ProfileGate";
import { SuggestionScreen } from "@/components/suggestion/SuggestionScreen";

export default function SuggestionPage() {
  return (
    <ProfileGate>
      <SuggestionScreen />
    </ProfileGate>
  );
}
