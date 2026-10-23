# Apple Developer Navigation Library Archive Explorer

A real-time, interactive Next.js web application built with the Apple Design Resources & macOS Human Interface Guidelines standard (`NavigationSplitView` architecture).

## Core Capabilities

- **Real-Time Live Upstream Data**: Fetches and parses 5,219 Apple developer documentation records directly from `https://developer.apple.com/library/archive/navigation/library.json`.
- **Resilient JSON Parser**: Automatically handles and normalizes syntax defects in upstream legacy archive files (e.g. trailing comma at column 433).
- **macOS 3-Column Split View Architecture**:
  - **Column 1 (Sidebar)**: Live sync status, platform distribution counters, resource type breakdown, featured topics, reset filters.
  - **Column 2 (Detail Canvas)**: macOS window chrome, instant multi-attribute search, sort orders, table view, cards grid view, pagination.
  - **Column 3 (Contextual Inspector)**: Full document inspector, direct Apple Archive external links, 13-field Apple tuple mapping explorer, and full formatted JSON viewer with one-click copy.
- **Export Options**: Export filtered views to JSON or CSV format.
- **Design System**: Strict adherence to Apple Human Interface Guidelines and `agent-design-consistency` (System Accent Blue `#007AFF`, optical typography, zero emojis).

## Quickstart

```bash
cd apple-library-web
npm install
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
