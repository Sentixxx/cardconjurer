# Assets Target Boundary

Target location for future asset ownership after resources are split by access
pattern instead of legacy public path.

Current public assets remain in `resources/` and `src/app/gallery/`. This
directory is not a build input yet.

Planned sub-boundaries:

- `public/` - hot main-site assets.
- `thumbnails/` - frame/gallery thumbnails.
- `frames-hires/` - cold high-resolution frame assets.
- `gallery-hires/` - cold gallery images if gallery gets an asset base.

