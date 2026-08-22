# GROK button → Ideas popup

Wire the header **GROK** button like this (do not open grok.com raw):

```tsx
const [ideasOpen, setIdeasOpen] = useState(false);

// in the SCAN · CLEAN · GROK cluster:
<PushButton tiny active={ideasOpen} onClick={() => setIdeasOpen(true)}>
  GROK
</PushButton>

{ideasOpen ? (
  <GrokIdeasSheet
    onClose={() => setIdeasOpen(false)}
    onOpenGrok={(prompt) => {
      window.open(
        `https://grok.com?q=${encodeURIComponent(prompt)}`,
        "_blank",
        "noopener,noreferrer",
      );
    }}
  />
) : null}
```

Import:
```tsx
import { GrokIdeasSheet } from "@/components/scanner/grok-ideas";
```

What it does:
- Shows full **build history** (buttons, charts, AVWAP, patterns, alerts)
- **Next ideas** chips — tap to copy + add to your note
- Text box for your own request
- **COPY HISTORY + IDEAS** → paste into any Grok chat to keep building
- **OPEN GROK WITH PROMPT** → launches Grok with the update prompt prefilled
