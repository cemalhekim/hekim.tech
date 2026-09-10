import { formatDate, truncateText } from "@lib/utils"
import type { CollectionEntry } from "astro:content"

type Props = {
  entry: CollectionEntry<"blog"> | CollectionEntry<"projects">
  pill?: boolean
}

export default function ArrowCard({ entry, pill }: Props) {
  return (
    <a href={`/${entry.collection}/${entry.slug}`} class="card group p-4 gap-3 flex items-center h-full">
      <div class="w-full group-hover:text-black group-hover:dark:text-white blend">
        <div class="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-black/50 dark:text-white/50">
          {pill &&
            <span class="text-accent">
              {entry.collection === "blog" ? "note" : "project"}
            </span>
          }
          <span>{formatDate(entry.data.date)}</span>
        </div>
        <div class="font-semibold mt-3 text-black dark:text-white line-clamp-2">
          {entry.data.title}
        </div>

        <div class="text-sm mt-1 line-clamp-2">
          {entry.data.summary}
        </div>
        {"metrics" in entry.data && entry.data.metrics?.[0] &&
          <div class="mt-3 flex items-baseline gap-2">
            <span class="font-bold tabular-nums text-accent">{entry.data.metrics[0].value}</span>
            <span class="font-mono text-[11px] uppercase tracking-wider text-black/50 dark:text-white/50">{entry.data.metrics[0].label}</span>
          </div>
        }
        <ul class="flex flex-wrap mt-3 gap-1">
          {entry.data.tags.map((tag: string) => (
            <li class="chip">
              {truncateText(tag, 20)}
            </li>
          ))}
        </ul>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 stroke-current group-hover:stroke-accent">
        <line x1="5" y1="12" x2="19" y2="12" class="scale-x-0 group-hover:scale-x-100 translate-x-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
        <polyline points="12 5 19 12 12 19" class="translate-x-0 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
      </svg>
    </a>
  )
}
