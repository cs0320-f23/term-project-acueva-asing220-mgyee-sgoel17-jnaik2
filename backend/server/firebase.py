import firebase_admin
from firebase_admin import firestore, credentials

# Application Default credentials are automatically created.
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": "cs32-final-term-project-406919",
    "private_key_id": "250dfe82bd2ea7db0f649f1a6cd2ee188f426438",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQCtwJuUqLeBMo+k\n3UprSp9BJLxHv3QPZqRf+63TClNH5P78cGNmIKC0oX0lJWXwUryTFvSTbppmctxY\nNLOEYGS3LHeV6Fcvc0ICCAkGPNpi6XbZdiXGkDCtlnCShl9qpgbDxc31bUXaofLz\nhs9vW1XqQv0RghUtLmJv2x899iTs8MPLlNYz/HYqY0EmwloD8Y8z7PeC/2A9v8GV\nuqHLMIWbKYRWdBOqwd6jNty6zg3IcdAms/ehQix71vbrQgs6saOksnj8pFD/f4AH\njax/pG3ZAS7xSEY5fDTWNoYBRDtQTkcVX874vCeIPoKk6wU5k2tyQLcy8nZWMt7f\nXP46Yte7AgMBAAECgf9C2lkCWehBTbL3PC3mGlAsQHYxJPkC8/tK8wtuqApjHzj8\n6EFWijdLSNdd84XFchAciDiSgXvm70rYpW5tAKm/0NwyUbM6Dp7XKUBPphpg9HNG\nOK9QNyqDn96wggM0ha0UpocYZ3L5LFbOXJBzyDDGcf/tPJ/pQm+dmjHrJUoP3+/Y\nv4OZrgBvM3I2ChkdylBgipBj58/LiTWsLIYo8pGcGhJzXpsXwbcAG5zSeznOpRBv\nhSntyWfu4AK7R/oImM94q2wJnlZTO9b/8yLwvYmEOB3do+xdgBv+Ol0CuwVxz2/X\n8Cg0qYUar3340om2jfpTW86H+lZzotwHVpM8SlkCgYEA74gdrV03nIRSt+JIV5od\nck0kpjvD32jFbFZrkV2U+iRZKL/95/9LvJTUh5n9PthbxX/iUM6yYqTAr9o5CiIX\nUgDSgXTWVOpkUM2xSB3/Pn6OBxXYHnYMAtv3xgBRjgva/wlVCdtQ5SqR6FIhF59W\noSRySTtY8kdE9pF6Emsh2LkCgYEAubK9sa37Keu14dyN/2jRseh1TY7In3+bdTFR\nJvOHdTlLVkDYyQGV0h5wVU9abgaDiH5QvliJuGAaUnwic+7T5ueAFOFdQRoep3jI\ni6bWn73YK4jm9RGbJP/dqUrGaT0XU1e8zIm/I8j/hR9KjVkFtx9zHvwOz5ykU7vU\nW1/Y0hMCgYB+qwuOn0oGUg9wQJCjCtPhmxvzcI1/emdUiErwH33l3gzsOMNryRzj\nCA1v/CXo8v9s7NjghL3e3mMrW4poamjMq7SmUwP4+c680Fmc2ogdI022P33/dcua\nQ3q+0XJPXMOdtPCserdHyQBJzAzF8jQcmSp6wZCi5r94aKwWS2MluQKBgBon6f4v\n4lO6Rqkklr+l9PtZIcSl2u5UXAI6yxJwdOD3C/x/L8nINmEdNnddsQAUXMyJ9jeJ\nYwScTLjXkUbBGgnJC8plH+x+kFjIc37wJgTkCaHAK7/TFgY1H/SrepzyJOnxTr+E\nm26f7hXDHY4hPuPXQzDXEgL+Lks5BqVEL9cPAoGAapw5cARzp5ToZqegED+3N9Lj\np1Ex/Nr6ZQe0IccAh6vxPtmeWklh5XTE/qyYXZ+yBr080g4aSEAKyKvrmG0IjQW4\nkfC5Jt5wCCJerdsnsEw3kDkNTLjmuNbxYIEyHTKhtEzYt4nxRX+rK0F19LTZYIJe\nqlEj6dgKfL5PS0TuEqk=\n-----END PRIVATE KEY-----\n",
    "client_email": "cs32-final-project@cs32-final-term-project-406919.iam.gserviceaccount.com",
    "client_id": "109686375208469390845",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/cs32-final-project%40cs32-final-term-project-406919.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  })
app = firebase_admin.initialize_app(cred)
db = firestore.client()

test_id = "22Q90QJV" 


def add_data(user_id: str, battle_to_add, team_to_add):
    doc_ref = db.collection("users").document(user_id)
    # doc_ref.set({"first": "Ada", "last": "Lovelace", "born": 1815})
    if doc_ref.get().exists():
        user_data = doc_ref.get().to_dict()
        if battle_to_add:
            user_data["past_battles"].append(battle_to_add)
        if team_to_add:
            user_data["past_teams"].append(team_to_add)
    else:
        doc_ref.set({"past_battles": battle_to_add, "past_teams": team_to_add})


add_data(test_id, "test_hattle", "test_team")
