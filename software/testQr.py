import cv2
import json 
import time
import paho.mqtt.client as mqtt 
qrCodeDetector = cv2.QRCodeDetector()
host = '127.0.0.1'
port = 1883
print(host)
print(port)
client = mqtt.Client()
# client.on_connect = on_connect
# client.on_message = on_message
client.connect(host,port=port)
client.publish("camera","HELLO WORLD")
time.sleep(2)
client.publish("camera","HELLO WORLD2")
# client.loop_forever()

# GSTREAMER_PIPELINE_RGB = 'nvarguscamerasrc sensor_id=1 ! video/x-raw(memory:NVMM),width=3820, height=2464, framerate=21/1, format=NV12 ! nvvidconv flip-method=0 ! video/x-raw,width=960, height=616 ! nvvidconv ! nvegltransform ! nveglglessink -e'#! video/x-raw(memory:NVMM), width=1280, height=720, format=(string)NV12, framerate=30/1 ! nvvidconv flip-method=0 ! video/x-raw, width=1280, height=720, format=(string)BGRx ! videoconvert ! video/x-raw, format=(string)BGR ! appsink wait-on-eos=True max-buffers=1 drop=True' #
def gstreamer_pipeline(
    capture_width=3280,
    capture_height=2464,
    display_width=820,
    display_height=616,
    framerate=21,
    flip_method=0,
):
    return (
        "nvarguscamerasrc sensor_id=1 ! "
        "video/x-raw(memory:NVMM), "
        "width=(int)%d, height=(int)%d, "
        "format=(string)NV12, framerate=(fraction)%d/1 ! "
        "nvvidconv flip-method=%d ! "
        "video/x-raw, width=(int)%d, height=(int)%d, format=(string)BGRx ! "
        "videoconvert ! "
        "video/x-raw, format=(string)BGR ! appsink wait-on-eos=True max-buffers=1 drop=True"
        % (
            capture_width,
            capture_height,
            framerate,
            flip_method,
            display_width,
            display_height,
        )
    )
def captureFramesRGB():
    video_capture = cv2.VideoCapture(gstreamer_pipeline(), cv2.CAP_GSTREAMER)

    while True and video_capture.isOpened():
        return_key, frame = video_capture.read()
        # gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        decodedText, points, _ = qrCodeDetector.detectAndDecode(frame)
        # video_frame_rgb = frame
        if not return_key:
            break

        if points is not None: 
            nrOfPoints = len(points)
        
            for i in range(nrOfPoints):
                nextPointIndex = (i+1) % nrOfPoints
        
                cv2.line(frame, tuple(points[i][0]), tuple(points[nextPointIndex][0]), (255,0,0), 5)
        
            print(decodedText)
            # time.sleep(1)
            # y =  str()
            # x =  '{"farmName":"farm1","no":6,"id":"6399691138"}' 
            # print(decodedText == x) 
            if decodedText !="":
                data = json.loads(decodedText)
                print(data)
        else:
            print("QR code not detected")
        cv2.imshow("Image", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    print("status rgb :")
    cv2.destroyAllWindows()
    video_capture.release()

captureFramesRGB()
