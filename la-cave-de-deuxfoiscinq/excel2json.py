#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Created on Sun Nov  5 18:44:02 2017

@author: ouilogique.com

%reset -f

"""

import pandas as pd
import os
from packaging import version
import sys

scriptPath = os.path.dirname(__file__)
os.chdir(scriptPath)


# %%
PANDAS_MIN_VERSION = "0.21.0"
if version.parse(pd.__version__) < version.parse(PANDAS_MIN_VERSION):
    print("\n\nLa version de Pandas installée est %s" % (pd.__version__))
    print("La version minimale est %s" % (PANDAS_MIN_VERSION))
    print("Pour installer la dernière version de Pandas,")
    print("utiliser la commande suivante :\n")
    print("conda update pandas")
    print("\n\n\n")
    sys.exit()


# %%
excelFileName = 'carte-des-vins.xlsx'
jsonFileName = 'carte-des-vins.json'

print('\n\n\nConversion de %s en %s' % (excelFileName, jsonFileName))
print('\n\nENREGISTRE LE FICHIER EXCEL AVANT DE COMMENCER !\n\n')


# %%
def nan2EmptyString(input):
    if pd.isnull(input):
        return ''
    else:
        return input


# %%
def nan2EmptyStringPrix(input):
    if pd.isnull(input):
        return ''
    else:
        return '{:0.2f}'.format(input)


# %%
data = pd.read_excel(open(excelFileName, 'rb'),
                     sheet_name=['VIGNERONS', 'CARTE-DES-VINS'])

vins = data['CARTE-DES-VINS']
vignerons = data['VIGNERONS']

s_ = ''
li_s = []
for i_, r_ in vignerons.loc[vignerons.ID_VIGNERON > 0].iterrows():

    li_v = []
    for j_, k_ in vins.loc[vins.ID_VIGNERON.isin([r_.ID_VIGNERON])].iterrows():
        li_v.append(('            {\n' +
                     '                "ID_VIN": "%s",\n' +
                     '                "APPELLATION": "%s",\n' +
                     '                "CEPAGE": "%s",\n' +
                     '                "ANNEE": %s,\n' +
                     '                "COULEUR": "%s",\n' +
                     '                "PRIX": "%s",\n' +
                     '                "QUANTITE": "%s",\n' +
                     '                "DISPONIBLE": "%s",\n' +
                     '                "REMARQUES": "%s"\n            }'
                     ) % (k_.ID_VIN,
                          k_.APPELLATION,
                          k_.CEPAGE,
                          k_.ANNEE,
                          k_.COULEUR,
                          nan2EmptyStringPrix(k_.PRIX),
                          nan2EmptyString(k_.QUANTITE),
                          nan2EmptyString(k_.DISPONIBLE),
                          nan2EmptyString(k_.REMARQUES)))

    v_ = ',\n'.join(li_v)

    li_s.append(('    {\n'
                 '        "ID_VIGNERON": "%s",\n' +
                 '        "DOMAINE": "%s",\n' +
                 '        "CAVE": "%s",\n' +
                 '        "NOM": "%s",\n' +
                 '        "URL": "%s",\n' +
                 '        "VINS": [\n%s\n        ]\n    }'
                 ) % (r_.ID_VIGNERON, r_.DOMAINE, r_.CAVE, r_.NOM, r_.URL, v_))


s_ = '[\n' + ',\n'.join(li_s) + '\n]'

jsonFile = open(jsonFileName, 'w')
jsonFile.write(s_)
jsonFile.close()

print('C’est fini !\n\n\n')
