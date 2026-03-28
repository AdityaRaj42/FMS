from database import SessionLocal
from routers.dashboard import get_activity_ticker

db = SessionLocal()
try:
    print(get_activity_ticker(db))
except Exception as e:
    import traceback
    traceback.print_exc()
