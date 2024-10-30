#!/usr/bin/env python3
'''LRUCache class implementing Least Recently Used caching mechanism.
'''

from collections import OrderedDict
from base_caching import BaseCaching


class LRUCache(BaseCaching):
    '''Implements a caching system with an LRU eviction policy when limit is reached.
    '''

    def __init__(self):
        '''Initialize the cache with an ordered dictionary.
        '''
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Stores an item in the cache, applying LRU eviction if cache limit is exceeded.
        """
        if key is not None and item is not None:
            if key not in self.cache_data and len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                lru_key, _ = self.cache_data.popitem(last=False)
                print("DISCARD:", lru_key)
            self.cache_data[key] = item
            self.cache_data.move_to_end(key, last=False)
        else:
            self.cache_data[key] = item

    def get(self, key):
        """Returns the item associated with `key` from the cache, or None if not found.
        """
        if key in self.cache_data:
            self.cache_data.move_to_end(key, last=False)
        return self.cache_data.get(key)
