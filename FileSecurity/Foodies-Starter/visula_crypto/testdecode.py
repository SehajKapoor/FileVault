# -*- coding: utf-8 -*-
"""
Created on Wed Nov 24 15:30:33 2021

@author: INBOTICS
"""
import os
import sys
from PIL import Image
from lsb_stegno import encode_img, decode_img
from n_share import  gen_share, comp_share

img1 = Image.open('img/pic1.png')
img1.save('img/share1.png')

img2 = Image.open('img/pic2.png')
img2.save('img/share2.png')

img1 = 'img/share1.png'
img2 = 'img/share2.png'

comp_share(img1,img2)

print('Decoded message: ' + decode_img('img/compress.png'))