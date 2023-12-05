from backend.server.brawlstars_api.endpoints import populate_brawler_data


class ServerState:
    def __init__(self):
        self.brawler_name_to_id = {}
        self.brawler_id_to_name = {}
        self.populate_brawler_data()

    def populate_brawler_data(self):
        response = populate_brawler_data(self.brawler_name_to_id)

        if response.is_error():
            raise Exception(f"Error populating brawler data: {response.error_message}")
        else:
            print("Successfully populated brawler data.")
            self.brawler_id_to_name = {v: k for k, v in self.brawler_name_to_id.items()}

    def get_brawler_id_from_name(self, brawler_name):
        return self.brawler_name_to_id[brawler_name.upper()]

    def get_brawler_name_from_id(self, brawler_id):
        return self.brawler_id_to_name[brawler_id]
