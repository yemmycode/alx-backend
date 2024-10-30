#!/usr/bin/env python3

'''FIFO Cache class implementing a First-In-First-Out caching system.
'''

from collections import OrderedDict
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    '''Inherits from BaseCaching to implement a FIFO caching system.
    '''

    def __init__(self):
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        '''Adds `item` to `self.cache_data` under `key` using FIFO policy.
        Removes the oldest entry if cache exceeds `MAX_ITEMS`.
        '''
        if key is not None and item is not None:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                oldest_key, _ = self.cache_data.popitem(last=False)
                print(f"DISCARD: {oldest_key}")

            self.cache_data[key] = item

    def get(self, key):
        '''Retrieves the value associated with `key` in `self.cache_data`.
        '''
        return self.cache_data.get(key)

