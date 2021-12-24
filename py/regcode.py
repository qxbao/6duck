import sys
import pymongo
import re
from datetime import datetime, timezone

name = sys.argv[1]
fb = sys.argv[2]
dbpath = sys.argv[3]
time = datetime.now(timezone.utc)

ho = "Duong|Nguyen|Tran|Le|Chu|Lai|Dang|Hoang|Huynh|Phan|Vu|Vo|Bui|Do|Ho|Ha|Ngo|Ly|Li|Pham|Duc|Luu|Trinh|Nghiem"

db = pymongo.MongoClient(dbpath)['webserver']
usrdata = db['regcodes']

def checkValid(a,b):
    isExist = usrdata.find_one({"fb":b})
    if isExist:
        return False
    else:
        checkFB = re.search("^([a-z0-9]+([.][a-z0-9]+)*){5,50}$",b)
        checkName = re.search("^("+ho+")((\s){1}[A-Z]([a-z]){1,5}){0,5}$",a)
        if checkFB and checkName:
            return True
        else:
            return False

def codegen(one, two):
    key = two.encode("utf-8") + one.encode("utf-8")
    unp_code = int.from_bytes(key, byteorder="big")
    if len(str(unp_code)) > 9:
        p_code = int(str(unp_code)[:10])
    else:
        p_code = unp_code + 1000000000
    def findValid(q):
        x = usrdata.find_one({"code":q})
        if x:
            return findValid(q+1)
        else:
            return q
    return findValid(p_code)

regcode = codegen(name, fb)

if checkValid(name,fb):
    print("Success")
    usrdata.insert_one({'code': regcode, "name": name, "fb": fb, 'created':time, 'outdated':False})
    print(regcode)
else:
    pass
