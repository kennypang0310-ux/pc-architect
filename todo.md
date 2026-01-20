# PC Architect Project TODO

## Core Features
- [x] Fix PSU headroom warning test - Updated power consumption estimates for realistic TDP values
- [x] Implement auto-regeneration service for incompatible components
- [x] Add auto-regeneration endpoint to backend router
- [x] Integrate auto-regeneration into build generation flow on frontend
- [x] Create compatibility checking service
- [x] Write compatibility tests (6/7 passing)
- [x] Test complete auto-regeneration flow end-to-end
- [x] Save checkpoint with all changes

## Build Generation Features
- [x] Mock PC build generation with multiple build types
- [x] Currency and region support
- [x] Compatibility checking
- [x] Price scraping integration with Browse AI
- [ ] Auto-fix incompatible components before showing results

## Compatibility System
- [x] CPU socket matching
- [x] RAM type matching (DDR4 vs DDR5)
- [x] PSU wattage calculation
- [x] Case size compatibility
- [x] CPU cooler socket matching
- [x] Storage interface compatibility
- [x] Power consumption warnings

## User Experience
- [ ] Show regenerated components in build results
- [ ] Display which components were auto-fixed
- [ ] Allow manual override of auto-fixes
