from flask import Flask, render_template, request, session, url_for, redirect, jsonify,send_from_directory,flash
import pymysql
import numpy as np
import pandas as pd
import numpy as np
import os
import cv2
from PIL import Image, ImageDraw, ImageFont
import cv2
import pywt
from PIL import Image
import matplotlib.pyplot as plt
from werkzeug.utils import secure_filename
import sys
from PIL import Image
from lsb_stegno import lsb_encode, lsb_decode
from n_share import generate_shares, compress_shares
import binascii
from Crypto.Cipher import AES
from Crypto import Random
from hashlib import sha256
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP


#import imutils
UPLOAD_FOLDER = 'static/encryption/upload_img'
UPLOAD_FOLDER2 = 'static/decryption/upload_img'
# ALLOWED_EXTENSIONS = {'mp4', 'pdf', 'png', 'jpg', 'jpeg', 'gif','avi','wav','mp3'}
import threading
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['UPLOAD_FOLDER2'] = UPLOAD_FOLDER2
app.secret_key = 'random string'

import threading
import time
outputFrame = None
lock = threading.Lock()


def dbConnection():
    try:
        connection = pymysql.connect(host="localhost", user="root", password="root", database="watermark")
        return connection
    except:
        print("Something went wrong in database Connection")


def dbClose():
    try:
        dbConnection().close()
    except:
        print("Something went wrong in Close DB Connection")

class DWTDCT:
    def __init__(self, name, path, dim=None, mode=8):
        self.name = name
        img = cv2.imread(path, mode)
        # print(img.shape)
        self.img = img
        if (dim == None):
            self.dim = np.shape(self.img)[:2]
            self.dim = self.dim[::-1]
        else:
            self.dim = dim
        if self.dim[0] % 8 != 0:
            self.dim = (self.dim[0] + (self.dim[0] % 8), self.dim[1])
        if self.dim[1] % 8 != 0:
            self.dim = (self.dim[0], self.dim[1] + (self.dim[1] % 8))
        self.img = cv2.resize(self.img, self.dim)
        self.img = np.float32(self.img) / 255
        self.channels = cv2.split(self.img)
        self.coeffs = None

    
#     def display(self):
#         cv2.imshow(self.name, self.img)
#         cv2.waitKey(0)


#     def display_difference(self, referenceImage):
#         if isinstance(referenceImage, DWTDCT):
#             cv2.imshow('Difference', self.img - referenceImage.img)
#             cv2.waitKey(0)
#             return


    def save(self, path):
        img = np.clip(self.img * 255, 0, 255)
        img = np.uint8(img)
        cv2.imwrite(path,  img)
        return

    def calculate_coefficients(self):
        coeffs = []
        for c in self.channels:
            coeffs.append(pywt.dwtn(c, wavelet="haar"))
        self.coeffs = coeffs
        return coeffs


    def apply_dct(self, dwtSet):
        setDict = {'LL': 'aa', 'LH': 'ad', 'HL': 'da', 'HH': 'dd'}
        self.subset = setDict[dwtSet]
        i = 0
        for c in self.coeffs:
            coeffSubset = c[self.subset]
            dctChannel = np.empty(np.shape(coeffSubset))
            for r in range(0, len(dctChannel), 4):
                for p in range(0, len(dctChannel[0]), 4):
                    block = coeffSubset[r:r+4, p:p+4]
                    dctBlock = cv2.dct(block)
                    dctChannel[r:r+4, p:p+4] = dctBlock
            self.coeffs[i][self.subset] = dctChannel
            i += 1
        return self.coeffs


    def invert_dct(self):
        i = 0
        for c in self.coeffs:
            coeffSubset = c[self.subset]
            idctChannel = np.empty(np.shape(coeffSubset))
            for r in range(0, len(idctChannel), 4):
                for p in range(0, len(idctChannel[0]), 4):
                    block = coeffSubset[r:r+4, p:p+4]
                    idctBlock = cv2.idct(block)
                    idctChannel[r:r+4, p:p+4] = idctBlock
            self.coeffs[i][self.subset] = idctChannel
            i += 1

        return self.coeffs


    def embed_watermark(self, dwtSet, watermarkImage):
        self.calculate_coefficients()
        self.apply_dct(dwtSet)
        vectors = list(map(lambda c: np.ravel(c), watermarkImage.channels))
        for v in range(len(self.channels)):
            vectors[v] = np.interp(vectors[v], (0, 1), (0, 0.2))

        for c in range(len(self.channels)):
            i = 0
            coeffSubset = self.coeffs[c][self.subset]
            for r in range(0, len(coeffSubset), 4):
                for p in range(0, len(coeffSubset[0]), 4):
                    if i < len(vectors[c]):
                        dctBlock = coeffSubset[r:r+4, p:p+4]
                        dctBlock[2][2] = vectors[c][i]
                        coeffSubset[r:r+4, p:p+4] = dctBlock
                        i += 1
            self.coeffs[c][self.subset] = coeffSubset
        self.invert_dct()
        reconstructed = self.reconstruct()
        return reconstructed
    

    def reconstruct(self):
        reconstructedImage = []
        for c in range(len(self.channels)):
            reconstructedChannel = pywt.idwtn(self.coeffs[c], wavelet="haar")
            reconstructedImage.append(reconstructedChannel)

        reconstructed = cv2.merge(reconstructedImage)
        self.img = reconstructed
        self.channels = cv2.split(reconstructed)
#         cv2.imshow("Watermarked Image", reconstructed)
#         cv2.waitKey(0)
        return reconstructed

    
    def extract_watermark(self, dwtSet, watermarkSize):
        self.calculate_coefficients()
        self.apply_dct(dwtSet)

        watermark = []

        for c in range(len(self.channels)):
            coeffSubset = self.coeffs[c][self.subset]
            watermarkChannel = []
            i = 0
            for r in range(0, len(coeffSubset), 4):
                for p in range(0, len(coeffSubset[0]), 4):
                    if (i < watermarkSize*watermarkSize):
                        block = coeffSubset[r:r+4, p:p+4]
                        watermarkChannel.append(block[2][2])
                        i += 1
            watermarkChannel = np.interp(watermarkChannel, (0, 0.2), (0, 1))
            watermark.append(watermarkChannel)

        watermark = np.reshape(watermark, (len(self.channels), watermarkSize, watermarkSize,))
        watermark = cv2.merge(watermark)
        # print(type(watermark))
#         cv2.imshow("Extracted Watermark", watermark)
#         cv2.waitKey(0)

        scale_percent = 220 # percent of original size
        width = 350 #int(watermark.shape[1] * scale_percent / 100)
        height = 450 #int(watermark.shape[0] * scale_percent / 100)
        dim = (width, height)

        # resize image
        resized = cv2.resize(watermark, dim, interpolation = cv2.INTER_AREA)
        print(resized)
        import imageio
        imageio.imwrite('static/decryption/final_op/resized.png', resized)

#         cv2.imshow("Resized Extracted image", resized)
#         cv2.waitKey(0)
#         cv2.destroyAllWindows()

        return


@app.route('/index')
def index():
    if 'user' in session:
        username = session.get("user")
        return render_template('index.html',username=username)
    return redirect(url_for('login'))

@app.route('/about')
def about():
    if 'user' in session:
        username = session.get("user")
        return render_template('about.html',username=username)
    return redirect(url_for('login'))

@app.route('/contact')
def con():
    if 'user' in session:
        username = session.get("user")

        return render_template('contact.html',username=username)
    return redirect(url_for('login'))

################################################################################################################################
#                                                       Embeding message and image 
################################################################################################################################
def draw_msg_img(pname,drname,dt,tim,lsname):
    image = Image.open('wat1.jpg')
    draw = ImageDraw.Draw(image)

    font = ImageFont.truetype('font/Caliban-m132.ttf', size=70)
    alldata = pname+"\n"+drname+"\n"+dt+"\n"+tim+"\n"+lsname
    # msg1
    (x, y) = (50, 50)
    color = 'rgb(255, 255, 255)'
    draw.text((x, y), pname, fill=color, font=font)
    # msg2
    (x, y) = (50, 150)
    color = 'rgb(255, 255, 255)'
    draw.text((x, y), drname, fill=color, font=font)
    # msg3
    (x, y) = (50, 220)
    color = 'rgb(255, 255, 255)'
    draw.text((x, y), dt, fill=color, font=font)
    # msg4
    (x, y) = (50, 300)
    color = 'rgb(255, 255, 255)'
    draw.text((x, y), tim, fill=color, font=font)
    # msg5
    (x, y) = (50, 390)
    color = 'rgb(255, 255, 255)'
    draw.text((x, y), lsname, fill=color, font=font)
 
    image.save('static/encryption/use_img/wat2.jpg')
    return

@app.route('/pred', methods=["GET","POST"])
def pred():
    if 'user' in session:
        if request.method=="POST":
            username = session.get("user")

            fl = request.files["file"]
            pname = request.form["pname"]
            drname = request.form["drname"]
            dt = request.form["dt"]
            tim = request.form["tim"]
            lsname = request.form["lsname"]


            print("printing fl,msg1,msg2")
            print(fl,pname,drname,dt,tim,lsname)

            filename = secure_filename(fl.filename)
            print("Printing filename")
            print(filename)
            fl.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            draw_msg_img(pname,drname,dt,tim,lsname)

            baseImage = DWTDCT("base", "static/encryption/upload_img/"+str(filename), (1024, 1024))
            baseImage.save('COVER_image.jpg')

            watermarkImage = DWTDCT("watermark", "static/encryption/use_img/wat2.jpg", (128, 128))
            watermarkImage

            baseImage.embed_watermark('HL', watermarkImage)

            baseImage.save('static/encryption/watermark_img/watermarked_image.jpg')
            
            msg = "Message embeding with watermarked image and ready to download!!"
            pth='static/encryption/watermark_img/watermarked_image.jpg'

            return render_template('op.html',msg=msg, pth=pth,username=username)
        return render_template('pred1.html')
    return redirect(url_for('login'))
################################################################################################################################
#                                                       Extract message and image 
################################################################################################################################
@app.route('/xtract', methods=['GET','POST'])
def xtract():
    if 'user' in session:
        if request.method=='POST': 
            username = session.get("user")
            fl = request.files['file'] #watermarked_image.jpg

            filename = secure_filename(fl.filename)
            print("Printing filename")
            print(filename)
            fl.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            

            reconstructedImage = DWTDCT("watermarked", "static/encryption/upload_img/"+filename)
            # reconstructedImage

            reconstructedImage.extract_watermark('HL', 128)

            reconstructedImage.save('static/encryption/watermark_img/reconstructedImage.jpg')
            
            
            msg = "Image extraction process completed!"
            pth = "static/encryption/watermark_img/reconstructedImage.jpg"
            msg2 = "We decrypt your embeed image please download!"
            pth2 = "static/decryption/final_op/resized.png"
    
            return render_template('op.html',msg=msg, pth=pth,username=username,msg2=msg2,pth2=pth2)
        return render_template('pred2.html')
    return redirect(url_for('login'))

################################################################################################################################
#                                                       Rsa encryption and decryption 
################################################################################################################################
def encrypt(key, filename):
	chunksize = 64*1024
	outputFile = filename.split('.', 1)[0]+"enc.jpg"
	filesize = str(os.path.getsize(filename)).zfill(16)
	IV = Random.new().read(16)

	encryptor = AES.new(key, AES.MODE_CBC, IV)

	with open(filename, 'rb') as infile:#rb means read in binary
		with open(outputFile, 'wb') as outfile:#wb means write in the binary mode
			outfile.write(filesize.encode('utf-8'))
			outfile.write(IV)

			while True:
				chunk = infile.read(chunksize)

				if len(chunk) == 0:
					break
				elif len(chunk)%16 != 0:
					chunk += b' '*(16-(len(chunk)%16))

				outfile.write(encryptor.encrypt(chunk))

def getKey(password):
	hasher = sha256(password.encode('utf-8'))
	return hasher.digest()  
################################################################################################################################
#                                       Visual cryptography encryption and decryption
################################################################################################################################
def visual_encrypt(input_image, share_size):
    image = np.asarray(input_image)
    (row, column, depth) = image.shape
    shares = np.random.randint(0, 256, size=(row, column, depth, share_size))
    shares[:,:,:,-1] = image.copy()
    for i in range(share_size-1):
        shares[:,:,:,-1] = shares[:,:,:,-1] ^ shares[:,:,:,i]
        
    return shares, image
    
def visual_decrypt(shares):
    (row, column, depth, share_size) = shares.shape
    shares_image = shares.copy()
    for i in range(share_size-1):
        shares_image[:,:,:,-1] = shares_image[:,:,:,-1] ^ shares_image[:,:,:,i]

    final_output = shares_image[:,:,:,share_size-1]
    output_image = Image.fromarray(final_output.astype(np.uint8))
    return output_image, final_output
################################################################################################################################
#                                                       Visual cryptography encryption 
################################################################################################################################
@app.route('/visual', methods=["GET","POST"])
def combine():
    if 'user' in session:
        if request.method=="POST":
            username = session.get("user")
            ###### getting image from user and storing it in folder ###############
            fl = request.files["file"]
            msg1 = request.form["msg1"]
            msg2 = request.form["msg2"]
            print("printing fl,msg1,msg2")
            print(fl,msg1,msg2)

            filename = secure_filename(fl.filename)
            print("Printing filename")
            print(filename)
            fl.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            ###### Embeding message and user uploaded image with embed image ###############
            draw_msg_img(msg1,msg2)
            baseImage = DWTDCT("base", "static/encryption/upload_img/"+str(filename), (1024, 1024))
            baseImage.save('COVER_image.jpg')

            watermarkImage = DWTDCT("watermark", "static/encryption/use_img/wat2.jpg", (128, 128))
            watermarkImage

            baseImage.embed_watermark('HL', watermarkImage)
            baseImage.save('static/encryption/watermark_img/watermarked_image.jpg')
            
            ###### Applying visual cryptography on embeed image ###############
            img = Image.open('static/encryption/watermark_img/watermarked_image.jpg')
            img.save('static/encryption/visualcry/images/img.jpg')
            txt=msg1+msg2
            generate_shares(lsb_encode(txt))
            
            ###### Rsa key generation image encryption ###############
            key = RSA.generate(2048)
            with open('static/encryption/keys/'+filename.split('.', 1)[0]+'_private.pem', 'wb' ) as f:
                f.write( key.exportKey( 'PEM' ))

            import random
            password = str(random.randint(1000,9999))
            encrypt(getKey(password), "static/encryption/visualcry/images/pic1.png")

            publicKey = PKCS1_OAEP.new( key )
            secret_message = bytes(password, 'utf-8')
            
            encMessage = publicKey.encrypt( secret_message ) 
            hexilify= binascii.hexlify(encMessage)
            strencry = str(hexilify.decode('UTF-8'))

            file1 = open("static/encryption/keys/enc.txt","w")
            file1.writelines(strencry)
            file1.close()

            msg = "your files are ready to download!"
            pth1 = "../static/encryption/keys/enc.txt"
            pth2 = '../static/encryption/keys/'+filename.split('.', 1)[0]+'_private.pem'
            pth3 = "../static/encryption/visualcry/images/pic1enc.jpg"
            pth4 = "../static/encryption/visualcry/images/pic2.png"
            return render_template('op2.html',msg=msg,pth1=pth1,pth2=pth2,pth3=pth3,pth4=pth4,username=username)
        return render_template('pred3.html')
    return redirect(url_for('login'))
################################################################################################################################
#                                       Visual cryptography Decryption 
################################################################################################################################
def decrypt11(key, filename):
    chunksize = 64*1024
    fl = filename.split('/')
    print("printing file name")
    print(fl[3])
    outputFile = "static/decryption/rsa_dec/"+"dnc"+fl[3]
    print('FILEIS',outputFile)
    with open(filename, 'rb') as infile:
        filesize = int(infile.read(16))
        IV = infile.read(16)

        decryptor= AES.new(key, AES.MODE_CBC, IV)

        with open(outputFile, 'wb') as outfile:
            while True:
                chunk = infile.read(chunksize)

                if len(chunk) == 0:
                    break

                outfile.write(decryptor.decrypt(chunk))

            outfile.truncate(filesize)

@app.route('/visual2', methods=["GET","POST"])
def combine2():
    if 'user' in session:
        if request.method=="POST":
            username = session.get("user")
            ###### getting image from user and storing it in folder ###############
            file1 = request.files["file1"] #Encrypted text file
            file2 = request.files["file2"] #Private key
            file3 = request.files["file3"] #First share
            file4 = request.files["file4"] #Second share
            
            print("printing fl,msg1,msg2")
            print(file1,file2,file3,file4)

            filename1 = secure_filename(file1.filename)
            filename2 = secure_filename(file2.filename)
            filename3 = secure_filename(file3.filename)
            filename4 = secure_filename(file4.filename)
            print("Printing filename")
            print(filename1,filename2,filename3,filename4)
            file1.save(os.path.join(app.config['UPLOAD_FOLDER2'], filename1))
            file2.save(os.path.join(app.config['UPLOAD_FOLDER2'], filename2))
            file3.save(os.path.join(app.config['UPLOAD_FOLDER2'], filename3))
            file4.save(os.path.join(app.config['UPLOAD_FOLDER2'], filename4))

            with open( "static/decryption/upload_img/"+filename2,'r' ) as f:
                key = RSA.importKey( f.read() )

            enc = open("static/decryption/upload_img/"+filename1,"r+")
            enc_txt = enc.read()
            convertedtobyte = bytes(enc_txt, 'utf-8')
            public_crypter =  PKCS1_OAEP.new( key )
            decrypted_data = public_crypter.decrypt( binascii.unhexlify(convertedtobyte) )
            str1 = decrypted_data.decode('UTF-8') 

            print("filename1")
            print(filename1)
            print("filename2")
            print(filename2)
            print("filename3")
            print(filename3)
            print("filename4")
            print(filename4)

            decrypt11(getKey(str(str1)) , "static/decryption/upload_img/"+filename3)

            img1 = Image.open('static/decryption/rsa_dec/dnc'+filename3)
            img1.save('static/decryption/shares/share1.png')

            img2 = Image.open("static/decryption/upload_img/"+filename4)
            img2.save('static/decryption/shares/share2.png')
            compress_shares()
            print('Decoded message: ' + lsb_decode('static/decryption/shares/compress.png'))

            reconstructedImage = DWTDCT("watermarked", "static/decryption/shares/compress.png")
            # reconstructedImage

            reconstructedImage.extract_watermark('HL', 128)

            reconstructedImage.save('static/decryption/final_op/reconstructedImage.jpg')

            pth1 = "../static/decryption/final_op/reconstructedImage.jpg"
            pth2 = "../static/decryption/final_op/resized.png"
            msg = "your files are ready to download!"
            
            return render_template('op3.html',pth1=pth1,pth2=pth2,msg=msg,username=username)
        return render_template('pred4.html')
    return redirect(url_for('login'))
################################################################################################################################
#                                       Logout
################################################################################################################################
@app.route('/logout')
def logout():
    session.pop('user')
    session.pop('userid')
    return redirect(url_for('login'))


@app.route('/', methods=["GET","POST"])
def login():
    msg = ''
    if request.method == "POST":
        try:
            session.pop('user',None)
            username = request.form.get("email")
            password = request.form.get("pass")
            con = dbConnection()
            cursor = con.cursor()
            cursor.execute('SELECT * FROM userdetails WHERE email = %s AND pass = %s', (username, password))
            result = cursor.fetchone()
            if result:
                session['user'] = result[1]
                session['userid'] = result[0]
                return redirect(url_for('index'))
            else:
                return redirect(url_for('login'))
        except:
            print("Exception occured at login")
            return redirect(url_for('login'))
        finally:
            dbClose()
    return render_template('login.html')        

@app.route('/register', methods=["GET","POST"])
def register():
    if request.method == "POST":
        try:
            fname = request.form.get("fname")
            lname = request.form.get("lname")
            email = request.form.get("email")
            password = request.form.get("pass")
            con = dbConnection()
            cursor = con.cursor()
            sql = "INSERT INTO userdetails (fname, lname,email, pass) VALUES (%s, %s, %s, %s)"
            val = (fname, lname,email, password)
            cursor.execute(sql, val)
            con.commit()
            return redirect(url_for('login'))
        except:
            print("Exception occured at login")
            return redirect(url_for('login'))
        finally:
            dbClose()
    return render_template('register.html')


@app.route('/home')
def home():
    if 'user' in session:
        username = session.get("user")
        return render_template('home.html', user=username)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
    # app.run('0.0.0.0')