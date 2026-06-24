import { PROBLEM } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/** §02 No heading. Brutal prose, left-weighted with empty right zone. */
function emphasize(line: string) {
  const word = PROBLEM.emphasis;
  if (!line.includes(word)) return line;
  const [before, after] = line.split(word);
  return (
    <>
      {before}
      <span className="text-accent">{word}</span>
      {after}
    </>
  );
}

export function Problem() {
  return (
    <section id="problem" className="px-6 py-32 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <div className="max-w-4xl space-y-6">
          {PROBLEM.lines.map((line, i) => (
            <Reveal
              key={i}
              as="p"
              delay={i * 0.12}
              className="font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-4xl"
            >
              {emphasize(line)}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
