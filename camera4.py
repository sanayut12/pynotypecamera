import cv2
import time
import threading
from flask import Response, Flask
import paho.mqtt.client as mqtt
import os

# Image frame sent to the Flask object
global video_frame
video_frame = None

# Use locks for thread-safe viewing of frames in multiple browsers
global thread_lock 
thread_lock = threading.Lock()

#use message capture from mqtt
global capture
capture = False

# GStreamer Pipeline to access the Raspberry Pi camera
GSTREAMER_PIPELINE = 'nvarguscamerasrc sensor_id=0 ! video/x-raw(memory:NVMM), width=1280, height=720, format=(string)NV12, framerate=21/1 ! nvvidconv flip-method=0 ! video/x-raw, width=1280, height=720, format=(string)BGRx ! videoconvert ! video/x-raw, format=(string)BGR ! appsink wait-on-eos=false max-buffers=1 drop=True'

# Create the Flask object for the application
app = Flask(__name__)

def on_connect(self, client, userdata, rc):
    print("MQTT Connected.")
    self.subscribe("capture")

def on_message(client, userdata,msg):
    global capture
    capture = False
    message = msg.payload.decode("utf-8", "strict")  # str
    if message == 'cap':
        capture = True
    print(message)

def mqtt_client():
    host = "192.168.137.1"
    port = 1883
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(host,port=port)
    client.loop_forever()

    

def captureFrames():
    global video_frame,capture
    capture = False
    # Video capturing from OpenCV
    video_capture = cv2.VideoCapture(GSTREAMER_PIPELINE, cv2.CAP_GSTREAMER)

    while True and video_capture.isOpened():
        return_key, frame = video_capture.read()
        video_frame = frame
        if not return_key:
            break
        if capture:
            print("capture Mode")
            list_file = os.listdir("image/ndvi")
            count_file = len(list_file)
            cv2.imwrite("image/ndvi/"+str(count_file)+".jpg",frame)
            capture = False
        
        key = cv2.waitKey(30) & 0xff
        if key == 27:
            break

    video_capture.release()
        
def encodeFrame():
    while True:
        
        return_key, encoded_image = cv2.imencode(".jpg", video_frame)


        # Output image as a byte array
        yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
            bytearray(encoded_image) + b'\r\n')

@app.route("/")
def streamFrames():
    return Response(encodeFrame(), mimetype = "multipart/x-mixed-replace; boundary=frame")

# check to see if this is the main thread of execution
if __name__ == '__main__':

    # Create a thread and attach the method that captures the image frames, to it
    process_thread_mqtt = threading.Thread(target=mqtt_client)
    process_thread = threading.Thread(target=captureFrames)
    process_thread.daemon = True
    process_thread_mqtt.daemon = True
    # Start the thread
    process_thread.start()
    process_thread_mqtt.start()
    # start the Flask Web Application
    # While it can be run on any feasible IP, IP = 0.0.0.0 renders the web app on
    # the host machine's localhost and is discoverable by other machines on the same network 
    app.run("192.168.137.14", port="8004")
