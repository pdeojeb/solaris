import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSolaris } from "@/lib/solaris/store";

export function Welcome() {
  const enter = useSolaris((state) => state.enter);
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("Солнечный Нарын");

  return (
    <main className="relative min-h-dvh bg-bg text-fg">
      <img
        src="/solaris/city-3.jpg"
        alt="Соларпанк-город: стеклянные фермы, сады и солнечные навесы на закате"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/80 to-bg/25" />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-end px-5 pb-10">
        <p className="text-sm text-muted">Solaris</p>
        <h1 className="mt-2 max-w-md font-display text-5xl text-fg">Зелёный город из обычных дел</h1>
        <p className="mt-3 max-w-md text-base text-muted">
          Квест в жизни, проверка камерой или маршрутом, энергия на участок. Чем честнее день, тем гуще город.
        </p>
        <form
          className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4"
          onSubmit={(event) => {
            event.preventDefault();
            enter(name, district);
          }}
        >
          <label className="flex flex-col gap-1 text-sm text-muted">
            Как к вам обращаться
            <input
              id="player-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={32}
              autoComplete="nickname"
              placeholder="Айя"
              className="h-11 rounded-md border border-line bg-bg px-3 text-fg outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-muted">
            Район или вуз
            <input
              id="district"
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              maxLength={42}
              className="h-11 rounded-md border border-line bg-bg px-3 text-fg outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
          <Button type="submit" className="mt-1 w-full">
            Открыть город
          </Button>
        </form>
      </div>
    </main>
  );
}
