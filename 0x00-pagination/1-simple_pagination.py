#!/usr/bin/env python3
"""
Task 1: Simple pagination.

This module provides pagination functionality for a dataset of popular baby names.
It includes:
- A helper function `index_range` to calculate start and end indices for each page.
- A `Server` class to load, cache, and retrieve paginated data from a CSV file.
"""

import csv
import math
from typing import List, Tuple

def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Calculates the start and end index range for items on a specified page."""
    return ((page - 1) * page_size, ((page - 1) * page_size) + page_size)

class Server:
    """Server class to paginate a database of popular baby names."""
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Loads and caches the dataset from a CSV file."""
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]  # Skip header row
        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Retrieves a specific page of data based on page and page size."""
        assert type(page) == int and type(page_size) == int, "Page and page size must be integers."
        assert page > 0 and page_size > 0, "Page and page size must be greater than 0."
        start, end = index_range(page, page_size)
        data = self.dataset()
        if start > len(data):
            return []
        return data[start:end]
