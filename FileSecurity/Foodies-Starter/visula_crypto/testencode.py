# -*- coding: utf-8 -*-
"""
Created on Wed Nov 24 15:25:12 2021

@author: INBOTICS
"""
import os
import sys
from PIL import Image
from lsb_stegno import encode_img, decode_img
from n_share import gen_share, comp_share

img = Image.open('wt.jpg')
img.save('img/img.jpg')
txt='hello user!'

gen_share(encode_img(txt))
print("Shares generate successfully!")

