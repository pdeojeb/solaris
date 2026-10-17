import { Bike, Coffee, QrCode, Recycle, ShoppingBasket, Sprout, type LucideIcon } from "lucide-react";
import type { QuestIconName } from "@/lib/solaris/content";

const icons: Record<QuestIconName, LucideIcon> = {
  coffee: Coffee,
  recycle: Recycle,
  plant: Sprout,
  market: ShoppingBasket,
  bike: Bike,
  qr: QrCode,
};

export function QuestIcon({ name, className }: { name: QuestIconName; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
