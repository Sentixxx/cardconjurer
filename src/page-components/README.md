# Page Components Target Boundary

Target location for static page components that are not Creator runtime code.

Current page components still live under `src/framework/pages/`. This directory
exists to document the destination before any source move happens.

Note: do not create a physical `src/pages/` directory while Next's `app/`
directory remains at the repository root. Next treats `src/pages/` as a Pages
Router root and fails the build when `app/` is not under the same parent.

