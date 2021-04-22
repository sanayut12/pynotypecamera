import cv2
import time
import threading
from flask import Response, Flask
import paho.mqtt.client as mqtt 	
import os
from filename import randomfilename
from readfilejson import readfilejson
from time import sleep
config = readfilejson()
# Image frame sent to the Flask object
global video_frame_rgb,video_frame_noir
video_frame_rgb = None
video_frame_noir = None
# Use locks for thread-safe viewing of frames in multiple browsers
global thread_lock 
thread_lock = threading.Lock()

#use message capture from mqtt
global capture ,stop
capture = False
stop = False
# GStreamer Pipeline to access the Raspberry Pi camera
GSTREAMER_PIPELINE_RGB = 'nvarguscamerasrc sensor_id=1 ! video/x-raw(memory:NVMM), width=1280, height=720, format=(string)NV12, framerate=21/1 ! nvvidconv flip-method=0 ! video/x-raw, width=1280, height=720, format=(string)BGRx ! videoconvert ! video/x-raw, format=(string)BGR ! appsink wait-on-eos=false max-buffers=1 drop=True'
GSTREAMER_PIPELINE_NOIR = 'nvarguscamerasrc sensor_id=0 ! video/x-raw(memory:NVMM), width=1280, height=720, format=(string)NV12, framerate=21/1 ! nvvidconv flip-method=0 ! video/x-raw, width=1280, height=720, format=(string)BGRx ! videoconvert ! video/x-raw, format=(string)BGR ! appsink wait-on-eos=false max-buffers=1 drop=True'

app = Flask(__name__)

def on_connect(self, client, userdata, rc):
    print("MQTT Connected.")
    self.subscribe("capture")

def on_message(client, userdata,msg):
    # global video_frame_rgb,video_frame_noir
    name = randomfilename().random()
    global capture ,stop
    capture = False
    stop = False

    message = msg.payload.decode("utf-8", "strict")  # str
    # print(message)
    # print(type(message))
    if message == 'cap':
        cv2.imwrite("image/rgb/"+name,video_frame_rgb)
        cv2.imwrite("image/noir/"+name,video_frame_noir)
        client.publish("button","0")
        sleep(1)
        client.publish("button","1")
    if message == 'stop':
        stop = True
 
    print(message)

def mqtt_client():
    host = config.mqtthost()
    port = config.mqttport()
    print(host)
    print(port)
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(host,port=port)
    client.loop_forever()

def captureFramesRGB():
    print('camera rgb active')
    global video_frame_rgb,capture,stop
    capture = False
    stop = False
    # Video capturing from OpenCV
    video_capture = cv2.VideoCapture(GSTREAMER_PIPELINE_RGB, cv2.CAP_GSTREAMER)
    count = 0
    while True and video_capture.isOpened():
        return_key, frame = video_capture.read()
        video_frame_rgb = frame
        if not return_key:
            break

        if stop:
            break
    print("status rgb :",stop)
    video_capture.release()

def captureFramesNOIR():
    print('camera noir active')
    global video_frame_noir,capture,stop
    capture = False
    stop = False
    # Video capturing from OpenCV
    video_capture = cv2.VideoCapture(GSTREAMER_PIPELINE_NOIR, cv2.CAP_GSTREAMER)
    count = 0
    while True and video_capture.isOpened():
        return_key, frame = video_capture.read()
        video_frame_noir = frame
        if not return_key:
            break
        if stop:
            break
    print("status noir : ",stop)
    video_capture.release()

def encodeFrameRGB():
    while True:        
        return_key, encoded_image = cv2.imencode(".jpg", cv2.resize(video_frame_rgb,(320,180),interpolation = cv2.INTER_AREA))
        # Output image as a byte array
        yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
            bytearray(encoded_image) + b'\r\n')

def encodeFrameNOIR():
    while True:        
        return_key, encoded_image = cv2.imencode(".jpg", cv2.resize(video_frame_noir,(320,180),interpolation = cv2.INTER_AREA))
        # Output image as a byte array
        yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
            bytearray(encoded_image) + b'\r\n')


@app.route("/")
def hello():
    return "<h1>Hello</h1>"


@app.route("/rgb")
def streamFramesRGB():
    return Response(encodeFrameRGB(), mimetype = "multipart/x-mixed-replace; boundary=frame")

@app.route("/noir")
def streamFramesNOIR():
    return Response(encodeFrameNOIR(), mimetype = "multipart/x-mixed-replace; boundary=frame")



if __name__ == '__main__':
    #  # Create a thread and attach the method that captures the image frames, to it
    process_thread_mqtt = threading.Thread(target=mqtt_client)
    process_thread_mqtt.daemon = True
    process_thread_mqtt.start()

    process_thread_cameraRGB = threading.Thread(target=captureFramesRGB)
    process_thread_cameraRGB.daemon = True
    process_thread_cameraRGB.start()

    process_thread_cameraNOIR = threading.Thread(target=captureFramesNOIR)
    process_thread_cameraNOIR.daemon = True
    process_thread_cameraNOIR.start()
    # captureFramesRGB()
    # # start the Flask Web Application
    # # While it can be run on any feasible IP, IP = 0.0.0.0 renders the web app on
    # # the host machine's localhost and is discoverable by other machines on the same network 
    app.run(config.httphost(), port=config.httpport())
    # mqtt_client()