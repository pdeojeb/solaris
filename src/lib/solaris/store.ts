import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { buildings, GUILD_BASE, GUILD_GOAL, quests } from "@/lib/solaris/content";

export type LogItem = {
  id: string;
  questId: string;
  title: string;
  co2: number;
  at: number;
};

type SolarisData = {
  welcomed: boolean;
  playerName: string;
  district: string;
  sun: number;
  biomass: number;
  air: number;
  co2: number;
  week: number[];
  dayKey: string;
  built: string[];
  donated: number;
  completedToday: string[];
  log: LogItem[];
  pins: { questId: string; x: number; y: number }[];
};

type Actions = {
  enter: (name: string, district: string) => void;
  ensureToday: () => void;
  completeQuest: (questId: string) => { sun: number; biomass: number; co2: number; title: string } | null;
  build: (id: string) => { ok: true } | { ok: false; reason: string };
  donate: (amount: number) => number;
  newDay: () => void;
  resetProgress: () => void;
};

function todayKey() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function blankWeek() {
  return [0, 0, 0, 0, 0, 0, 0];
}

function fresh(): SolarisData {
  return {
    welcomed: false,
    playerName: "",
    district: "Солнечный Нарын",
    sun: 40,
    biomass: 24,
    air: 71,
    co2: 0,
    week: blankWeek(),
    dayKey: todayKey(),
    built: [],
    donated: 0,
    completedToday: [],
    log: [],
    pins: [],
  };
}

const memoryStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useSolaris = create<SolarisData & Actions>()(
  persist(
    (set, get) => ({
      ...fresh(),
      enter: (name, district) =>
        set({
          welcomed: true,
          playerName: name.trim() || "Гость",
          district: district.trim() || "Солнечный Нарын",
        }),
      ensureToday: () => {
        const key = todayKey();
        const state = get();
        const district =
          state.district === "Солнечный квартал" || state.district === "Росток"
            ? "Солнечный Нарын"
            : state.district;
        if (state.dayKey === key) {
          if (district !== state.district) set({ district });
          return;
        }
        const parts = state.dayKey.split("-").map(Number);
        const then = new Date(parts[0] || 2026, (parts[1] || 1) - 1, parts[2] || 1);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diff = Math.round((today.getTime() - then.getTime()) / 86_400_000);
        const shift = Math.max(1, Math.min(7, Number.isFinite(diff) ? diff : 1));
        const week = [...state.week];
        for (let index = 0; index < shift; index += 1) {
          week.shift();
          week.push(0);
        }
        set({ dayKey: key, completedToday: [], week, ...(district !== state.district ? { district } : {}) });
      },
      completeQuest: (questId) => {
        const quest = quests.find((item) => item.id === questId);
        if (!quest) return null;
        const state = get();
        if (state.completedToday.includes(questId)) return null;
        set({
          sun: state.sun + quest.sun,
          biomass: state.biomass + quest.biomass,
          air: Math.min(98, state.air + 2),
          co2: Math.round((state.co2 + quest.co2) * 10) / 10,
          week: state.week.map((value, index) =>
            index === 6 ? Math.round((value + quest.co2) * 10) / 10 : value,
          ),
          completedToday: [...state.completedToday, questId],
          log: [
            {
              id: `${questId}-${Date.now()}`,
              questId,
              title: quest.title,
              co2: quest.co2,
              at: Date.now(),
            },
            ...state.log,
          ].slice(0, 14),
          pins: state.pins.some((pin) => pin.questId === questId)
            ? state.pins
            : [...state.pins, { questId, x: quest.pin.x, y: quest.pin.y }],
        });
        return { sun: quest.sun, biomass: quest.biomass, co2: quest.co2, title: quest.title };
      },
      build: (id) => {
        const building = buildings.find((item) => item.id === id);
        if (!building) return { ok: false, reason: "Нет такого здания" };
        const state = get();
        if (state.built.includes(id)) return { ok: false, reason: "Уже на участке" };
        if (state.sun < building.sun || state.biomass < building.biomass) {
          return { ok: false, reason: "Не хватает ресурсов" };
        }
        set({
          sun: state.sun - building.sun,
          biomass: state.biomass - building.biomass,
          air: Math.min(98, state.air + building.air),
          built: [...state.built, id],
        });
        return { ok: true };
      },
      donate: (amount) => {
        const state = get();
        const room = Math.max(0, GUILD_GOAL - (GUILD_BASE + state.donated));
        const give = Math.min(Math.max(0, Math.floor(amount)), state.sun, room);
        if (give <= 0) return 0;
        const before = GUILD_BASE + state.donated;
        const opened = before < GUILD_GOAL && before + give >= GUILD_GOAL;
        set({
          sun: state.sun - give,
          donated: state.donated + give,
          air: opened ? Math.min(98, state.air + 6) : state.air,
        });
        return give;
      },
      newDay: () => {
        const state = get();
        set({
          week: [...state.week.slice(1), 0],
          completedToday: [],
          dayKey: todayKey(),
        });
      },
      resetProgress: () => {
        const state = get();
        set({
          ...fresh(),
          welcomed: true,
          playerName: state.playerName,
          district: state.district,
          dayKey: todayKey(),
        });
      },
    }),
    {
      name: "solaris-v1",
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : localStorage)),
      skipHydration: true,
      partialize: (state) => ({
        welcomed: state.welcomed,
        playerName: state.playerName,
        district: state.district,
        sun: state.sun,
        biomass: state.biomass,
        air: state.air,
        co2: state.co2,
        week: state.week,
        dayKey: state.dayKey,
        built: state.built,
        donated: state.donated,
        completedToday: state.completedToday,
        log: state.log,
        pins: state.pins,
      }),
    },
  ),
);

export function campusOpen(donated: number) {
  return GUILD_BASE + donated >= GUILD_GOAL;
}

export function cityStage(built: number, open: boolean) {
  const score = built + (open ? 2 : 0);
  if (score <= 0) return 0;
  if (score === 1) return 1;
  if (score <= 3) return 2;
  return 3;
}
