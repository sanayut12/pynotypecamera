import paho.mqtt.client as mqtt 	
from readfilejson import readfilejson

config = readfilejson()
def on_connect(self, client, userdata, rc):
    print("MQTT Connected.")
    self.subscribe("message")
    # self.subscribe("number")

def on_message(client, userdata,msg):
    message = msg.payload.decode("utf-8")  # str
    print(message)

host = config.mqtthost()
port = config.mqttport()
print(host)
print(port)
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(host,port=port)
client.loop_forever()