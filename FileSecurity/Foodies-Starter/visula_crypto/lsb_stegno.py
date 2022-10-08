from PIL import Image
import numpy as np

def gen_img_Data(data):
        newd = []
        for i in data:
#             print(i)
#             print(ord(i))
            a = format(ord(i), '08b')
            newd.append(a)
        return newd

def mod_Pix(img_pix, data):

    datalist = gen_img_Data(data)
    len_data = len(datalist)
    img_data = iter(img_pix)
    for i in range(len_data):
#         print(i[:3])
        pix = [value for value in img_data.__next__()[:3] + img_data.__next__()[:3] + img_data.__next__()[:3]] 
#         print(pix)
        for j in range(0, 8):
#             print(j)
            # 0 means keep reading;
            if (datalist[i][j]=='0') and (pix[j]% 2 != 0):

                if (pix[j]% 2 != 0):
                    pix[j] -= 1
            # 1 means the message is over.
            elif (datalist[i][j] == '1') and (pix[j] % 2 == 0):
                pix[j] -= 1

        # Eight pixel of every set tells
        # whether to stop ot read further.
        if (i == len_data - 1):
            if (pix[-1] % 2 == 0):
                pix[-1] -= 1
        else:
            if (pix[-1] % 2 != 0):
                pix[-1] -= 1

        pix = tuple(pix)
        print("pix2")
        print(pix)
        yield pix[0:3]
        yield pix[3:6]
        yield pix[6:9]

def encode_enc(new_img, data):
    w = new_img.size[0]
    (x, y) = (0, 0)

    for pixel in mod_Pix(new_img.getdata(), data):
        new_img.putpixel((x, y), pixel)
        if (x == w - 1):
            x = 0
            y += 1
        else:
            x += 1

# Encode image data
def encode_img(data):
    try:
        img = Image.open('img/img.jpg', 'r')
    except:
        img = Image.open('img/img.png', 'r')

    copied_img = img.copy()
    encode_enc(copied_img, data)

    return copied_img

# Decode the data in the image
def decode_img(img_name):
    img = Image.open(img_name, 'r')
#     print(img)

    data = ''
    img_data = iter(img.getdata())
#     print(img_data)

    while (True):
        pixels = [value for value in img_data.__next__()[:3] + img_data.__next__()[:3] + img_data.__next__()[:3]]
        # string of binary data
        binstr = ''

        for i in pixels[:8]:
#             print(i)
#             print(i%2)
#             break
            if (i % 2 == 0):
                binstr += '0'
            else:
                binstr += '1'

        data += chr(int(binstr, 2))
        if (pixels[-1] % 2 != 0):
            return data

