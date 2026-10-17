import { Button } from "@/components/ui/button";
import { QuestIcon } from "@/components/solaris/quest-icon";
import { formatKg, quests } from "@/lib/solaris/content";
import { useSolaris } from "@/lib/solaris/store";

export function QuestView({ onOpen }: { onOpen: (id: string) => void }) {
  const done = useSolaris((state) => state.completedToday);

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h2 className="font-display text-3xl">Квесты дня</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Шесть дел. Фото смотрит модель, маршрут отличает велосипед от машины, партнёрский код приходит с точки.
        </p>
      </header>
      <ul className="grid gap-3 lg:grid-cols-2">
        {quests.map((quest) => {
          const finished = done.includes(quest.id);
          return (
            <li key={quest.id} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-line text-fg">
                  <QuestIcon name={quest.icon} className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl">{quest.title}</h3>
                    {finished ? <span className="text-xs text-leaf">Сегодня</span> : null}
                  </div>
                  <p className="mt-1 text-sm text-muted">{quest.text}</p>
                  <p className="mt-3 text-sm tabular-nums text-fg">
                    {quest.sun} энергии · {quest.biomass} биомассы · {formatKg(quest.co2)} кг CO₂
                  </p>
                  <Button className="mt-3" variant={finished ? "quiet" : "primary"} disabled={finished} onClick={() => onOpen(quest.id)}>
                    {finished ? "Зачтено" : "Выполнить"}
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
