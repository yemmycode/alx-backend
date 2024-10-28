#!/usr/bin/env python3
"""
Task 3: Deletion-resilient hypermedia pagination

This module includes a paginated view of a dataset with resilience to deletions,
ensuring consistent pagination results.
"""

import csv
import math
from typing import Dict, List, Tuple

def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Calculates start and end indices for items on a specified page."""
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return start_index, end_index

class Server:
    """Server class to paginate a database of popular baby names, resilient to deletions."""
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Loads and caches the dataset from the CSV file."""
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]  # Skip header row
        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Fetches a specific page of dataset entries based on page number and page size."""
        assert isinstance(page, int) and isinstance(page_size, int), "Page and page size must be integers."
        assert page > 0 and page_size > 0, "Page and page size must be positive."
        start, end = index_range(page, page_size)
        data = self.dataset()
        return [] if start >= len(data) else data[start:end]

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """Provides page data and metadata for a given start index and page size, resilient to deletions."""
        data = self.indexed_dataset()
        assert index is not None and 0 <= index <= max(data.keys()), "Index must be within dataset range."
        page_data, data_count = [], 0
        start = index if index else 0
        next_index = None

        for i, item in data.items():
            if i >= start and data_count < page_size:
                page_data.append(item)
                data_count += 1
                continue
            if data_count == page_size:
                next_index = i
                break

        return {
            'index': index,
            'next_index': next_index,
            'page_size': len(page_data),
            'data': page_data,
        }
