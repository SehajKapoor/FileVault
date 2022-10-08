from flask import Flask,request 
import pymysql.cursors
import json 
from flask_cors import CORS
from werkzeug.utils import secure_filename

import numpy as np
import os
import cv2
import pathlib
import binascii
from Crypto.Cipher import AES
from Crypto import Random
from hashlib import sha256
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
import pywt
from PIL import Image, ImageDraw, ImageFont
import random

import PyPDF2
from fpdf import FPDF
from PyPDF4 import PdfFileWriter, PdfFileReader
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
import datetime
import imageio

app = Flask(__name__)

UPLOAD_FOLDER = 'static/files/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
UPLOAD_KEY = 'static/keys/'
app.config['UPLOAD_KEY'] = UPLOAD_KEY

CORS(app)
app.secret_key = 'any random string'

def dbConnection():
    try:
        connection = pymysql.connect(host="localhost", user="root", password="root", database="filesecurity", charset='utf8mb4')
        return connection
    except:
        print("Something went wrong in database Connection")

def dbClose():
    try:
        dbConnection().close()
    except:
        print("Something went wrong in Close DB Connection")

con = dbConnection()
cursor = con.cursor()

"----------------------------------------------------------------------------------------------------"

def encrypt(key, filename,outputfilename,username,watermarktype):
    chunksize = 64*1024    
    if outputfilename.split('.', 1)[1] == 'pdf':
        outputFile = "static/files/"+username+"/"+outputfilename.split('.', 1)[0]+watermarktype+"enc.pdf"
    else: 
        outputFile = "static/files/"+username+"/"+outputfilename.split('.', 1)[0]+watermarktype+"enc.jpg" 
    
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
                
def decrypt(key, filename,outputfilename):
    chunksize = 64*1024
    outputFile = "static/DownloadedFile/"+outputfilename
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
                
def getKey(password):
    hasher = sha256(password.encode('utf-8'))
    return hasher.digest() 

def create_watermark(file_name, content):
    c = canvas.Canvas(file_name, pagesize=(30 * cm, 30 * cm))
    c.translate(50, 400)
    c.setFont("Helvetica", 5)
    c.setFillColorRGB(255, 255, 255)
    c.setFillAlpha(0)
    c.drawString(2 * cm, 0 * cm, content)
    c.save()
    return file_name


def embed_watermark(pdf_file_in, pdf_file_mark, pdf_file_out):
    pdf_input = PyPDF2.PdfFileReader(open(pdf_file_in, 'rb'))
    pdf_watermark = PyPDF2.PdfFileReader(open(pdf_file_mark, 'rb'))
    pdf_output = PyPDF2.PdfFileWriter()
    pageNum = pdf_input.getNumPages()
    for i in range(pageNum):
        page = pdf_input.getPage(i)
        if i == pageNum - 1:
            page.mergePage(pdf_watermark.getPage(0))
            page.compressContentStreams()
        pdf_output.addPage(page)
    pdf_output.write(open(pdf_file_out, 'wb'))
    
def extract_watermark(file_watermarked):
    pdf_input = PyPDF2.PdfFileReader(open(file_watermarked, 'rb'))
    pageNum = pdf_input.getNumPages()
    extractedText = pdf_input.getPage(pageNum - 1).extractText()
    detectwatermark = extractedText.split()[-1]
    print(detectwatermark.split('14')[-1])
    return str(detectwatermark.split('14')[-1])

def draw_msg_img(idof,name):
    image = Image.open('wat1.jpg')
    draw = ImageDraw.Draw(image)

    font = ImageFont.truetype('font/Caliban-m132.ttf', size=70)
    # msg1
    (x, y) = (50, 50)
    color = 'rgb(255, 255, 255)'
    draw.text((x, y), idof, fill=color, font=font)
    # msg2
    (x, y) = (50, 150)
    color = 'rgb(255, 255, 255)'
    draw.text((x, y), name, fill=color, font=font)
 
    image.save('static/wat2.jpg')
    return

def draw_msg_img1(text):
    image = Image.open('wat1.jpg')
    draw = ImageDraw.Draw(image)

    font = ImageFont.truetype('font/Caliban-m132.ttf', size=70)
    # msg1
    (x, y) = (50, 50)
    color = 'rgb(255, 255, 255)'
    draw.text((x, y), text, fill=color, font=font)
 
    image.save('static/DownloadedFile/resized.jpg')
    return

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
        imageio.imwrite('static/DownloadedFile/resized.jpg', resized)

#         cv2.imshow("Resized Extracted image", resized)
#         cv2.waitKey(0)
#         cv2.destroyAllWindows()

        return
    
"----------------------------------------------------------------------------------------------------"  
    
def addVisibleWatermarkedImage(file_name, user,outputfile):
    img = Image.open(file_name) 
    draw = ImageDraw.Draw(img) 

    text = user
    font = ImageFont.truetype('arial.ttf', 40)

    textwidth, textheight = draw.textsize(text, font)
    width, height = img.size 
    x=width/2-textwidth/2
    y=height-textheight-300

    draw.text((x, y), text, font=font) 
    img.save(outputfile) 
    
def addVisibleWatermarkedPDF(text, input_pdf, output_pdf):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size = 15)
    pdf.cell(200, 10, txt = text,
             ln = 1, align = 'C')
    pdf.output("Original.pdf") 
    watermark_instance = PdfFileReader("Original.pdf")
    watermark_page = watermark_instance.getPage(0)
    pdf_reader = PdfFileReader(input_pdf)
    pdf_writer = PdfFileWriter()
    for page in range(pdf_reader.getNumPages()):          
        page = pdf_reader.getPage(page)
        page.mergePage(watermark_page)
        pdf_writer.addPage(page)
  
    with open(output_pdf, 'wb') as out:
        pdf_writer.write(out)

"----------------------------------------------------------------------------------------------------"

@app.route('/userRegister', methods=['GET', 'POST'])
def userRegister():
    if request.method == 'POST':
        data = request.get_json()
        
        username = data.get('username')
        email = data.get('email')
        mobile = data.get('mobile')
        password = data.get('password')
        
        cursor.execute('SELECT * FROM users WHERE username = %s', (username))
        count = cursor.rowcount
        if count == 1:        
            return "fail"
        else:
            sql1 = "INSERT INTO users(username, email, mobile, password) VALUES (%s, %s, %s, %s);"
            val1 = (username, email, mobile, password)
            cursor.execute(sql1,val1)
            con.commit()
            return "success"
    return "fail"

@app.route('/userLogin', methods=['GET', 'POST'])
def userLogin():
    if request.method == 'POST':
        data = request.get_json()
        
        username = data.get('username')
        password = data.get('password')
        
        cursor.execute('SELECT * FROM users WHERE username = %s AND password = %s', (username, password))
        count = cursor.rowcount
        if count == 1:        
            return "success"
        else:
            return "fail"
    return "fail"

@app.route('/uploadFile', methods=['GET', 'POST'])
def uploadFile():
    if request.method == 'POST':
        print("POST")
        f2 = request.files["File"]
        watermarkedtype = request.form['watermarkedtype'] 
        filenamefromuser = request.form['filename'] 
        user = request.form['Username']
        
        # filename_secure = secure_filename(f2.filename)
        
        pathlib.Path(app.config['UPLOAD_FOLDER'], user).mkdir(exist_ok=True)
        f2.save(os.path.join(app.config['UPLOAD_FOLDER'],user, filenamefromuser))   
        
        fileToEmbbed = "static/files/"+user+"/"+filenamefromuser
        
        if filenamefromuser.split('.', 1)[1] != 'pdf': 
            print("I am in ---------------------------------------")
            image = Image.open(fileToEmbbed)
            width, height = image.size
            print(width-100,height-100)
            size = (450, 80)
            crop_image = Image.open("logo.jpg")
            crop_image.thumbnail(size)
            copied_image = image.copy()
            copied_image.paste(crop_image,(width-180,height-110))
            copied_image.save(fileToEmbbed)  
        
        print("-------------------")
        print(fileToEmbbed)
        print(filenamefromuser.split('.', 1)[1])
        print("-------------------")
        
        cursor.execute('SELECT * FROM users WHERE username = %s', (user))
        row2 = cursor.fetchall() 
        
        idforwatermark = row2[0][0]
        print("idforwatermark")
        print(idforwatermark)
        
        if watermarkedtype == 'Visible':
            
            if filenamefromuser.split('.', 1)[1] == 'pdf':
                addVisibleWatermarkedPDF("userid_"+str(idforwatermark)+"_"+user, fileToEmbbed,"static/files/"+user+"/Visible_"+filenamefromuser)
                fileToEncrypt = "static/files/"+user+"/Visible_"+filenamefromuser
            else:                                    
                addVisibleWatermarkedImage(fileToEmbbed, "userid_"+str(idforwatermark)+"_"+user,"static/files/"+user+"/Visible_"+filenamefromuser) 
                fileToEncrypt = "static/files/"+user+"/Visible_"+filenamefromuser               
            
        elif watermarkedtype == 'Invisible':
            
            if filenamefromuser.split('.', 1)[1] == 'pdf':
                file_mark = create_watermark("tmp.pdf","userid_"+str(idforwatermark)+"_"+user)
                embed_watermark(fileToEmbbed, file_mark, "static/files/"+user+"/Invisible_"+filenamefromuser)
                fileToEncrypt = "static/files/"+user+"/Invisible_"+filenamefromuser   
            else:                    
                draw_msg_img("userid_"+str(idforwatermark),user)                 
                
                baseImage = DWTDCT("base", fileToEmbbed, (1024, 1024))
                baseImage.save('COVER_image.jpg')
            
                watermarkImage = DWTDCT("watermark", "static/wat2.jpg", (128, 128))
                
                baseImage.embed_watermark('HL', watermarkImage)            
                baseImage.save("static/files/"+user+"/Invisible_"+filenamefromuser)
                fileToEncrypt = "static/files/"+user+"/Invisible_"+filenamefromuser   
            
        else:          
        
            if filenamefromuser.split('.', 1)[1] == 'pdf':
                addVisibleWatermarkedPDF("userid_"+str(idforwatermark)+"_"+user, fileToEmbbed,"static/visible.pdf")
                file_mark = create_watermark("tmp.pdf","userid_"+str(idforwatermark)+"_"+user)
                embed_watermark("static/visible.pdf", file_mark, "static/files/"+user+"/Both_"+filenamefromuser)
                fileToEncrypt = "static/files/"+user+"/Both_"+filenamefromuser 
            else:                    
                draw_msg_img("userid_"+str(idforwatermark),user)                
                addVisibleWatermarkedImage(fileToEmbbed, "userid_"+str(idforwatermark)+"_"+user,"static/files/"+user+"/Visible_"+filenamefromuser)    
                
                baseImage = DWTDCT("base", fileToEmbbed, (1024, 1024))
                baseImage.save('COVER_image.jpg')
            
                watermarkImage = DWTDCT("watermark", "static/wat2.jpg", (128, 128))
                
                baseImage.embed_watermark('HL', watermarkImage)            
                baseImage.save("static/files/"+user+"/Both_"+filenamefromuser)                
                fileToEncrypt = "static/files/"+user+"/Both_"+filenamefromuser 
        
        key = RSA.generate(2048)
    
        pathlib.Path(app.config['UPLOAD_KEY'], user).mkdir(exist_ok=True)
        with open('static/keys/'+user+'/'+filenamefromuser.split('.', 1)[0]+watermarkedtype+'_private.pem', 'wb' ) as f:
            f.write( key.exportKey( 'PEM' ))
                    
        password = str(random.randint(1000,9999))
        print(password)
        
        if filenamefromuser.split('.', 1)[1] == 'pdf':
            encrypt(getKey(password),fileToEncrypt,filenamefromuser,user,watermarkedtype)
        else: 
            encrypt(getKey(password),fileToEncrypt,filenamefromuser,user,watermarkedtype) 
        
        publicKey = PKCS1_OAEP.new( key )
        secret_message = bytes(password, 'utf-8')
        
        encMessage = publicKey.encrypt( secret_message ) 
        hexilify= binascii.hexlify(encMessage)
        strencry = str(hexilify.decode('UTF-8')) 
        
        date_object = datetime.date.today()
        print(date_object)  
        
        if filenamefromuser.split('.', 1)[1] == 'pdf':
            sql1 = "INSERT INTO uploadedfiles(filename, uploader, privatekey ,encryptedkey,uploaddate,typeofwatermarked,filetoshow) VALUES (%s, %s, %s, %s, %s, %s, %s);"
            val1 = (filenamefromuser, user, filenamefromuser.split('.', 1)[0]+watermarkedtype+'_private.pem',strencry,str(date_object),watermarkedtype,fileToEncrypt)
            cursor.execute(sql1,val1)
            con.commit()
            return "success"
        else: 
            sql1 = "INSERT INTO uploadedfiles(filename, uploader, privatekey ,encryptedkey,uploaddate,typeofwatermarked,filetoshow) VALUES (%s, %s, %s, %s, %s, %s, %s);"
            val1 = (filenamefromuser, user, filenamefromuser.split('.', 1)[0]+watermarkedtype+'_private.pem',strencry,str(date_object),watermarkedtype,fileToEncrypt)
            cursor.execute(sql1,val1)
            con.commit()
            return "success"
        
    return "fail"

@app.route('/loadFiles/<username>', methods=['GET', 'POST'])
def loadFiles(username):
    try:
        print(username)
        
        cursor.execute('SELECT * FROM uploadedfiles WHERE uploader = %s', (username))
        row = cursor.fetchall() 
        
        jsonObj = json.dumps(row) 
        return jsonObj
    except Exception as ex:
        print(ex)                 
        return ""


@app.route('/loadallusers', methods=['GET', 'POST'])
def loadallusers():
    try:
        cursor.execute('SELECT * FROM users')
        row = cursor.fetchall() 
        print(row)
        
        jsonObj = json.dumps(row)         
        return jsonObj
    except Exception as ex:
        print(ex)                 
        return ""
        

@app.route('/shareFile', methods=['GET', 'POST'])
def shareFile():
    if request.method == 'POST':
        data = request.get_json()
        
        fileid = data.get('fileid')
        filename = data.get('filename')
        uploader = data.get('uploader')
        receiverid = data.get('receiver')
        condition = data.get('condition')
        
        try:
            cursor.execute('SELECT * FROM uploadedfiles WHERE id = %s AND filename = %s', (fileid,filename))
            row = cursor.fetchall() 
            
            cursor.execute('SELECT * FROM users WHERE username = %s', (uploader))
            row1 = cursor.fetchall() 
            
            cursor.execute('SELECT * FROM users WHERE id = %s', (receiverid))
            row2 = cursor.fetchall() 
            
            date_object = datetime.date.today()
            print(date_object) 
            
            sql1 = "INSERT INTO sharedFiles(id, filename, uploaderid, uploadername, receiver, privatekey ,encryptedkey,recivedate,typeofwatermarked,filetoshow,conditions) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
            val1 = (fileid,filename,row1[0][0],uploader,row2[0][1],row[0][3],row[0][4],str(date_object),row[0][6],row[0][7],condition)
            cursor.execute(sql1,val1)
            con.commit()
            return "success"
        except: 
            return "fail"
    return "fail"

@app.route('/receiveFiles/<username>', methods=['GET', 'POST'])
def receiveFiles(username):
    try:
        cursor.execute('SELECT * FROM sharedFiles WHERE receiver = %s', (username))
        row = cursor.fetchall() 
        
        jsonObj = json.dumps(row)
        # print(jsonObj)       
        
        return jsonObj
    except Exception as ex:
        print(ex)                 
        return ""
    
@app.route('/downloadFile', methods=['GET', 'POST'])
def downloadFile():
    if request.method == 'POST':
        data = request.get_json()
        
        fileid = data.get('fileid')
        filename = data.get('filename')
        uploader = data.get('uploader')
        status = data.get('status')
        
        print(fileid)
        print(filename)
        print(uploader)
        
        # try:
        cursor.execute('SELECT * FROM sharedFiles WHERE id = %s AND filename = %s AND uploadername = %s', (fileid,filename,uploader))
        row = cursor.fetchall() 
        
        filename = row[0][1]
        uploader = row[0][3]
        prikey = row[0][5]
        encry = row[0][6]
        typeofwatermark = row[0][8]
                
        with open( "static/keys/"+uploader+"/"+prikey,'r' ) as f:
            key = RSA.importKey( f.read() )
        
        str1 = encry 
        convertedtobyte = bytes(str1, 'utf-8')
        public_crypter =  PKCS1_OAEP.new( key )
        decrypted_data = public_crypter.decrypt( binascii.unhexlify(convertedtobyte) )
        print(decrypted_data)
        str1 = decrypted_data.decode('UTF-8') 
        print(str1)         
        
        sql1 = "UPDATE sharedFiles SET status = %s WHERE id = %s AND filename = %s AND uploadername = %s;"
        val1 = (status,fileid,filename,uploader)
        cursor.execute(sql1,val1)
        con.commit()
        
        if typeofwatermark == "Visible":
            if filename.split('.', 1)[1] == 'pdf':
                decrypt(getKey(str(str1)) , "static/files/"+uploader+"/"+filename.split('.', 1)[0]+typeofwatermark+"enc.pdf","Watermaked.pdf")             
                return "visiblepdf"
            else: 
                decrypt(getKey(str(str1)) , "static/files/"+uploader+"/"+filename.split('.', 1)[0]+typeofwatermark+"enc.jpg","Watermaked.jpg")
                return "visibleimage"
            
        elif typeofwatermark == 'Invisible':
            if filename.split('.', 1)[1] == 'pdf':
                decrypt(getKey(str(str1)) , "static/files/"+uploader+"/"+filename.split('.', 1)[0]+typeofwatermark+"enc.pdf","Watermaked.pdf")            
                values = extract_watermark("static/DownloadedFile/Watermaked.pdf")
                draw_msg_img1(values)              
                return "PDF"
            else:  
                decrypt(getKey(str(str1)) , "static/files/"+uploader+"/"+filename.split('.', 1)[0]+typeofwatermark+"enc.jpg","Watermaked.jpg")
                reconstructedImage = DWTDCT("watermarked", "static/DownloadedFile/Watermaked.jpg")
                reconstructedImage.extract_watermark('HL', 128)
                reconstructedImage.save('static/DownloadedFile/reconstructedImage.jpg')
                return "Image"       
        else:       
        
            if filename.split('.', 1)[1] == 'pdf':
                decrypt(getKey(str(str1)) , "static/files/"+uploader+"/"+filename.split('.', 1)[0]+typeofwatermark+"enc.pdf","Watermaked.pdf")            
                values = extract_watermark("static/DownloadedFile/Watermaked.pdf")
                draw_msg_img1(values)              
                return "PDF"
            else: 
                decrypt(getKey(str(str1)) , "static/files/"+uploader+"/"+filename.split('.', 1)[0]+typeofwatermark+"enc.jpg","Watermaked.jpg")
                reconstructedImage = DWTDCT("watermarked", "static/DownloadedFile/Watermaked.jpg")
                reconstructedImage.extract_watermark('HL', 128)
                reconstructedImage.save('static/DownloadedFile/reconstructedImage.jpg')
                return "Image"
                      
        # except: 
        #     return "fail"
    return "fail"

@app.route('/downloadFile1', methods=['GET', 'POST'])
def downloadFile1():
    if request.method == 'POST':
        data = request.get_json()
        
        fileid = data.get('fileid')
        filename = data.get('filename')
        uploader = data.get('uploader')
        
        # try:
        cursor.execute('SELECT * FROM uploadedfiles WHERE id = %s AND filename = %s AND uploader = %s', (fileid,filename,uploader))
        row = cursor.fetchall() 
        
        filename = row[0][1]
        uploader = row[0][2]
        prikey = row[0][3]
        encry = row[0][4]
        typeofwatermark = row[0][6]
                
        with open( "static/keys/"+uploader+"/"+prikey,'r' ) as f:
            key = RSA.importKey( f.read() )
        
        str1 = encry 
        convertedtobyte = bytes(str1, 'utf-8')
        public_crypter =  PKCS1_OAEP.new( key )
        decrypted_data = public_crypter.decrypt( binascii.unhexlify(convertedtobyte) )
        print(decrypted_data)
        str1 = decrypted_data.decode('UTF-8') 
        print(str1)       
        
        if typeofwatermark == "Visible":
            if filename.split('.', 1)[1] == 'pdf':
                decrypt(getKey(str(str1)) , "static/files/"+uploader+"/"+filename.split('.', 1)[0]+typeofwatermark+"enc.pdf","Watermaked.pdf")             
                return "visiblepdf"
            else: 
                decrypt(getKey(str(str1)) , "static/files/"+uploader+"/"+filename.split('.', 1)[0]+typeofwatermark+"enc.jpg","Watermaked.jpg")
                return "visibleimage"
            
        elif typeofwatermark == 'Invisible':
            if filename.split('.', 1)[1] == 'pdf':
                decrypt(getKey(str(str1)) , "static/files/"+uploader+"/"+filename.split('.', 1)[0]+typeofwatermark+"enc.pdf","Watermaked.pdf")            
                values = extract_watermark("static/DownloadedFile/Watermaked.pdf")
                draw_msg_img1(values)              
                return "PDF"
            else:       
                decrypt(getKey(str(str1)) , "static/files/"+uploader+"/"+filename.split('.', 1)[0]+typeofwatermark+"enc.jpg","Watermaked.jpg")
                reconstructedImage = DWTDCT("watermarked", "static/DownloadedFile/Watermaked.jpg")
                reconstructedImage.extract_watermark('HL', 128)
                reconstructedImage.save('static/DownloadedFile/reconstructedImage.jpg')
                return "Image"       
        else:       
        
            if filename.split('.', 1)[1] == 'pdf':
                decrypt(getKey(str(str1)) , "static/files/"+uploader+"/"+filename.split('.', 1)[0]+typeofwatermark+"enc.pdf","Watermaked.pdf")            
                values = extract_watermark("static/DownloadedFile/Watermaked.pdf")
                draw_msg_img1(values)              
                return "PDF"
            else: 
                decrypt(getKey(str(str1)) , "static/files/"+uploader+"/"+filename.split('.', 1)[0]+typeofwatermark+"enc.jpg","Watermaked.jpg")
                reconstructedImage = DWTDCT("watermarked", "static/DownloadedFile/Watermaked.jpg")
                reconstructedImage.extract_watermark('HL', 128)
                reconstructedImage.save('static/DownloadedFile/reconstructedImage.jpg')
                return "Image"
                      
        # except: 
        #     return "fail"
    return "fail"

@app.route('/changeStatus', methods=['GET', 'POST'])
def changeStatus():
    if request.method == 'POST':
        data = request.get_json()
        
        fileid = data.get('fileid')
        filename = data.get('filename')
        uploader = data.get('uploader')
        status = data.get('status')
        
        print(fileid)
        print(filename)
        print(uploader)
        
        sql1 = "UPDATE sharedFiles SET status = %s WHERE id = %s AND filename = %s AND uploadername = %s;"
        val1 = (status,fileid,filename,uploader)
        cursor.execute(sql1,val1)
        con.commit()
        
        return "success"
        
    return "fail"

@app.route('/getAllnotification/<username>', methods=['GET', 'POST'])
def getAllnotification(username):
    try:
        print(username)
        
        cursor.execute('SELECT * FROM sharedFiles WHERE status != %s AND uploadername = %s;', ("None",username))
        row = cursor.fetchall()  
        
        jsonObj = json.dumps(row) 
        return jsonObj
    except Exception as ex:
        print(ex)                 
        return ""
    
@app.route('/ViewVisibleWatermark', methods=['GET', 'POST'])
def ViewVisibleWatermark():
    if request.method == 'POST':
        print("POST")
        f2 = request.files["File"]
        
        # try:        
        filename_secure = secure_filename(f2.filename)
        filetosave="static/invisibleUploaded."+filename_secure.split('.', 1)[1]        
        f2.save(filetosave)
        
        if filename_secure.split('.', 1)[1] == 'pdf':           
            values = extract_watermark(filetosave)
            draw_msg_img1(values)              
            return "PDF"
        else:       
            reconstructedImage = DWTDCT("watermarked", filetosave)
            reconstructedImage.extract_watermark('HL', 128)
            reconstructedImage.save('static/DownloadedFile/reconstructedImage.jpg')
            return "Image" 
        # except:
        #     return "fail"
        

@app.route('/getChartData/<username>', methods=['GET', 'POST'])
def getChartData(username):
    try:
        cursor.execute('SELECT uploaddate FROM uploadedfiles WHERE uploader = %s', (username))
        row1 = cursor.fetchall()         
        
        cursor.execute('SELECT recivedate FROM sharedfiles WHERE uploadername = %s', (username))
        row2 = cursor.fetchall()         
        
        cursor.execute('SELECT recivedate FROM sharedfiles WHERE receiver = %s', (username))
        row3 = cursor.fetchall()
        
        flat_list1 = [item for sublist in row1 for item in sublist]
        flist1=[]
        for i in list(set(flat_list1)):
            flist1.append([str(i),flat_list1.count(i)]) 
        
        flat_list2 = [item for sublist in row2 for item in sublist]
        flist2=[]
        for j in list(set(flat_list2)):
            flist2.append([str(j),flat_list2.count(j)]) 
            
        flat_list3 = [item for sublist in row3 for item in sublist]
        flist3=[]
        for k in list(set(flat_list3)):
            flist3.append([str(k),flat_list3.count(k)]) 
            
        print(flist1)
        print(flist2)
        print(flist3)
        
        jsonObj = json.dumps([flist1,flist2,flist3])
        print(jsonObj)         
        
        return jsonObj
    except Exception as ex:
        print(ex)                 
        return ""
    
if __name__ == "__main__":
    app.run("0.0.0.0")
    
    
