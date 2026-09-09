#!/usr/bin/env python3
"""
Generate a flowing ASCII-portrait animation ("characters in motion") from a
clean source portrait, with NO stray vertical line. Reproducible in-repo
replacement for the externally-generated portrait-flow.webp.

Usage:
    python3 tools/gen_ascii_flow.py [source.jpg] [out.webp]
Requires: Pillow, and img2webp (libwebp) on PATH.
"""
import sys, os, math, subprocess, tempfile, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC = sys.argv[1] if len(sys.argv) > 1 else "public/portrait.jpg"
OUT = sys.argv[2] if len(sys.argv) > 2 else "public/portrait-flow-gen.webp"

FONT = "/System/Library/Fonts/Menlo.ttc"
SCALE = 2                      # output resolution multiplier
CELL_W, CELL_H = 7, 12         # source-grid cell (px); output cell = *SCALE
N_FRAMES = 24
DURATION = 110                 # ms per frame

# density ramp: light -> dark, mixed glyphs echoing the original look
BANDS = [
    " ",
    ".,'` :;",
    "-~+=\"^",
    "*?icoszL",
    "YUZC%eaJ",
    "O0C8&$#",
    "@8#O0",
]
INK_LIGHT = np.array([232, 150, 190])   # pale pink
INK_DARK  = np.array([150,  18,  92])   # deep magenta
BG = (255, 255, 255)

def main():
    src = Image.open(SRC).convert("RGB")
    W, H = src.size
    cols, rows = W // CELL_W, H // CELL_H
    a = np.asarray(src).astype(np.float32)

    # background luminance from the corners
    lum_all = a.mean(axis=2)
    bg_lum = float(np.median(np.concatenate([
        lum_all[:6, :6].ravel(), lum_all[:6, -6:].ravel(),
        lum_all[-6:, :6].ravel(), lum_all[-6:, -6:].ravel()])))
    # per-cell ink = fraction of pixels noticeably darker than background
    ink = np.zeros((rows, cols), np.float32)
    for r in range(rows):
        for c in range(cols):
            blk = lum_all[r*CELL_H:(r+1)*CELL_H, c*CELL_W:(c+1)*CELL_W]
            cover = float((blk < bg_lum - 22).mean())      # 0..1 how inked
            ink[r, c] = min(1.0, cover * 1.35)             # gentle boost

    ocw, och = CELL_W*SCALE, CELL_H*SCALE
    OW, OH = cols*ocw, rows*och
    font = ImageFont.truetype(FONT, int(och*0.92))

    tmp = tempfile.mkdtemp()
    frame_paths = []
    rng = random.Random(7)
    # stable per-cell random phase so flicker is coherent, not noise
    phase = np.random.RandomState(3).rand(rows, cols) * 2*math.pi

    for f in range(N_FRAMES):
        t = f / N_FRAMES
        img = Image.new("RGB", (OW, OH), BG)
        d = ImageDraw.Draw(img)
        for r in range(rows):
            for c in range(cols):
                base = ink[r, c]
                if base <= 0.015:
                    continue
                # flowing wave travelling downward + per-cell shimmer (gentle,
                # so the portrait stays readable while characters "breathe")
                flow = 0.06*math.sin(2*math.pi*(t + r*0.06 + c*0.015) + phase[r, c])
                dd = float(np.clip(base + flow, 0, 1))
                if dd < 0.03:
                    continue
                band = BANDS[min(len(BANDS)-1, int(dd*(len(BANDS)-1) + 0.5))]
                if band.strip() == "":
                    continue
                # glyph flickers frame-to-frame within its density band
                gi = (hash((r, c, f)) >> 3) % len(band)
                ch = band[gi]
                if ch == " ":
                    continue
                col_rgb = tuple(int(v) for v in (INK_LIGHT*(1-dd) + INK_DARK*dd))
                d.text((c*ocw, r*och - och*0.08), ch, font=font, fill=col_rgb)
        p = os.path.join(tmp, f"f{f:02d}.png")
        img.save(p)
        frame_paths.append(p)
        print(f"frame {f+1}/{N_FRAMES}", end="\r")
    print()

    cmd = ["img2webp", "-loop", "0", "-min_size", "-mixed", "-m", "6"]
    for p in frame_paths:
        cmd += ["-d", str(DURATION), p]
    cmd += ["-o", OUT]
    r = subprocess.run(cmd, capture_output=True, text=True)
    print(r.stderr.strip()[-200:] or r.stdout.strip()[-200:])
    print("size:", os.path.getsize(OUT)//1024, "KB ->", OUT)

if __name__ == "__main__":
    main()
