#!/usr/bin/env python3
"""LIFOCache class implementing Last-In-First-Out caching mechanism.
"""

from collections import OrderedDict
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """Implements a caching system with LIFO eviction policy when limit is exceeded.
    """

    def __init__(self):
        """Initialize the cache with an ordered dictionary.
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Stores an item in the cache, applying LIFO eviction if cache limit is reached.
        """
        if key is not None and item is not None:
            if key not in self.cache_data and len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                last_key, _ = self.cache_data.popitem(last=True)
                print("DISCARD:", last_key)
            self.cache_data[key] = item
            self.cache_data.move_to_end(key, last=True)

    def get(self, key):
        """Returns the item associated with `key` from the cache, or None if not found.
        """
        return self.cache_data.get(key)

