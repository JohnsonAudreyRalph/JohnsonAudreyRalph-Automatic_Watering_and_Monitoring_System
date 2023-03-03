from tkinter import filedialog
from tkinter import *
from PIL import ImageTk, Image
from keras.models import load_model
import numpy as np

root = Tk()
root.geometry('500x400')
root.title('Đánh giá tình trạng cây trồng')
root.configure()
MODEL = load_model('Save_save.hdf5')
CLASS_NAMES = ['Khỏe mạnh', 'Bị bệnh']

Show_Image = Label(root)
label = Label(root, font=('arial', 15, 'bold'))

def open_file():
    try:
        Path = filedialog.askopenfilename(initialdir="New_data", title="Đánh giá tình trạng cây trồng")
        Upload_Image = Image.open(Path)
        print('Đường đẫn là: ', Path)
        Upload_Image.thumbnail(((root.winfo_width()/1.5), (root.winfo_height()/1.5)))
        Images = ImageTk.PhotoImage(Upload_Image)
        Show_Image.configure(image=Images)
        Show_Image.image = Images
        label.config(text="")
        Img = Upload_Image.resize((256, 256))
        Img = np.expand_dims(Img, axis=0)
        predictions = MODEL.predict(Img)
        predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
        print(predicted_class)
        label.configure(foreground='#011638', text='Kết quả: ' + predicted_class)
    except:
        label.configure(foreground='#011638', text='Sự cố!!!!')
        pass

my_button = Button(root, text="Tải ảnh", command=open_file)
my_button.pack(side="bottom", pady=30)
Show_Image.pack(side="bottom")
label.pack(side="bottom")
root.mainloop()