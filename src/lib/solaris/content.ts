export type QuestIconName = "coffee" | "recycle" | "plant" | "market" | "bike" | "qr";

export type Quest = {
  id: string;
  title: string;
  text: string;
  kind: "vision" | "ride" | "code";
  expect?: string;
  sample?: string;
  sun: number;
  biomass: number;
  co2: number;
  icon: QuestIconName;
  pin: { x: number; y: number };
  codes?: string[];
};

export type Building = {
  id: string;
  name: string;
  text: string;
  sun: number;
  biomass: number;
  air: number;
  image: string;
};

export const GUILD_BASE = 410;
export const GUILD_GOAL = 500;

export const neighbors = [
  { name: "Лена", amount: 140 },
  { name: "Артём", amount: 160 },
  { name: "Кафе «Лист»", amount: 110 },
];

export const STAGE_NAMES = ["Росток", "Сад", "Квартал", "Город"] as const;

export const CITY_IMAGES = [
  "/solaris/city-0.jpg",
  "/solaris/city-1.jpg",
  "/solaris/city-2.jpg",
  "/solaris/city-3.jpg",
] as const;

export const buildings: Building[] = [
  {
    id: "reeds",
    name: "Очищающий сад",
    text: "Тростник забирает муть из воды.",
    sun: 60,
    biomass: 70,
    air: 6,
    image: "/solaris/reeds.jpg",
  },
  {
    id: "farm",
    name: "Вертикальная ферма",
    text: "Зелень на каждом ярусе.",
    sun: 80,
    biomass: 40,
    air: 4,
    image: "/solaris/farm.jpg",
  },
  {
    id: "wind",
    name: "Ветряная башня",
    text: "Тихий ротор, укрытый плющом.",
    sun: 90,
    biomass: 24,
    air: 4,
    image: "/solaris/wind.jpg",
  },
  {
    id: "biodome",
    name: "Биодом",
    text: "Витражи, которые держат тепло солнца.",
    sun: 120,
    biomass: 55,
    air: 5,
    image: "/solaris/biodome.jpg",
  },
  {
    id: "gallery",
    name: "Солнечная галерея",
    text: "Навес из световых лепестков.",
    sun: 150,
    biomass: 36,
    air: 3,
    image: "/solaris/gallery.jpg",
  },
];

export const quests: Quest[] = [
  {
    id: "cup",
    title: "Ноль отходов",
    text: "Кофе или вода в свою кружку, а не в одноразовый стакан.",
    kind: "vision",
    expect:
      "многоразовая кружка, термокружка или бутылка для воды. Одноразовый пластиковый стакан не подходит.",
    sample: "/solaris/samples/cup.jpg",
    sun: 50,
    biomass: 12,
    co2: 0.4,
    icon: "coffee",
    pin: { x: 32, y: 46 },
  },
  {
    id: "plant",
    title: "Озеленитель",
    text: "Живое растение дома, на балконе или в городском саду.",
    kind: "vision",
    expect: "живое растение, рассада или дерево. Рисунок, экран и искусственный цветок не подходят.",
    sample: "/solaris/samples/plant.jpg",
    sun: 30,
    biomass: 48,
    co2: 0.8,
    icon: "plant",
    pin: { x: 46, y: 58 },
  },
  {
    id: "recycle",
    title: "Вторая жизнь",
    text: "Одежда, техника или вторсырьё, которое вы несёте в приём.",
    kind: "vision",
    expect:
      "одежда, текстиль, электроника или вторсырьё, собранные для сдачи. Случайный один предмет без контекста сдачи не подходит.",
    sample: "/solaris/samples/clothes.jpg",
    sun: 40,
    biomass: 36,
    co2: 1.2,
    icon: "recycle",
    pin: { x: 72, y: 64 },
  },
  {
    id: "market",
    title: "Местный рынок",
    text: "Овощи, фрукты или хлеб без лишнего пластика.",
    kind: "vision",
    expect:
      "свежие овощи, фрукты, зелень, хлеб или яйца, лучше россыпью или в тканевой сумке. Запаянный пластиковый лоток не подходит.",
    sample: "/solaris/samples/market.jpg",
    sun: 35,
    biomass: 22,
    co2: 0.6,
    icon: "market",
    pin: { x: 58, y: 38 },
  },
  {
    id: "ride",
    title: "Чистый путь",
    text: "Пять километров на велосипеде или самокате вместо машины.",
    kind: "ride",
    sun: 70,
    biomass: 16,
    co2: 1.8,
    icon: "bike",
    pin: { x: 22, y: 32 },
  },
  {
    id: "cafe",
    title: "Точка партнёра",
    text: "Код или QR эко-кафе, пункта приёма или рынка.",
    kind: "code",
    sun: 25,
    biomass: 14,
    co2: 0.3,
    icon: "qr",
    pin: { x: 66, y: 48 },
    codes: ["CAFE-SOLAR", "RECYCLE-HUB", "MARKET-07"],
  },
];

export const communityPins = [
  { id: "leaf", label: "Кафе «Лист»", detail: "кружка", x: 30, y: 44 },
  { id: "dorm", label: "Общежитие", detail: "велосипед", x: 64, y: 27 },
  { id: "botanic", label: "Ботанический", detail: "посадка", x: 47, y: 62 },
  { id: "drop", label: "Пункт приёма", detail: "одежда", x: 78, y: 70 },
];

export const DISTRICT_WEEK = [12.4, 18.1, 15.6, 21.8, 19.2, 24.5, 16.3];

export function questById(id: string) {
  return quests.find((quest) => quest.id === id);
}

export function formatKg(value: number) {
  return value.toLocaleString("ru-RU", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function weekDayLabels() {
  const names = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
  const labels: string[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    labels.push(names[date.getDay()] ?? "");
  }
  return labels;
}
