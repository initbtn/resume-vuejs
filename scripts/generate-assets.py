#!/usr/bin/env python3
import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
os.makedirs(PUBLIC_DIR, exist_ok=True)

# Fonts
FONT_BOLD = "/usr/share/fonts/truetype/nanum/NanumSquareB.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/nanum/NanumSquareR.ttf"
FONT_NOTO_BOLD = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill=None, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def generate_og_image():
    width = 1200
    height = 630
    
    # 1. Base Gradient Canvas (#0b1120 -> #1e293b)
    img = Image.new("RGBA", (width, height), (11, 17, 32, 255))
    draw = ImageDraw.Draw(img)
    
    for y in range(height):
        ratio = y / height
        r = int(11 + (30 - 11) * ratio)
        g = int(17 + (41 - 17) * ratio)
        b = int(32 + (59 - 32) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b, 255))
        
    # Subtle ambient glow in top-left & bottom-right
    glow_canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_canvas)
    glow_draw.ellipse([(-100, -100), (500, 500)], fill=(56, 189, 248, 30))
    glow_draw.ellipse([(800, 300), (1300, 800)], fill=(52, 211, 153, 25))
    glow_canvas = glow_canvas.filter(ImageFilter.GaussianBlur(80))
    img = Image.alpha_composite(img, glow_canvas)
    draw = ImageDraw.Draw(img)
    
    # Subtle background grid lines
    grid_color = (255, 255, 255, 12)
    for x in range(0, width, 60):
        draw.line([(x, 0), (x, height)], fill=grid_color, width=1)
    for y in range(0, height, 60):
        draw.line([(0, y), (width, y)], fill=grid_color, width=1)
        
    # Card outer border highlight
    draw.rectangle([(12, 12), (width - 12, height - 12)], outline=(56, 189, 248, 60), width=1)
    
    # 2. Left Content
    # Category Pill
    pill_font = get_font(FONT_BOLD, 15)
    pill_text = "⚡ WEB RESUME & TECH PORTFOLIO"
    pill_x, pill_y = 80, 75
    draw.rounded_rectangle([pill_x, pill_y, pill_x + 280, pill_y + 34], radius=17, fill=(15, 23, 42, 220), outline=(56, 189, 248, 180), width=1)
    draw.text((pill_x + 22, pill_y + 8), pill_text, font=pill_font, fill=(56, 189, 248, 255))
    
    # Name
    name_font = get_font(FONT_BOLD, 56)
    draw.text((80, 135), "남성호", font=name_font, fill=(248, 250, 252, 255))
    
    # Sub-tag next to name
    tag_font = get_font(FONT_REGULAR, 22)
    draw.text((260, 162), "|  4년 차 엔지니어", font=tag_font, fill=(148, 163, 184, 255))
    
    # Title / Position
    title_font = get_font(FONT_BOLD, 32)
    draw.text((80, 215), "Front-end & Full-stack Engineer", font=title_font, fill=(56, 189, 248, 255))
    
    # Bio / Value Proposition
    bio_font = get_font(FONT_REGULAR, 21)
    draw.text((80, 275), "문제를 시스템으로 해결하는 견고한 아키텍처와 TDD 실천", font=bio_font, fill=(203, 213, 225, 255))
    draw.text((80, 310), "Next.js → Vue 3 포팅 · Supabase BaaS · WAS 게이트웨이 보안", font=bio_font, fill=(148, 163, 184, 255))
    
    # Tech Stack Badges
    badges = [
        ("Vue.js 3", (66, 184, 131)),
        ("TypeScript", (49, 120, 198)),
        ("Vite", (189, 52, 254)),
        ("Vitest TDD", (252, 203, 59)),
        ("TailwindCSS", (56, 189, 248)),
        ("Supabase BaaS", (62, 207, 142)),
        ("WAS API Gateway", (244, 63, 94)),
        ("GitHub Actions", (32, 136, 255))
    ]
    
    badge_font = get_font(FONT_BOLD, 16)
    badge_x = 80
    badge_y = 375
    
    for text, dot_color in badges:
        bbox = draw.textbbox((0, 0), text, font=badge_font)
        bw = (bbox[2] - bbox[0]) + 38
        bh = 34
        
        if badge_x + bw > 730:
            badge_x = 80
            badge_y += 44
            
        draw.rounded_rectangle([badge_x, badge_y, badge_x + bw, badge_y + bh], radius=8, fill=(30, 41, 59, 220), outline=(51, 65, 85, 255), width=1)
        # colored dot
        draw.ellipse([badge_x + 12, badge_y + 12, badge_x + 20, badge_y + 20], fill=dot_color)
        draw.text((badge_x + 28, badge_y + 7), text, font=badge_font, fill=(241, 245, 249, 255))
        badge_x += bw + 10
        
    # Footer URL
    url_font = get_font(FONT_REGULAR, 18)
    draw.text((80, 545), "🔗 https://initbtn.github.io/resume-vuejs/", font=url_font, fill=(148, 163, 184, 255))
    
    # 3. Right Profile Image Card
    profile_path = os.path.join(PUBLIC_DIR, "profile-opt.jpg")
    if os.path.exists(profile_path):
        prof_img = Image.open(profile_path).convert("RGBA")
        target_size = 360
        prof_img = ImageOps.fit(prof_img, (target_size, target_size), centering=(0.5, 0.3))
        
        # Rounded mask for avatar
        mask = Image.new("L", (target_size, target_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, target_size, target_size], radius=28, fill=255)
        
        # Frame container
        card_x = 760
        card_y = 120
        
        # Background shadow/glow card
        draw.rounded_rectangle([card_x - 8, card_y - 8, card_x + target_size + 8, card_y + target_size + 8], radius=32, fill=(15, 23, 42, 200), outline=(56, 189, 248, 120), width=2)
        
        img.paste(prof_img, (card_x, card_y), mask)
        
        # Inner border
        draw.rounded_rectangle([card_x, card_y, card_x + target_size, card_y + target_size], radius=28, fill=None, outline=(56, 189, 248, 180), width=2)
        
        # Verified Badge
        badge_box = [card_x + target_size - 130, card_y + target_size - 24, card_x + target_size + 15, card_y + target_size + 16]
        draw.rounded_rectangle(badge_box, radius=12, fill=(15, 23, 42, 240), outline=(52, 211, 153, 200), width=2)
        v_font = get_font(FONT_BOLD, 15)
        draw.text((badge_box[0] + 16, badge_box[1] + 10), "✔ VERIFIED", font=v_font, fill=(52, 211, 153, 255))

    out_path = os.path.join(PUBLIC_DIR, "og-image.png")
    img.save(out_path, "PNG", optimize=True)
    print(f"Generated {out_path} ({width}x{height})")

def generate_icons():
    # Base icon: 512x512
    size = 512
    icon = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(icon)
    
    # Rounded rect background (#0f172a to #1e293b)
    draw.rounded_rectangle([16, 16, size - 16, size - 16], radius=110, fill=(15, 23, 42, 255), outline=(56, 189, 248, 200), width=10)
    
    # Inner border
    draw.rounded_rectangle([36, 36, size - 36, size - 36], radius=90, fill=None, outline=(51, 65, 85, 180), width=4)
    
    # Code Monogram < / >
    # Left bracket <
    draw.line([(180, 180), (105, 256), (180, 332)], fill=(56, 189, 248, 255), width=36)
    draw.ellipse([(180-18, 180-18), (180+18, 180+18)], fill=(56, 189, 248, 255))
    draw.ellipse([(180-18, 332-18), (180+18, 332+18)], fill=(56, 189, 248, 255))
    
    # Slash /
    draw.line([(290, 155), (222, 357)], fill=(52, 211, 153, 255), width=34)
    draw.ellipse([(290-17, 155-17), (290+17, 155+17)], fill=(52, 211, 153, 255))
    draw.ellipse([(222-17, 357-17), (222+17, 357+17)], fill=(52, 211, 153, 255))
    
    # Right bracket >
    draw.line([(332, 180), (407, 256), (332, 332)], fill=(56, 189, 248, 255), width=36)
    draw.ellipse([(332-18, 180-18), (332+18, 180+18)], fill=(56, 189, 248, 255))
    draw.ellipse([(332-18, 332-18), (332+18, 332+18)], fill=(56, 189, 248, 255))
    
    # 1. apple-touch-icon.png (180x180)
    apple_icon = icon.resize((180, 180), Image.Resampling.LANCZOS)
    apple_path = os.path.join(PUBLIC_DIR, "apple-touch-icon.png")
    apple_icon.save(apple_path, "PNG", optimize=True)
    print(f"Generated {apple_path} (180x180)")
    
    # 2. favicon.ico (multi-size 16, 32, 48)
    ico_path = os.path.join(PUBLIC_DIR, "favicon.ico")
    icon.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    print(f"Generated {ico_path} (16, 32, 48 ico)")

if __name__ == "__main__":
    generate_og_image()
    generate_icons()
