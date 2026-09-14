<div align="center">

# ⚡ freedom

### **Your Day Runs Itself.**

An automatic execution engine built for high-agency builders.  
Plan once, press start, and let your day run itself.

[![100% Free](https://img.shields.io/badge/pricing-100%25%20free-1FAE6B?style=for-the-badge)](https://freedom-mac.vercel.app/download)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20(Soon)-2F6FED?style=for-the-badge)](https://freedom-mac.vercel.app/download)
[![License: MIT](https://img.shields.io/badge/license-MIT-black?style=for-the-badge)](LICENSE)

</div>

---

```
   █▀▀ █▀█ █▀▀ █▀▄ █▀█ █▀▄▀█
   █▀  █▀▄ ██▄ █▄▀ █▄█ █░▀░█
```

Most productivity tools force you to micro-manage them. You end up spending more time organizing tasks than actually executing deep work. 

**Freedom** changes that. It takes your planned schedule, task queue, and break intervals, turning them into a calm, floating execution engine on your Mac that removes decision fatigue and protects your focus rhythm.

---

## ✨ Features

- 💊 **Floating Pill Capsule Widget** — Stays pinned on top of all virtual desktops and full-screen windows. Single-click to view current task; double-click to expand full control dashboard; drag anywhere.
- ⚡ **Auto-Start Execution Engine** — Set your day's tasks with estimated durations. Press **Start Day** and let Freedom automatically progress through your queue.
- 📊 **Productivity Heatmaps & Stats** — Track your daily focus output, target completion accuracy, and global leaderboard ranking.
- 🛡️ **Distraction Shield & Ambient Audio** — Built-in ambient audio player featuring custom tracks to keep you in flow state.
- 💻 **Cross-Window Multi-Monitor Support** — Full macOS Sonoma & Sequoia compatibility across spaces and displays.

---

## 📥 Download & Quick Start

### 1. Download
Get the latest build for macOS (Apple Silicon / Intel):
👉 **[Download Freedom for Mac](https://freedom-mac.vercel.app/download)** or from [GitHub Releases](https://github.com/timothy-okoduwa/freedom/releases).

### 2. macOS Installation Fix ("App is Damaged" / Unidentified Developer)
Because Freedom is an open-source build without a paid Apple Developer certificate, macOS Sequoia & Sonoma attach a quarantine attribute to web downloads. 

If macOS says *"Freedom is damaged and cannot be opened"*, run this 5-second fix in **Terminal**:

```bash
xattr -cr /Applications/Freedom.app
```

*(Alternative if permission denied: `sudo xattr -rd com.apple.quarantine /Applications/Freedom.app`)*

Then double-click **Freedom.app** in your Applications folder to launch! 🎉

---

## 🛠️ Architecture & Monorepo Structure

Freedom is built with a high-performance TypeScript monorepo powered by Turborepo, Next.js 14, Electron, and TailwindCSS.

```
freedom/
├── apps/
│   ├── desktop/      # Electron desktop app + floating pill capsule widget
│   └── web/          # Next.js 14 landing page, waitlist, & download portal
└── packages/
    ├── ui/           # Shared retro-modern design system & Mac window components
    └── config/       # Shared TypeScript & Tailwind configurations
```

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/timothy-okoduwa/freedom.git
cd freedom

# 2. Install dependencies
pnpm install

# 3. Start development servers
pnpm dev

# 4. Package desktop application (macOS DMG)
pnpm --filter @freedom/desktop build
```

---

## 🤝 Community & Contributing

We welcome contributions from builders, designers, and hackers!  
Feel free to open an issue or submit a pull request on [GitHub](https://github.com/timothy-okoduwa/freedom).

---

## 📜 License

[MIT License](LICENSE) © 2026 Timothy Okoduwa & Freedom Contributors. Built for high-agency builders.
