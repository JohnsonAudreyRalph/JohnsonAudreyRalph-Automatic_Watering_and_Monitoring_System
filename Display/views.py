from django.shortcuts import render
import os
import glob
import time
from django.core.files.storage import default_storage
from django.conf import settings
from keras.models import load_model
from PIL import Image
import numpy as np
import cv2
# from ..Image_Processing import *

# Create your views here.
def Home(req):
    return render(req, 'Dashobard.html')

MODEL = load_model('Save_save.hdf5')

CLASS_NAMES = ['Bị bệnh', 'Khỏe mạnh']
# CLASS_NAMES = ['Khỏe mạnh', 'Bị bệnh']

def Camera(req):
    folder_path = 'static/img/CAMERA/'
    # Lấy danh sách tất cả các file trong thư mục
    files = glob.glob(os.path.join(folder_path, '*'))
    # Sắp xếp danh sách các file theo thời gian sửa đổi giảm dần
    files.sort(key=os.path.getmtime, reverse=True)
    # Lấy đường dẫn của file cuối cùng trong danh sách
    last_file_path = files[0]
    sentences  = last_file_path.split("\\")
    new = sentences[1]
    tim = new.split("_")[1]
    tim = tim.split(".")[0]
    # print('Kết quả')
    SHOW = folder_path + 'image_' + tim + '.jpg'
    PATH = 'static/img/CAMERA/image_' + tim + '.jpg'
    # print('Đây là PATH: ', PATH)
    # print('Đây là  WEB: ', SHOW)
    image = Image.open(PATH) # Mở hình ảnh ra
    image = image.resize((256, 256))
    Img = np.expand_dims(image, axis=0)
    predictions = MODEL.predict(Img)
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    print('Dự đoán: ', predicted_class)
    # Tình trạng sức khỏe
    img = cv2.imread(PATH)
    img = cv2.resize(img, (450, 450))
    hist_blue = cv2.calcHist([img], [0], None, [256], [0,256])
    hist_green = cv2.calcHist([img], [1], None, [256], [0,256])
    hist_red = cv2.calcHist([img], [2], None, [256], [0,256])
    bin_value_blue = hist_blue[128]
    bin_value_green = hist_green[128]
    bin_value_red = hist_red[128]
    # print('Kết quả của bin_value_blue: ', bin_value_blue)
    # print('Kết quả của bin_value_green: ', bin_value_green)
    # print('Kết quả của bin_value_red: ', bin_value_red)
    if predicted_class == 'Khỏe mạnh':
        KQ = "Cây sống"
    else:
        if bin_value_red < 1000:
            KQ = "Cây yếu hoặc chết"
        else:
            KQ = "Chưa thể xác định thông tin"

    time.sleep(0.1)
    Status = {
        'NEW':new,
        'TIM':tim,
        'predicted_class':predicted_class,
        'KQ':KQ
    }
    return render(req, 'Camera.html', Status)

def Infomation(req):
    return render(req, 'Infomation.html')