# PRD: Fix Marquee Selection Conflicts and Selection Visual Feedback

## Introduction

The marquee (box select) feature has two bugs that make it unusable in practice:

1. **Dragging a box triggers the marquee overlay** — when the user clicks and drags on a box to move it, the container-level mouse events also fire, starting a marquee selection rectangle on top of the drag. This happens because Box3D uses Three.js pointer events while the marquee listens on the HTML container via React mouse events — the two event systems don't block each other.

2. **Selected boxes lack clear visual feedback** — after drawing a marquee over boxes, the selection either doesn't apply correctly or the visual indicator (slight opacity change + blue edges) is too subtle to notice. Selected boxes need a more prominent visual treatment.

## Goals

- Prevent marquee from activating when the user clicks on a box
- Ensure box dragging works without interference from the marquee system
- Make selected boxes visually obvious with a stronger highlight/shading effect
- Keep existing single-click and Shift+Click selection behavior working

## User Stories

### US-001: Prevent Marquee from Activating on Box Click/Drag
**Description:** As a user, I want to drag a box without the marquee selection rectangle appearing so that box movement works reliably.

**Acceptance Criteria:**
- [ ] Clicking and dragging on a box moves the box without any marquee rectangle appearing
- [ ] Marquee rectangle only appears when clicking and dragging on empty grid space (not on any box)
- [ ] Add a shared ref/flag (e.g., `pointerCapturedByBox`) that Box3D sets to `true` in its `onPointerDown` handler
- [ ] Container's `handleMarqueeMouseDown` checks this flag and skips marquee initialization if a box captured the pointer
- [ ] The flag resets on pointer up
- [ ] Shift+Click on a box still toggles selection without triggering marquee
- [ ] Single-click on empty space (no drag) still deselects all
- [ ] Typecheck passes (`npm run build`)
- [ ] Verify in browser using dev-browser skill

### US-002: Improve Selected Box Visual Feedback
**Description:** As a user, I want selected boxes to be clearly visually distinct so I can immediately tell which items are selected after using marquee or Shift+Click.

**Acceptance Criteria:**
- [ ] Selected boxes have a visible highlight effect that is obvious at a glance (e.g., brighter/emissive tint, thicker colored outline, or translucent overlay color shift)
- [ ] The selection highlight is clearly different from the unselected state — not just a subtle opacity change
- [ ] Blue selection outline on edges is thicker or more prominent than the default dark edges
- [ ] Selection visual works for all material colors (not lost against blue-ish materials)
- [ ] Multi-selected boxes (via marquee or Shift+Click) all show the same selection highlight
- [ ] Unselected boxes return to their normal appearance immediately
- [ ] Typecheck passes (`npm run build`)
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: Add a `pointerCapturedByBox` ref to the Viewport component, shared with Box3D children via props or context
- FR-2: Box3D's `onPointerDown` sets `pointerCapturedByBox.current = true`; resets to `false` on pointer up
- FR-3: Viewport's `handleMarqueeMouseDown` returns early (does not initialize marquee state) if `pointerCapturedByBox.current` is `true`
- FR-4: Update Box3D's selected visual treatment: use `meshLambertMaterial` with `emissive` property set to a highlight color (e.g., `#3b82f6` at low intensity like 0.15) when selected, or apply a visible color shift
- FR-5: Increase selected edge outline visibility — use a brighter blue and/or slightly scaled-up edge geometry for selected boxes

## Non-Goals

- No changes to the marquee rectangle appearance itself (overlay styling is fine)
- No changes to the hit-detection logic (center-point projection is acceptable for now)
- No changes to grouping, locking, or undo/redo behavior
- No new selection modes (lasso, etc.)

## Technical Considerations

- The core issue is that R3F pointer events (`onPointerDown` on a mesh) and React mouse events (`onMouseDown` on the container div) are separate event systems. `stopPropagation()` on the Three.js pointer event does NOT prevent the container's mouse event from firing.
- The simplest fix is a shared mutable ref (`useRef<boolean>`) passed from Viewport to Box3D. Box3D sets it `true` synchronously in `onPointerDown`, and the container's `onMouseDown` handler checks it. Since pointer events fire before mouse events in the browser event loop, the flag will be set by the time the mouse handler runs.
- For visual feedback, `meshLambertMaterial` supports an `emissive` prop that adds a glow independent of lighting. Setting `emissive="#3b82f6"` with `emissiveIntensity={0.15}` provides a noticeable blue tint without washing out the material color.

## Success Metrics

- Box drag never triggers a marquee rectangle
- Users can immediately identify which boxes are selected after a marquee sweep
- No regression in existing single-select, Shift+Click, or drag behaviors

## Open Questions

- Should the selection highlight use emissive glow, an overlay mesh, or a post-processing outline effect? (Emissive is simplest and recommended for v1)
