import re
import json

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

sets = [
    # Set 1
    [
        ("1 ต้นไม้.png", "10 คำถามต้นไม้.png"),
        ("2 โดนัท.png", "11 คำถามโดนัท.png"),
        ("3 เรือใบ.png", "12 คำถามเรือใบ.png"),
        ("4 แก้วกาแฟ.png", "13 คำถามแก้วกาแฟ.png"),
        ("5 รถสีน้ำเงิน.png", "14 คำถามรถสีน้ำเงิน.png"),
        ("6 เมฆฝน.png", "15 คำถามเมฆฝน.png"),
        ("7 แมวน้ำ.png", "16 คำถามแมวน้ำ.png"),
        ("8 ร่มสีรุ้ง.png", "17 คำถามร่มสีรุ้ง.png"),
        ("9 ถุงเท้า.png", "18 คำถามถุงเท้า.png"),
    ],
    # Set 2
    [
        ("1 รถแดง.png", "10 คำถามรถแดง.png"),
        ("2 หมวกแก็ป.png", "11 คำถามหมวกแก็ป.png"),
        ("3 ชิงช้าสวรรค์.png", "12 คำถามชิงช้าสวรรค์.png"),
        ("4 เสื้อกันฝน.png", "13 คำถามเสื้อกันฝน.png"),
        ("5 เมฆกับแดด.png", "14 คำถามเมฆกับแดด.png"),
        ("6 เห็ด.png", "15 คำถามเห็ด.png"),
        ("7 บ้านดิน.png", "16 คำถามบ้านดิน.png"),
        ("8 แมวลายสลิด.png", "17 คำถามแมวลายสลิด.png"),
        ("9 ไข่ต้ม.png", "18 คำถามไข่ต้ม.png"),
    ],
    # Set 3
    [
        ("1 เนย.png", "10 คำถามเนย.png"),
        ("2 ดอกทิวลิป.png", "11 คำถามดอกทิวลิป.png"),
        ("3 เค้กบลูเบอร์รี่.png", "12 คำถามเค้กบลูเบอร์รี่.png"),
        ("4 อูคูเลเล่.png", "13 คำถามอูคูเลเล่.png"),
        ("5 เต่าปาร์ตี้.png", "14 คำถามเต่าปาร์ตี้.png"),
        ("6 กรรไกร.png", "15 คำถามกรรไกร.png"),
        ("7 ยางลบ.png", "16 คำถามยางลบ.png"),
        ("8 ดาวเสาร์.png", "17 คำถามดาวเสาร์.png"),
        ("9 มงกุฎ.png", "18 คำถามมงกุฎ.png"),
    ]
]

folder_names = ["ภาพ XO ชุดที่ 1", "ภาพ XO ชุดที่ 2", "ภาพ XO ชุดที่ 3"]

def replacer(match):
    global idx
    set_idx = idx // 9
    if set_idx >= 3:
        set_idx = 0 # for DEFAULT_BASE_CARDS
    
    item_idx = idx % 9
    
    folder = folder_names[set_idx]
    front, question = sets[set_idx][item_idx]
    
    indent1 = match.group(1)
    quote1 = match.group(2)
    space1 = match.group(3)
    
    indent2 = match.group(4)
    quote2 = match.group(5)
    space2 = match.group(6)
    
    res = f'{indent1}{quote1}frontCustomImg{quote1}:{space1}"image/{folder}/{front}",\n{indent2}{quote2}questionImg{quote2}:{space2}"image/{folder}/{question}",'
    
    idx += 1
    return res

idx = 0
pattern = r'^([ \t]*)("?)frontCustomImg\2:([ \t]*)"",\n^([ \t]*)("?)questionImg\5:([ \t]*)""(,?)'
content_new = re.sub(pattern, replacer, content, flags=re.MULTILINE)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content_new)

print(f"Replaced {idx} items.")
