import psycopg

# -----------------------------
# Neon Database Configuration
# -----------------------------
HOST = "ep-shy-mountain-ahozzm8u-pooler.c-3.us-east-1.aws.neon.tech"
DBNAME = "neondb"
USER = "neondb_owner"
PASSWORD = "npg_RcBKIpD7XJ0q"  # ⚠️ Replace this if you reset your password later

# -----------------------------
# Connect to Neon
# -----------------------------
try:
    conn = psycopg.connect(
        host=HOST,
        port=5432,
        dbname=DBNAME,
        user=USER,
        password=PASSWORD,
        sslmode="require",
    )

    with conn.cursor() as cur:
        cur.execute("SELECT current_user, current_database(), version();")
        user, db, version = cur.fetchone()
        print(f"✅ Connected successfully!\nUser: {user}\nDatabase: {db}\nPostgreSQL Version: {version}")

except Exception as e:
    print("❌ Connection failed:")
    print(e)

finally:
    if 'conn' in locals() and not conn.closed:
        conn.close()
