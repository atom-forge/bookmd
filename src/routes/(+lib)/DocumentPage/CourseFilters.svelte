<script lang="ts">
  import { Button } from '@atom-forge/ui';
  import { X } from 'lucide-svelte';
  import { groups, modes, titles, type Group, type Option } from './course-filter';
  let { available, size, ontoggle, onclear }: {
    available: Record<Group, Option[]>; size: number;
    ontoggle: (group: Group, key: string) => void; onclear: () => void;
  } = $props();
  // The colours of the chips on the book cards: language accent, author primary, tag secondary, topic muted.
  const variants: Record<Group, Record<string, true>> = { language: { accent: true }, author: {}, tag: { secondary: true }, topic: { muted: true } };
  const limit = 12;
  let expanded = $state<Partial<Record<Group, boolean>>>({});
  // A long group shows its most used options first; the selected ones stay visible.
  function visible(group: Group, list: Option[]): Option[] {
    if (expanded[group] || list.length <= limit) return list;
    const top = new Set([...list].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'hu')).slice(0, limit).map(option => option.key));
    return list.filter(option => top.has(option.key) || option.selected);
  }
</script>

<div class="flex flex-col" role="group" aria-label="Filters">
  {#each groups.filter(group => available[group].length) as group (group)}
    {@const list = available[group]}
    <section class="mb-5" aria-labelledby="filter-{group}">
      <h3 id="filter-{group}" class="mb-2 text-xs font-semibold tracking-wide text-muted-contrast uppercase">
        {titles[group]} <span class="font-normal normal-case">({modes[group] === 'any' ? 'any of' : 'all of'})</span>
      </h3>
      <div class="flex flex-wrap gap-1">
        {#each visible(group, list) as option (option.key)}
          <Button micro pill outline={!option.selected} {...variants[group]} class="uppercase" disabled={!option.selected && option.count === 0}
            aria-pressed={option.selected} title="{option.count} {option.count === 1 ? 'book' : 'books'}"
            onclick={() => ontoggle(group, option.key)}>
            {option.label}<span class="opacity-60">{option.count}</span>
          </Button>
        {/each}
      </div>
      {#if list.length > limit}
        <div class="mt-2">
          <Button link micro label={expanded[group] ? 'Show fewer' : `Show all ${list.length}`} aria-expanded={!!expanded[group]} onclick={() => (expanded[group] = !expanded[group])}/>
        </div>
      {/if}
    </section>
  {/each}
  {#if size}<div><Button ghost compact icon={X} label="Clear filters ({size})" onclick={onclear}/></div>{/if}
</div>
