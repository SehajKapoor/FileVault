from PIL import Image, ImageDraw, ImageFont

#Opening Image
img = Image.open(r'COVER_image.jpg') 

#Creating draw object
draw = ImageDraw.Draw(img) 

#Creating text and font object
text = "HolyPython.com"
font = ImageFont.truetype('arial.ttf', 82)

#Positioning Text
textwidth, textheight = draw.textsize(text, font)
width, height = img.size 
x=width/2-textwidth/2
y=height-textheight-300

#Applying text on image via draw object
draw.text((x, y), text, font=font) 

#Saving the new image
img.save(r'cake_watermarked.png')


# import datetime

# date_object = datetime.date.today()
# print(str(date_object))

