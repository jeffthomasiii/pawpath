# PawPath image sources

Last reviewed: September 16, 2026

The current premium POC uses remote images served by `images.unsplash.com`. The application does not copy imagery from the original visual mockup.

## Current runtime image references

The active premium styles currently reference these Unsplash image endpoints:

- Home hero / Care Now hero base image: `photo-1617895153857-82fe79adfcd4`
- Home adventure card / Plan hero base image: `photo-1500530855697-b586d89ba3ee`
- Saved Plan hero: `photo-1558788353-f76d92427f16`
- Resources hero: `photo-1534361960057-19889db9621e`

These are loaded remotely from `images.unsplash.com` by `premium-pages.css` and `premium-refinement.css`.

## Credit status

Earlier documentation named photographers for a previous pair of images used by the mockup-first shell. Those names did not describe all of the image URLs used by the later premium multi-page PWA and have therefore been removed from this current-state document rather than carried forward inaccurately.

Before public release beyond the proof of concept, verify the source page, creator attribution, and current license/usage requirements for every retained remote image, then replace the generic in-product `Unsplash` credit with accurate per-image attribution where required or appropriate.

Remote photography also means the hero imagery is not available offline even when the PWA shell itself is cached.