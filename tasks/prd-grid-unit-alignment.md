# PRD: Grid Unit System Alignment

## Introduction

The viewport grid currently uses hardcoded 0.5m cell spacing and 1m section spacing regardless of the selected unit system. This means:

- In **feet mode**, a grid cell = ~1.64ft — grid lines don't land on whole-foot boundaries
- In **inches mode**, a grid cell = ~19.69in — completely misaligned with inch increments. For simplicity, inches mode will use the same grid as feet mode (1ft cells).
- In **metric mode**, a grid cell = 50cm — reasonable but doesn't match the 1cm snap increment

Additionally, when a box is placed at position (0,0,0), its bottom-left corner should sit exactly on a grid line intersection. Because the grid cell size doesn't divide evenly into the unit system, boxes appear to float between grid lines rather than snapping to them.

The fix is straightforward: make the grid cell size and section size respond to the active unit system so grid lines land on whole-unit boundaries.

## Goals

- Grid cell spacing reflects the active unit system (1ft for feet and inches, 1cm for metric)
- Grid section (major) lines appear at practical larger intervals (e.g., every 10ft, 10cm)
- A box placed at (0,0,0) has its bottom-left corner sitting exactly on a grid line intersection
- Snap-to-grid increments align with visible grid lines

## User Stories

### US-001: Make Grid Cell Size Match Unit System
**Description:** As a user, I want the grid lines to represent whole units in my chosen system so that I can visually estimate distances and place items precisely.

**Acceptance Criteria:**
- [ ] Grid component receives the current `unitSystem` from project state
- [ ] In **feet** mode: cell size = 0.3048m (1 foot), section size = 3.048m (10 feet)
- [ ] In **inches** mode: same as feet — cell size = 0.3048m (1 foot), section size = 3.048m (10 feet)
- [ ] In **metric** mode: cell size = 0.01m (1 cm), section size = 0.1m (10 cm)
- [ ] Grid lines visually change when the user switches unit system in the toolbar
- [ ] Grid origin remains at (0,0,0) so box positions align with grid intersections
- [ ] A box placed at (0,0,0) has its bottom-left-front corner exactly on a grid line intersection
- [ ] Typecheck passes (`npm run build`)
- [ ] Verify in browser using dev-browser skill

### US-002: Align Snap Increment with Grid
**Description:** As a user, I want snapping to land on visible grid lines so that the snap behavior matches what I see.

**Acceptance Criteria:**
- [ ] Snap increment for **feet** mode = 0.3048m (1 foot) — snaps to each grid line
- [ ] Snap increment for **inches** mode = 0.3048m (1 foot) — snaps to each grid line, same as feet mode
- [ ] Snap increment for **metric** mode = 0.01m (1 cm) — snaps to each grid line
- [ ] Existing snap behavior (dragging boxes) still works correctly with new increments
- [ ] Typecheck passes (`npm run build`)
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: Update the `Grid` component to accept `unitSystem` as a prop
- FR-2: Compute `cellSize` and `sectionSize` based on unit system:
  - Feet: cellSize=0.3048, sectionSize=3.048
  - Inches: same as feet — cellSize=0.3048, sectionSize=3.048
  - Metric: cellSize=0.01, sectionSize=0.1
- FR-3: Pass `unitSystem` from Viewport (which has access to project state) to the Grid component
- FR-4: Update `getSnapIncrement()` in `src/core/units.ts` to return 0.3048 for both feet and inches modes (currently returns 0.0254 for both)
- FR-5: Grid position remains at [0, 0, 0] — no offset needed since drei Grid already centers on its position

## Non-Goals

- No axis labels or measurement markers on grid lines
- No dynamic grid density based on zoom level (can be added later)
- No sub-grid lines (e.g., showing inches within feet mode)
- No changes to the grid fade distance or visual styling beyond spacing

## Technical Considerations

- The `@react-three/drei` Grid component accepts `cellSize` and `sectionSize` as props. Changing these dynamically when the unit system changes is straightforward — React will re-render the Grid with new props.
- Inches mode uses the same grid as feet mode (1ft cells) for simplicity — avoids performance concerns with very fine grid lines.
- The drei Grid `infiniteGrid` mode already handles alignment — grid lines extend from the position prop in multiples of `cellSize`. Since position is [0,0,0] and cellSize divides evenly into box positions, alignment is automatic.
- The snap increment change for feet and inches modes (from 1 inch to 1 foot) is a behavior change. Users previously snapped to inches. This is intentional — snapping to the visible grid is more intuitive.

## Success Metrics

- Grid lines land on whole-unit boundaries for all three unit systems
- A new box placed at (0,0,0) visually sits exactly on grid line intersections
- Switching unit systems instantly updates the grid spacing
- No performance regression when grid is visible

## Open Questions

- None — scope is clear.
