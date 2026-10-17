import { useEffect, useState } from "react";
import { Building2, Leaf, Map, Sun } from "lucide-react";
import { cn } from "@/lib/cn";
import { CityView } from "@/components/solaris/city-view";
import { ImpactView } from "@/components/solaris/impact-view";
import { QuestView } from "@/components/solaris/quest-view";
import { VerifyPanel } from "@/components/solaris/verify-panel";
import { Welcome } from "@/components/solaris/welcome";
import { STAGE_NAMES } from "@/lib/solaris/content";
import { campusOpen, cityStage, useSolaris } from "@/lib/solaris/store";

type Tab = "city" | "quests" | "impact";

const tabs: { id: Tab; label: string; icon: typeof Building2 }[] = [
  { id: "city", label: "Город", icon: Building2 },
  { id: "quests", label: "Квесты", icon: Leaf },
  { id: "impact", label: "След", icon: Map },
];

export function SolarisApp() {
  const welcomed = useSolaris((state) => state.welcomed);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("city");
  const [questId, setQuestId] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    const pending = useSolaris.persist.rehydrate();
    void Promise.resolve(pending).finally(() => {
      if (!live) return;
      useSolaris.getState().ensureToday();
      setReady(true);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!ready || !welcomed) return <Welcome />;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="mx-auto flex min-h-dvh max-w-6xl">
        <aside className="hidden w-56 shrink-0 border-r border-line px-4 py-6 md:block">
          <p className="font-display text-3xl">Solaris</p>
          <nav className="mt-8 flex flex-col gap-1" aria-label="Разделы">
            {tabs.map((item) => (
              <NavButton key={item.id} item={item} active={tab === item.id} onClick={() => setTab(item.id)} />
            ))}
          </nav>
        </aside>
        <div className="min-w-0 flex-1">
          <TopBar />
          <main className="px-4 pt-4 pb-28 md:px-8 md:pb-12">
            {tab === "city" ? <CityView onOpenQuests={() => setTab("quests")} /> : null}
            {tab === "quests" ? <QuestView onOpen={setQuestId} /> : null}
            {tab === "impact" ? <ImpactView /> : null}
          </main>
        </div>
      </div>
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg md:hidden"
        aria-label="Разделы"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-lg">
          {tabs.map((item) => (
            <NavButton key={item.id} item={item} active={tab === item.id} onClick={() => setTab(item.id)} stacked />
          ))}
        </div>
      </nav>
      {questId ? (
        <VerifyPanel
          questId={questId}
          onClose={() => setQuestId(null)}
          onDone={() => {
            setQuestId(null);
            setTab("city");
          }}
        />
      ) : null}
    </div>
  );
}

function TopBar() {
  const name = useSolaris((state) => state.playerName);
  const district = useSolaris((state) => state.district);
  const sun = useSolaris((state) => state.sun);
  const biomass = useSolaris((state) => state.biomass);
  const built = useSolaris((state) => state.built);
  const donated = useSolaris((state) => state.donated);
  const stage = cityStage(built.length, campusOpen(donated));

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur-sm md:px-8">
      <div className="min-w-0">
        <p className="truncate font-display text-2xl leading-none md:hidden">Solaris</p>
        <p className="truncate text-sm text-muted">
          {name} · {district} · {STAGE_NAMES[stage]}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-sm tabular-nums">
        <span className="inline-flex items-center gap-1" title="Энергия">
          <Sun className="size-4 text-accent" aria-hidden="true" />
          <span className="sr-only">Энергия</span>
          {sun}
        </span>
        <span className="inline-flex items-center gap-1" title="Биомасса">
          <Leaf className="size-4 text-leaf" aria-hidden="true" />
          <span className="sr-only">Биомасса</span>
          {biomass}
        </span>
      </div>
    </header>
  );
}

function NavButton({
  item,
  active,
  onClick,
  stacked = false,
}: {
  item: (typeof tabs)[number];
  active: boolean;
  onClick: () => void;
  stacked?: boolean;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md text-sm transition-colors duration-150",
        stacked ? "h-14 flex-1 flex-col justify-center gap-1 text-xs" : "h-11 px-3",
        active ? "text-accent" : "text-muted hover:text-fg",
      )}
    >
      <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
      {item.label}
    </button>
  );
}
