#!/usr/bin/env python3

'''BasicCache class implementation for a caching system task.
'''

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    '''Inherits from BaseCaching to create a basic caching system.
    '''

    def put(self, key, item):
        '''Adds the `item` to `self.cache_data` under the provided `key`.
        '''
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        '''Retrieves the value associated with `key` in `self.cache_data`.
        '''
        return self.cache_data.get(key)
