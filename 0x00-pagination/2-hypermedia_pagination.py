#!/usr/bin/env python3
"""
Task 2: Hypermedia pagination

This module provides a paginated view of a dataset, with metadata for hypermedia pagination.
"""

import csv
import math
from typing import Dict, List, Tuple

def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Calculates the start and end indices for items on a specific page."""
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return start_index, end_index

class Server:
    """Server class to provide paginated access to a database of popular baby names."""
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Loads and caches the dataset from the CSV file, if not already loaded."""
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]  # Skip header row
        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Fetches a specific page of dataset entries based on page number and size."""
        assert isinstance(page, int) and isinstance(page_size, int), "Page and page size must be integers."
        assert page > 0 and page_size > 0, "Page and page size must be greater than 0."
        start, end = index_range(page, page_size)
        data = self.dataset()
        return [] if start >= len(data) else data[start:end]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict:
        """Provides pagination metadata and the data for the specified page."""
        data = self.get_page(page, page_size)
        start, end = index_range(page, page_size)
        total_pages = math.ceil(len(self.dataset()) / page_size)
        return {
            'page_size': len(data),
            'page': page,
            'data': data,
            'next_page': page + 1 if end < len(self.dataset()) else None,
            'prev_page': page - 1 if start > 0 else None,
            'total_pages': total_pages
        }
