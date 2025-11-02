# Icon placeholders
# Generate actual PNG icons using a tool like:
# - https://realfavicongenerator.net/
# - https://www.pwabuilder.com/imageGenerator
# - Or use ImageMagick/sharp to generate from favicon.svg

# Required sizes for PWA:
# - icon-72.png (72x72)
# - icon-96.png (96x96)
# - icon-128.png (128x128)
# - icon-144.png (144x144)
# - icon-152.png (152x152)
# - icon-192.png (192x192)
# - icon-384.png (384x384)
# - icon-512.png (512x512)

# For now, you can use the favicon.svg as a placeholder
# or generate icons after initial setup.

# Quick command to generate icons (requires ImageMagick):
# for size in 72 96 128 144 152 192 384 512; do
#   convert favicon.svg -resize ${size}x${size} icon-${size}.png
# done
