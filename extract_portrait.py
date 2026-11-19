"""
Pure-Python + ImageMagick foreground cutout extractor for Arekatika Thanush Lal's
studio portrait (black shirt on uniform #B2B2B2 grey studio backdrop).
Crops cleanly inside the studio photo frame and removes the uniform grey backdrop
while preserving 100% of the subject's original pixels, hair detail, face, watch,
and black shirt.
"""
from collections import deque
from pathlib import Path
import subprocess


def extract_portrait(src_path: str, out_path: str, preview_path: str | None = None) -> None:
    # Crop inside the studio photo bounds of the 738x1600 upload (y: 304..1130 -> height 826)
    # Preserves head, hair, face, black button-down shirt, silver watch, and crossed arms.
    crop_x, crop_y, w, h = 4, 304, 730, 826

    raw = subprocess.check_output([
        "convert",
        src_path,
        "-crop", f"{w}x{h}+{crop_x}+{crop_y}",
        "+repage",
        "-depth", "8",
        "rgb:-",
    ])

    expected = w * h * 3
    if len(raw) != expected:
        raise RuntimeError(f"Unexpected RGB buffer size: {len(raw)} vs {expected}")

    def is_studio_backdrop(x: int, y: int) -> bool:
        idx = (y * w + x) * 3
        r, g, b = raw[idx], raw[idx + 1], raw[idx + 2]
        sat = max(r, g, b) - min(r, g, b)
        # Uniform neutral studio grey is ~(178, 178, 178) with slight JPEG compression edge variation
        if sat <= 16 and 142 <= r <= 205 and 142 <= g <= 205 and 142 <= b <= 205:
            return True
        return False

    # Flood-fill strictly from outer edges so interior highlights (teeth, watch, buttons) are untouched
    bg = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def seed(x: int, y: int) -> None:
        pos = y * w + x
        if not bg[pos] and is_studio_backdrop(x, y):
            bg[pos] = 1
            q.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, 1)
    for y in range(h):
        seed(0, y)
        seed(1, y)
        seed(w - 1, y)
        seed(w - 2, y)

    # Bottom left and right corners outside torso
    for y in range(h - 30, h):
        for x in range(0, 140):
            seed(x, y)
        for x in range(w - 140, w):
            seed(x, y)

    while q:
        cx, cy = q.popleft()
        for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
            if 0 <= nx < w and 0 <= ny < h:
                npos = ny * w + nx
                if not bg[npos] and is_studio_backdrop(nx, ny):
                    bg[npos] = 1
                    q.append((nx, ny))

    # Keep only the main connected foreground component (subject center x=365, y=450)
    main_fg = bytearray(w * h)
    mq: deque[tuple[int, int]] = deque([(365, 450)])
    main_fg[450 * w + 365] = 1
    while mq:
        cx, cy = mq.popleft()
        for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
            if 0 <= nx < w and 0 <= ny < h:
                npos = ny * w + nx
                if not bg[npos] and not main_fg[npos]:
                    main_fg[npos] = 1
                    mq.append((nx, ny))

    alpha = bytearray(w * h)
    for i in range(w * h):
        alpha[i] = 255 if main_fg[i] else 0

    # Smooth bottom-edge fade (last 55px) so torso blends seamlessly into #181818
    fade_h = 55
    for y in range(h - fade_h, h):
        factor = (h - 1 - y) / float(fade_h)
        factor = factor * factor * (3.0 - 2.0 * factor)
        row = y * w
        for x in range(w):
            if alpha[row + x] > 0:
                alpha[row + x] = int(alpha[row + x] * factor)

    tmp_dir = Path(".playwright-cli")
    tmp_dir.mkdir(exist_ok=True)
    mask_pgm = tmp_dir / "portrait_mask_v2.pgm"
    crop_png = tmp_dir / "portrait_crop_v2.png"

    with open(mask_pgm, "wb") as f:
        f.write(f"P5\n{w} {h}\n255\n".encode("ascii"))
        f.write(alpha)

    subprocess.check_call([
        "convert",
        src_path,
        "-crop", f"{w}x{h}+{crop_x}+{crop_y}",
        "+repage",
        str(crop_png),
    ])

    # Erode 1.2px + subtle feather to eliminate any grey edge fringe against #181818
    subprocess.check_call([
        "convert",
        str(crop_png),
        "(",
        str(mask_pgm),
        "-morphology", "Close", "Disk:1.5",
        "-morphology", "Erode", "Disk:1.2",
        "-blur", "0x1.2",
        "-level", "18%,88%",
        ")",
        "-alpha", "off",
        "-compose", "CopyOpacity",
        "-composite",
        "-trim", "+repage",
        out_path,
    ])

    if preview_path:
        subprocess.check_call([
            "convert",
            "-size", "900x900", "xc:#181818",
            out_path,
            "-gravity", "south",
            "-composite",
            preview_path,
        ])


if __name__ == "__main__":
    src = "public/assets/aistudio/WhatsApp_Image_2026-11-19_at_11.10.39_PM_996b1f2a.jpeg"
    out = "public/assets/aistudio/thanush_cutout.png"
    preview = ".playwright-cli/cutout-new-preview.png"
    extract_portrait(src, out, preview)
    print(f"Created {out} and {preview}")
