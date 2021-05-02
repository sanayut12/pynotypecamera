import json
class readfilejson:
    def __init__(self):
        self.readjson = open('config.json')
        self.data = json.load(self.readjson)

    def httphost(self):
        return  self.data['http']['host']
        
    def httpport(self):
        return  self.data['http']['port']

    def mqtthost(self):
        return self.data['mqtt']['host']
        
    def mqttport(self):
        return self.data['mqtt']['port']

    