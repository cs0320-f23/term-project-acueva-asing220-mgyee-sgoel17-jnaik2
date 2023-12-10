import psycopg2


def initialize_postgresql():
    connection = psycopg2.connect(database="brawler-ratings", host='localhost', port='5432')
    cursor = connection.cursor()
    return cursor, connection
