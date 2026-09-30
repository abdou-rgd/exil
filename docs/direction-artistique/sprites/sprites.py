# Sprites pixel-art originaux (16 x 20), décrits en ASCII puis convertis en rectangles SVG.
import sys, os, json

BASE = {'.': None, 'k': '#2a2233', 's': '#f3cfae', 'd': '#d9a583', 'b': '#6b4a36', 'B': '#4d3325',
        'w': '#f6f0e2', 'm': '#b9c2cc', 'n': '#828c9a', 'y': '#e2b04a'}

SPRITES = {
 'voleuse': dict(pal={'h': '#7a4b35', 'c': '#3f7a74', 'v': '#2b5955', 'a': '#ee4159', 'A': '#c22f45'}, rows=[
  "................",
  ".....kkkkkk.....",
  "...kkcccccckk...",
  "..kcccccccccck..",
  "..kcchhhhhhcck..",
  ".kcchhhhhhhhcck.",
  ".kcvhsssssshvck.",
  ".kcvsksssskdvck.",
  ".kcvssssssssvck.",
  "..kvvssddssvvk..",
  "..kaaaaaaaaaak..",
  ".kcAaaaaaaaaAck.",
  ".kccvccccccvcck.",
  "kscccvccccvcccsk",
  "kkcccbbyybbccckk",
  "..kccccccccccck.",
  "..kcvvk..kvvck..",
  "..kcvk....kvck..",
  "..kbbk....kbbk..",
  "..kkkk....kkkk..",
 ]),
 'mage': dict(pal={'h': '#f1ece4', 'g': '#cfc8bd', 'c': '#d9a441', 'v': '#a87a2a', 'a': '#494558',
                   's': '#a9714f', 'd': '#8a573a'}, rows=[
  ".......kk.......",
  "......kcck......",
  ".....kccvck.....",
  "....kcccvcck....",
  "...kaaaaaaaak...",
  "kkkccccccccccckk",
  "kcccccccccccvvck",
  ".kkkhhhhhhhhkkk.",
  "..khhsssssshhk..",
  "..khskssssksgk..",
  "..kgssssssssgk..",
  "..kggssddssggk..",
  "...kccccccccck..",
  "..kccvccccvccck.",
  ".kscccvaavcccsk.",
  ".kkccccaaccccck.",
  "..kccccccccccck.",
  "..kcvcccccccvck.",
  "..kvvvvvvvvvvvk.",
  "..kkkkkkkkkkkkk.",
 ]),
 'pretre': dict(pal={'h': '#b5482f', 'g': '#8c3220', 'c': '#dbe7d3', 'v': '#a9bfa6', 'a': '#5f8f6b'}, rows=[
  "................",
  ".....kkkkkk.....",
  "...kkhhhhhhkk...",
  "..khhhhhhhhhhk..",
  "..khhhhhhhhhgk..",
  ".khhhsssssshhgk.",
  ".khhsssssssshgk.",
  ".khgsksssskdhgk.",
  ".khgssssssssggk.",
  ".kggkssddsskggk.",
  ".kgkaaaaaaaakgk.",
  "..kcaawwwwaack..",
  ".kccvcwyywcvcck.",
  "ksccvccwwccvccsk",
  "kkccvccccccvcckk",
  "..kccvccccvccck.",
  "..kccvccccvccck.",
  "..kcvvccccvvcck.",
  "..kvvvvvvvvvvvk.",
  "..kkkkkkkkkkkkk.",
 ]),
 'guerrier': dict(pal={'h': '#e8cf8a', 'g': '#c4a65c', 'c': '#c9705a', 'v': '#9c4f3f', 'a': '#494558'}, rows=[
  "................",
  ".....kkkkkk.....",
  "....khhhhhhk....",
  "...khhhhhhhhk...",
  "..khhghhhhghhk..",
  "..khgsssssshgk..",
  "..khsksssskdhk..",
  "..kgssssssssgk..",
  "...kdssddssdk...",
  "..kkmmkssskmmkk.",
  ".kmmnmccccmnmmk.",
  ".kmnnccvccccnmk.",
  "ksknccvccccvnksk",
  "kskkccccccccckdk",
  "kkkbbbbyybbbbkkk",
  "..kccvcccccvck..",
  "..kmnmk..kmnmk..",
  "..kmnk....knmk..",
  "..kBBBk..kBBBk..",
  "..kkkkk..kkkkk..",
 ]),
}

def check():
    ok = True
    for name, sp in SPRITES.items():
        pal = dict(BASE); pal.update(sp['pal'])
        if len(sp['rows']) != 20:
            print(name, 'rows =', len(sp['rows'])); ok = False
        for i, r in enumerate(sp['rows']):
            if len(r) != 16:
                print(name, 'row', i, 'len', len(r), repr(r)); ok = False
            for ch in r:
                if ch not in pal:
                    print(name, 'row', i, 'unknown char', ch); ok = False
    return ok

def rects(name, px=1):
    sp = SPRITES[name]; pal = dict(BASE); pal.update(sp['pal'])
    out = []
    for y, r in enumerate(sp['rows']):
        x = 0
        while x < 16:
            ch = r[x]
            if pal[ch] is None:
                x += 1; continue
            x0 = x
            while x < 16 and r[x] == ch:
                x += 1
            out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s"></rect>' % (x0 * px, y * px, (x - x0) * px, px, pal[ch]))
    return out

def svg(name, scale=4, extra=''):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 20" width="%d" height="%d" '
            'shape-rendering="crispEdges" role="img" aria-label="%s"%s>%s</svg>') % (16 * scale, 20 * scale, name, extra, ''.join(rects(name)))

if __name__ == '__main__':
    if not check():
        sys.exit(1)
    d = os.path.dirname(os.path.abspath(__file__))
    html = ['<!doctype html><meta charset="utf-8"><body style="margin:0;background:#60566a;display:flex;gap:24px;padding:24px;align-items:flex-end">']
    for n in SPRITES:
        html.append(svg(n, 8))
        open(os.path.join(d, n + '.svg.txt'), 'w', encoding='utf-8').write(svg(n, 4))
        print(n, len(rects(n)), 'rects')
    for n in SPRITES:
        html.append(svg(n, 3))
    html.append('</body>')
    open(os.path.join(d, 'preview.html'), 'w', encoding='utf-8').write('\n'.join(html))
