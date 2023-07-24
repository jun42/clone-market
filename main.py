from fastapi import FastAPI, UploadFile, Form, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from typing import Annotated


import sqlite3

con = sqlite3.connect("db.db", check_same_thread=False)
cur = con.cursor()

app = FastAPI()

@app.get('/images/{item_id}')
async def get_image(item_id):
    cur = con.cursor()
    image_bytes = cur.execute(f"""
        SELECT image FROM items WHERE id = {item_id}
""").fetchone()[0]
    return Response(content=bytes.fromhex(image_bytes))

@app.get("/items")
async def get_items():
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    rows = cur.execute(f"""
                        SELECT * FROM items;
                        """).fetchall()
    return rows



@app.post("/items")
async def create_item(image: UploadFile,
                title:Annotated[str,Form()],
                price:Annotated[int,Form()],
                description:Annotated[str,Form()],
                place:Annotated[str,Form()],
                insertAt:Annotated[int,Form()]):
    
    print(image,title,price,description, place, insertAt)

    image_byte = await image.read()
    cur.execute(f"""
        INSERT INTO items(title,image,price,description,place,insertAt)
        VALUES ('{title}','{image_byte.hex()}',{price},'{description}','{place}','{insertAt}')
    """)
    con.commit()
    return 200


#mount root path는 맨 밑에
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")


