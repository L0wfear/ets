#!/usr/bin/python3
"""Устанавливает для всех респонзов nginx актуальную версию фронта.

Для этого генерирует инклуд-файл, который на уровне CI подкладывается
в nginx.

"""
import os
import sys
import json


def findversion(work_dir, nginxconfig):
    filename = os.path.join(work_dir, 'package.json')
    if not os.path.exists(filename):
        print('[Error] File {} not found !!!'.format(filename))
        return

    with open(filename) as json_file:
        data = json.load(json_file)
        value = data['version']

    with open(nginxconfig, 'w') as output:
        output.write("add_header ETS-Frontend-Version {};".format(value))


#print(argv)
if len(sys.argv) == 3:
    work_dir, nginxconfig = sys.argv[1], sys.argv[2]
    findversion(work_dir, nginxconfig)
else:
    print("[Error] WRONG PARAMETERS !!!")
