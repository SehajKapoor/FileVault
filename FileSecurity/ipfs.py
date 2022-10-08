# -*- coding: utf-8 -*-
"""
Created on Fri Aug 12 09:14:39 2022

@author: Sagar
"""

import ipfsApi
api = ipfsApi.Client(host='https://ipfs.infura.io', port=5001)

encfile_hash = api.add('app.py')
print(encfile_hash['Hash'],encfile_hash['Name'])  
