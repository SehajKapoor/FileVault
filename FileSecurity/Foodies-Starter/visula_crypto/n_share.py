import numpy as np
from PIL import Image

def gen_share(data, share = 2):
    data = np.array(data, dtype='u1')

    # Generate image of same size
    img1 = np.zeros(data.shape).astype("u1")
    img2 = np.zeros(data.shape).astype("u1")

    # Set random factor
    for i in range(data.shape[0]):
        for j in range(data.shape[1]):
            for k in range(data.shape[2]):
                n = int(np.random.randint(data[i, j, k] + 1))
                img1[i, j, k] = n
                img2[i, j, k] = data[i, j, k] - n

    # Saving shares
    img1 = Image.fromarray(img1)
    img2 = Image.fromarray(img2)

    img1.save("img/pic1.png", "PNG")
    img2.save("img/pic2.png", "PNG")

def comp_share(img1, img2):
    # Read images
    img1 = np.asarray(Image.open(img1))
    img1 = img1.astype('int16')
    img2 = np.asarray(Image.open(img2))
    img2 = img2.astype('int16')

    img = np.zeros(img1.shape)

    # Fit to range
    for i in range(img.shape[0]):
#         print(i)
#         break
        for j in range(img.shape[1]):
#         print(j)
#         break
            for k in range(img.shape[2]):
#             print(k)
#             break
                img[i, j, k] = img1[i, j, k] + img2[i, j, k]

    # Save compressed image
    op_img = img.astype(np.dtype('u1'))

    op_img = Image.fromarray(op_img)
    op_img.save("img/compress.png", "PNG")
