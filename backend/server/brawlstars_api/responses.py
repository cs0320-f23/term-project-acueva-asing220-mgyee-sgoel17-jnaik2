from enum import Enum


class BSAPIResponseType(Enum):
    SUCCESS = "success"
    HTTP_ERROR = "http_error"
    OTHER_ERROR = "other_error"


class BSAPIResponse:
    def __init__(self, response_type: BSAPIResponseType, error_string: str, data):
        self.response_type = response_type
        self.error_message = error_string
        self.data = data

    def __str__(self):
        if self.response_type == BSAPIResponseType.SUCCESS:
            return f"Response type: {self.response_type}, data: {self.data}"
        elif self.response_type == BSAPIResponseType.HTTP_ERROR:
            return f"Response type: {self.response_type}, error (HTTP): {self.error_message}, data: {self.data}"
        elif self.response_type == BSAPIResponseType.OTHER_ERROR:
            return f"Response type: {self.response_type}, error (OTHR): {self.error_message}, data: {self.data}"

    def is_error(self):
        return self.response_type != BSAPIResponseType.SUCCESS
