import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/LegalPage";
export const metadata: Metadata = { title: "Training Disclaimer", description: "Important health and exercise information for Auric Performance services." };
const sections: LegalSection[] = [
  { title: "Coaching is not medical care", body: <p>Auric Performance provides exercise, coaching, programming and performance services. Unless expressly stated for a specific consultation, these services do not provide medical diagnosis, emergency care or medical treatment.</p> },
  { title: "Before you train", body: <p>Seek advice from an appropriately qualified healthcare professional if you have an injury, medical condition, significant symptoms, are pregnant or recently gave birth, are returning after surgery or treatment, or are unsure whether exercise is suitable.</p> },
  { title: "Your responsibility", body: <p>Provide complete and accurate information that may affect safe exercise. Follow programme instructions, use appropriate equipment and train within a suitable environment. Do not continue an exercise that feels unsafe.</p> },
  { title: "When to stop", body: <p>Stop activity and seek appropriate advice if you experience significant pain, dizziness, faintness, chest pain, unusual breathlessness or another concerning symptom. In an emergency, contact the emergency services.</p> },
  { title: "Individual outcomes", body: <p>Exercise carries inherent risk and results vary. Progress depends on health, training history, consistency, recovery, nutrition and other circumstances. No specific result can be guaranteed.</p> },
];
export default function DisclaimerPage() { return <LegalPage kicker="Health & exercise" title="Training disclaimer" intro="Important information to read before beginning a programme." sections={sections} />; }
