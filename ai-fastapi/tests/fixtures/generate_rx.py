#!/usr/bin/env python3
"""
Generate synthetic test prescription image
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Create prescription image
img = Image.new('RGB', (800, 600), 'white')
draw = ImageDraw.Draw(img)

# Try to use a default font
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
    font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
except:
    font = ImageFont.load_default()
    font_small = ImageFont.load_default()

# Draw prescription content
lines = [
    ("Dr. Sharma Medical Clinic", 50, 50),
    ("123 Hospital Road, City", 50, 85),
    ("", 50, 120),
    ("Patient: Test Patient", 50, 160),
    ("Date: 2024-01-15", 50, 195),
    ("", 50, 230),
    ("Rx:", 50, 270),
    ("1. Paracetamol 500mg", 70, 310),
    ("   1 tablet TID x 5 days", 90, 345),
    ("", 50, 380),
    ("2. Amoxicillin 250mg", 70, 420),
    ("   1 capsule BID x 7 days", 90, 455),
    ("", 50, 490),
    ("Dr. Sharma (MD)", 50, 530),
    ("Reg. No: 12345", 50, 565),
]

for line, x, y in lines:
    if line == "Rx:":
        draw.text((x, y), line, fill='black', font=font)
    elif line.startswith(("1.", "2.")):
        draw.text((x, y), line, fill='black', font=font)
    elif line.startswith("   "):
        draw.text((x, y), line, fill='black', font=font_small)
    else:
        draw.text((x, y), line, fill='black', font=font_small)

output_path = "tests/fixtures/test_prescription.jpg"
img.save(output_path, "JPEG", quality=90)
print(f"Created {output_path}: {img.size[0]}x{img.size[1]}")