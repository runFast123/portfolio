# Portfolio Design & Technical Documentation

## 1. Creative Rationale

### Core Philosophy
The portfolio is designed to distinguish itself from typical "Big 4" applications by merging high-performance technical execution with a distinctive visual narrative. The central theme is **"Digital Circuitry & Intelligence,"** symbolizing the bridge between raw engineering (circuits) and high-level problem solving (intelligence).

### Key Elements

*   **Signature Motif (The Circuit):**
    *   **Why:** Represents the flow of data and logic.
    *   **Implementation:** Used in the "Creative Workflow" section as a connecting line between steps, reinforcing the idea of a structured, logical process.
    *   **Visuals:** Gradient lines (#F7931A to #FFD600) and glowing nodes.

*   **Skill Constellation (The Galaxy):**
    *   **Why:** Traditional skill lists are static and boring. A constellation implies interconnection and a vast universe of knowledge.
    *   **Interaction:** Mouse repulsion creates a sense of tactile control over the data.
    *   **Aesthetic:** Subtle, ambient background element that doesn't distract but adds depth.

*   **GitHub Intelligence (The Terminal):**
    *   **Why:** Developers live in the terminal. Showing data in a native CLI format builds immediate rapport with technical recruiters and engineering managers.
    *   **Interaction:** Typing effect simulates real-time data fetching, creating a "live" connection feel.

*   **Custom Micro-Interactions:**
    *   **Cursor:** A custom cursor (dot + lagging outline) adds a layer of polish and fluidity, making the navigation feel app-like rather than web-like.
    *   **Hover States:** "Magnetic" buttons and 3D card tilts demonstrate attention to detail—a critical trait for top-tier engineers.

## 2. Technical Implementation Details

### Technology Stack
*   **Core:** HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript (ES6+).
*   **Icons:** Lucide Icons.
*   **Fonts:** Inter (UI), JetBrains Mono (Code), Space Grotesk (Headings).

### Features & Logic

1.  **Skill Constellation (Canvas API):**
    *   **File:** `script.js` (Class `Particle`)
    *   **Logic:** Uses HTML5 Canvas for high-performance 2D rendering. Particles bounce off walls and draw lines to neighbors within a threshold distance (`dist < 100`).
    *   **Optimization:** The loop breaks early if distance is too great (spatial partitioning optimization is implicit in the visual threshold). `requestAnimationFrame` ensures 60fps.

2.  **GitHub Intelligence (Terminal):**
    *   **File:** `script.js` (`runTerminal`, `typeWriter`)
    *   **Logic:** Simulates async data fetching using `Promise` based delays. The typing effect creates a span for each character with a set interval.
    *   **Accessibility:** Uses `aria-label` (implicit via text content) but primarily visual.

3.  **Creative Workflow (Intersection Observer):**
    *   **File:** `script.js`
    *   **Logic:** `IntersectionObserver` watches `.workflow-step` elements. When they enter the viewport, it triggers the `.active` class on the step and its corresponding `.circuit-node`, animating the connector line.

4.  **Custom Cursor:**
    *   **Logic:** The dot tracks `clientX/Y` instantly. The outline uses `element.animate()` for a smooth trailing effect, which is more performant than updating `top/left` in a loop for the "lag" effect.

### Performance Considerations
*   **Mobile:** The heavy `Canvas` animation and custom cursor are disabled on touch devices (`!('ontouchstart' in window)` check) and hidden via CSS (`md:block`) to save battery and improve scroll performance.
*   **Reduced Motion:** All CSS animations respect `@media (prefers-reduced-motion: reduce)`.

## 3. Maintenance Requirements

### Adding New Projects
1.  Navigate to the `Featured Projects` section in `main.html`.
2.  Duplicate an `.effect-card` block.
3.  Update the image source, title, description, and tags.
4.  No JS updates required (hover effects are automatic).

### Updating GitHub Stats
*   **Current:** Mock data in `script.js` (`mockData` array).
*   **Future Upgrade:** Replace `mockData` with a real `fetch()` call to the GitHub API (`https://api.github.com/users/aman-dubey`).
    *   *Note:* Requires handling rate limits and potential CORS issues (proxy recommended for production).

### Changing Skills
1.  **Orbit:** Update `skillsConfig` array in `script.js`.
2.  **Constellation:** Update `initParticles()` count or add specific nodes if specific placement is desired.

### Troubleshooting
*   **Canvas not showing:** Ensure the parent container has a defined height.
*   **Animations lagging:** Reduce particle count in `script.js` (currently set by `width * height / 15000`).
