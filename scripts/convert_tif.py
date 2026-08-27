from PIL import Image
import os
import sys

Image.MAX_IMAGE_PIXELS = None
MAX_SIDE = 3500


def convert_tif(path):
    out = os.path.splitext(path)[0] + ".jpg"
    print("Opening", path, "...")
    img = Image.open(path)
    print("  mode", img.mode, "size", img.size)
    if img.mode != "RGB":
        img = img.convert("RGB")
    w, h = img.size
    if max(w, h) > MAX_SIDE:
        scale = MAX_SIDE / max(w, h)
        img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
        print("  resized to", img.size)
    img.save(out, "JPEG", quality=88, optimize=True)
    print("  saved", out, os.path.getsize(out) // 1024, "KB")


def main():
    targets = sys.argv[1:]
    if not targets:
        folder = os.path.join(
            os.path.dirname(__file__),
            "..",
            "public",
            "data",
            "images",
            "toropec_in_xvi_xvii_centures",
            "end",
        )
        targets = [
            os.path.join(folder, name)
            for name in os.listdir(folder)
            if name.lower().endswith((".tif", ".tiff"))
        ]

    for path in targets:
        convert_tif(path)


if __name__ == "__main__":
    main()
