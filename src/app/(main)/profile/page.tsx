import { ProfileGate } from "@/components/navigation/ProfileGate";
import { ProfileScreen } from "@/components/profile/ProfileScreen";

export default function ProfilePage() {
  return (
    <ProfileGate>
      <ProfileScreen />
    </ProfileGate>
  );
}
