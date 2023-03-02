import cv2
import time
import os
import glob
from PIL import Image

def Image_capter():
    # Mở camera
    cap = cv2.VideoCapture(0)

    # Đợi một giây để camera khởi động
    time.sleep(1)
    count = 0
    # Tạo vòng lặp chụp theo thời gian thực
    while True:
        # Đọc ảnh từ camera
        ret, frame = cap.read()
        # Lưu ảnh vào file
        # File_name = 'static/img/CAMERA/image_IMAGE.jpg'
        File_name = 'static/img/CAMERA/image_' + str(int(time.time())) + '.jpg'
        cv2.imwrite(File_name, frame)
        time.sleep(0.1)
        Delete()
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    # Giải phóng camera và đóng cửa sổ hiển thị ảnh
    cap.release()
    cv2.destroyAllWindows()


def Delete():
    folder_path = "static/img/CAMERA/"
    count = 0
    files = os.listdir(folder_path)
    for file_name in files:
        file_path = os.path.join(folder_path, file_name)
        try:
            with Image.open(file_path) as img:
                count += 1
        except:
            pass
    if count > 20:
        os.remove(os.path.join(folder_path, files[0]))
        print("Đã xóa ảnh")
        
    print("Số lượng ảnh trong file là: ", count)

Image_capter()