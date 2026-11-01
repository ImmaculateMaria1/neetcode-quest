# ⚡ NeetCode Quest

A fun, ADHD-friendly focus dashboard for working through the **NeetCode 150** in **Java**.

**▶ Live:** https://immaculatemaria1.github.io/neetcode-quest/

## Features

### 🎯 Focus
- **One problem at a time.** The focus card shows only the problem you're on. The spinner hides while you work.
- **Six small steps:** read it twice → write 2 examples → say the brute force → find the pattern → code it in Java → test edge cases.
- **Pomodoro timer.** 25/5 cycles with a long break after every 4 (all adjustable), tomato tracking, and a low-pressure "Just 5" starter.
- **Stuck detector.** Counts the time you spend on a problem and gently reminds you at 25 and 45 minutes that peeking is allowed.
- **"I got distracted — I'm back!"** You get XP for coming back. Drifting is normal.
- **Brain dump.** Park stray thoughts with one keypress.
- **Hyperfocus mode.** Hides everything except the problem and the timer.
- **Focus noise.** Built-in brown, pink or white noise (no audio files needed).

### 🃏 Memory cards
After every solve, a Java memory card pops up with:
- the **pattern** (e.g. *Monotonic Stack*)
- the **key insight** in plain English
- a **Java toolkit**: the data structures and methods you'd actually use (`ArrayDeque`, `map.merge`, `PriorityQueue` comparators…)
- **time and space complexity**, plus why
- **your own one-liner** ("The trick was…")
- **your actual NeetCode submission**, if you turn on GitHub detection

### 🧠 Test my memory (spaced repetition)
Solved problems come back for quick reviews after 1 → 3 → 7 → 14 → 30 → 60 days. Each review is one of three quiz types:
- flip-card recall
- "which pattern?" multiple choice
- "what's the time complexity?" multiple choice

Remember it and the gap grows. Forget it and it comes back tomorrow.

### 🔄 NeetCode auto-detect (optional, off by default)
The dashboard does **not** read your NeetCode or GitHub progress unless you turn it on. To turn it on, open ⚙️ Settings and enter the public repo that NeetCode's GitHub Sync pushes to. New submissions will then be marked solved and show their memory card automatically.

### 🏆 Motivation that lasts
- XP, levels, a daily goal and 18 badges
- **Streak freezes.** One missed day won't wipe your streak, and you earn a freeze every 7-day streak.
- Solves, review sessions and Pomodoros all count toward your streak.
- **Daily quest** for +30 XP, with a different one each day
- **Mystery box** every 3 solves: bonus XP, a streak freeze, or a Java tip

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Space` | Start / pause timer |
| `D` | I drifted (and I'm back) |
| `B` | Brain dump |
| `Esc` | Close popup / exit hyperfocus |
| `F` | Flip card (review) |
| `1` `2` `3` `4` | Grade a card / pick an answer (review) |
| `Enter` | Next question (review) |

## Files

- `index.html`: layout and styles
- `app.js`: all the logic
- `cards.js`: Java memory cards for all 150 problems, plus Java tips

There's no build step and no dependencies. Open `index.html` in a browser or use the live link.

## Your data

Progress is stored in your browser's `localStorage`. Solved problems can be re-synced from your NeetCode repo at any time. To keep everything else (XP, notes, reviews), use **Wins → Copy backup code** and **Restore from code**.
