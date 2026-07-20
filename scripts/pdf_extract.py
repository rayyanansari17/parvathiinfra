import fitz
import os

src = "/app/frontend/public/assets/brochure.pdf"
outdir = "/app/frontend/public/assets/brochure"
os.makedirs(outdir, exist_ok=True)

doc = fitz.open(src)
print("pages:", doc.page_count)
zoom = 2.0
mat = fitz.Matrix(zoom, zoom)
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=mat)
    out = os.path.join(outdir, f"page-{i+1:02d}.png")
    pix.save(out)
    print(out, pix.width, "x", pix.height)
